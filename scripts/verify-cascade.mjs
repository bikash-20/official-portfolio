#!/usr/bin/env node
/* -------------------------------------------------------------------------- */
/*  Cascade verification — probe each model in useThreshold.ts:33-46 with a   */
/*  tiny completion request and report which tiers respond.                    */
/*                                                                            */
/*  Usage:                                                                     */
/*    VITE_OPENROUTER_API_KEY=sk-or-v1-... node scripts/verify-cascade.mjs     */
/*                                                                            */
/*  Output: JSON-ish text report printed to stdout. Exit code 0 means at       */
/*  least one tier is healthy. Exit code 1 means every tier failed — likely    */
/*  key issue, network issue, or OpenRouter outage.                            */
/*                                                                            */
/*  What it does NOT do: automatically edit src/components/ai/useThreshold.ts */
/*  (that's a manual review). It only *reports*. Don't auto-promote — Open-   */
/*  Router ranking changes and you want human eyes on the rotation.            */
/* -------------------------------------------------------------------------- */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const apiKey = process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;

const PROBE_TOKENS = 5;
const PER_TIER_TIMEOUT_MS = 15_000;
const PROMPT = 'Reply with the single word "ok".';

// Extracted from src/components/ai/useThreshold.ts by reading the file
// (no point duplicating — the script is a sibling of the source it audits).
async function loadCascade() {
  const path = resolve(process.cwd(), 'src/components/ai/useThreshold.ts');
  const src = await readFile(path, 'utf8');
  // Match only within the CASCADE array definition
  const cascadeBlockMatch = src.match(/export const CASCADE:[\s\S]*?\] as const;/);
  if (!cascadeBlockMatch) return [];
  const cascadeBlock = cascadeBlockMatch[0];
  const re = /\{\s*id:\s*'([^']+)'/g;
  const out = [];
  let m;
  while ((m = re.exec(cascadeBlock)) !== null) out.push(m[1]);
  return out;
}

async function checkEndpointPublic(model) {
  const started = Date.now();
  try {
    const res = await fetch(`https://openrouter.ai/api/v1/models/${model}/endpoints`);
    const ms = Date.now() - started;
    if (!res.ok) {
      return { model, ok: false, status: res.status, ms, detail: `HTTP ${res.status}` };
    }
    const data = await res.json();
    const count = data.data?.endpoints?.length || 0;
    if (count > 0) {
      return { model, ok: true, status: 200, ms, detail: `${count} active provider endpoint(s)` };
    }
    return { model, ok: false, status: 200, ms, detail: '0 active provider endpoints (offline)' };
  } catch (e) {
    const ms = Date.now() - started;
    return { model, ok: false, status: 0, ms, detail: e?.message ?? String(e) };
  }
}

async function probeWithKey(model) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PER_TIER_TIMEOUT_MS);
  const started = Date.now();
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'HTTP-Referer': 'https://github.com/bikash-20/official-portfolio',
        'X-Title': 'Bikash Portfolio Cascade Audit',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: PROMPT }],
        max_tokens: PROBE_TOKENS,
        stream: false,
      }),
      signal: controller.signal,
    });
    const ms = Date.now() - started;
    if (!res.ok) {
      let errMsg = `HTTP ${res.status}`;
      try {
        const errJson = await res.json();
        if (errJson?.error?.message) errMsg += ` (${errJson.error.message})`;
      } catch {
        /* ignore */
      }
      return { model, ok: false, status: res.status, ms, detail: errMsg };
    }
    const j = await res.json();
    const reply = j?.choices?.[0]?.message?.content ?? '';
    return { model, ok: true, status: 200, ms, detail: `"${reply.trim()}"` };
  } catch (e) {
    const ms = Date.now() - started;
    if (controller.signal.aborted) {
      return { model, ok: false, status: 0, ms, detail: `timeout (${PER_TIER_TIMEOUT_MS}ms)` };
    }
    return { model, ok: false, status: 0, ms, detail: e?.message ?? String(e) };
  } finally {
    clearTimeout(timer);
  }
}

(async () => {
  const ids = await loadCascade();
  console.log(`Auditing ${ids.length} cascade tiers...`);
  if (!apiKey) {
    console.log('ℹ️  No API key provided — checking public OpenRouter provider endpoint availability.');
    console.log('   (Set VITE_OPENROUTER_API_KEY to test live chat completions)\n');
  } else {
    console.log('🔑 Probing completion endpoints with provided API key...\n');
  }

  const results = await Promise.all(ids.map((id) => (apiKey ? probeWithKey(id) : checkEndpointPublic(id))));

  const ok = results.filter((r) => r.ok);
  const bad = results.filter((r) => !r.ok);

  console.log('--- HEALTHY TIERS ---');
  if (ok.length === 0) {
    console.log('  (none)');
  } else {
    for (const r of ok) {
      console.log(`  OK  [${r.ms}ms]  ${r.model.padEnd(52)} → ${r.detail}`);
    }
  }

  console.log('\n--- UNHEALTHY / INACTIVE TIERS ---');
  if (bad.length === 0) {
    console.log('  (none)');
  } else {
    for (const r of bad) {
      console.log(`  ERR [${r.ms}ms]  ${r.model.padEnd(52)} → ${r.detail}`);
    }
  }

  console.log(`\nSummary: ${ok.length}/${results.length} tiers healthy and reachable.`);
  console.log(`Last audited: ${new Date().toISOString()}`);

  process.exit(ok.length > 0 ? 0 : 1);
})();
