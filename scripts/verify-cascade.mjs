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

const apiKey = process.env.VITE_OPENROUTER_API_KEY;
if (!apiKey) {
  console.error('ERROR: VITE_OPENROUTER_API_KEY is not set.');
  console.error('Get a free key at https://openrouter.ai/keys');
  process.exit(2);
}

const PROBE_TOKENS = 5;
const PER_TIER_TIMEOUT_MS = 15_000;
const PROMPT = 'Reply with the single word "ok".';

// Extracted from src/components/ai/useThreshold.ts by reading the file
// (no point duplicating — the script is a sibling of the source it audits).
async function loadCascade() {
  const path = resolve(process.cwd(), 'src/components/ai/useThreshold.ts');
  const src = await readFile(path, 'utf8');
  // Match the CASCADE array entries — they're `'<model>:free'` strings.
  const re = /\{\s*id:\s*'([^']+:free)'/g;
  const out = [];
  let m;
  while ((m = re.exec(src)) !== null) out.push(m[1]);
  return out;
}

async function probe(model) {
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
      return { model, ok: false, status: res.status, ms };
    }
    const j = await res.json();
    const reply = j?.choices?.[0]?.message?.content ?? '';
    return { model, ok: true, status: 200, ms, reply };
  } catch (e) {
    const ms = Date.now() - started;
    if (controller.signal.aborted) {
      return { model, ok: false, status: 0, ms, error: `timeout (${PER_TIER_TIMEOUT_MS}ms)` };
    }
    return { model, ok: false, status: 0, ms, error: e?.message ?? String(e) };
  } finally {
    clearTimeout(timer);
  }
}

(async () => {
  const ids = await loadCascade();
  console.log(`Probing ${ids.length} cascade tiers...\n`);

  const results = await Promise.all(ids.map(probe));

  const ok = results.filter((r) => r.ok);
  const bad = results.filter((r) => !r.ok);

  console.log('--- HEALTHY ---');
  if (ok.length === 0) {
    console.log('  (none)');
  } else {
    for (const r of ok) {
      console.log(`  OK  [${r.ms}ms]  ${r.model}   → "${r.reply.trim()}"`);
    }
  }

  console.log('\n--- UNHEALTHY ---');
  if (bad.length === 0) {
    console.log('  (none)');
  } else {
    for (const r of bad) {
      const detail = r.error ?? `HTTP ${r.status}`;
      console.log(`  ERR [${r.ms}ms]  ${r.model}   → ${detail}`);
    }
  }

  console.log(`\nSummary: ${ok.length}/${results.length} tiers healthy.`);
  console.log(`Last verified: ${new Date().toISOString()}`);
  console.log('\nNOTE: this script only REPORTS — it does not edit useThreshold.ts.');
  console.log('Open the file and remove dead entries from the CASCADE array.');

  process.exit(ok.length > 0 ? 0 : 1);
})();
