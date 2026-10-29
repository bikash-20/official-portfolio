import { useCallback, useRef, useState } from 'react';
import { useChatSession } from './useChatSession';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  /** Stable id (separate from array index) so React doesn't re-mount mid-stream. */
  id: string;
  role: ChatRole;
  content: string;
  /** True while this assistant message is still receiving tokens. */
  streaming?: boolean;
  /** Tier metadata (assistant messages only) — surfaces which cascade tier served the answer. */
  servedBy?: CascadeTier;
  /** Wall-clock duration of the upstream call, ms. */
  latencyMs?: number;
}

export interface CascadeTier {
  id: string;
  label: string;
  provider: string;
  contextK: number;
}

/* -------------------------------------------------------------------------- */
/*  Cascade — free OpenRouter tiers.                                           */
/*                                                                            */
/*  ⚠️  Last verified: 2026-10-30 (audit script: scripts/verify-cascade.mjs). */
/*  OpenRouter rotates the free pool frequently. Run the audit monthly and     */
/*  prune any tier that reports ERR. Don't auto-edit this file — review the   */
/*  report first, then drop dead slugs and add replacements.                    */
/* -------------------------------------------------------------------------- */

export const CASCADE_LAST_VERIFIED = '2026-10-30';

export const CASCADE: readonly CascadeTier[] = [
  // ── Verified Active OpenRouter Free Models (verified 2026-10-30) ─────────
  // First hit wins. Any 404/429/5xx cascades automatically to the next tier.
  { id: 'google/gemma-4-31b-it:free',                         label: 'gemma-4-31b',           provider: 'Google',            contextK: 256  },
  { id: 'google/gemma-4-26b-a4b-it:free',                     label: 'gemma-4-26b-moe',       provider: 'Google',            contextK: 256  },
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free',             label: 'nemotron-3-ultra',      provider: 'NVIDIA',            contextK: 1000 },
  { id: 'nvidia/nemotron-3.5-lightning:free',                 label: 'nemotron-3.5-light',    provider: 'NVIDIA',            contextK: 1000 },
  { id: 'nvidia/nemotron-3.5-super-vl:free',                  label: 'nemotron-3.5-super-vl', provider: 'NVIDIA',            contextK: 1000 },
  { id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free', label: 'nemotron-3-nano',       provider: 'NVIDIA',            contextK: 256  },
  { id: 'thinkingmachines/inkling:free',                      label: 'inkling',               provider: 'Thinking Machines', contextK: 1024 },
  { id: 'thinkingmachines/inkling-small:free',                label: 'inkling-small',         provider: 'Thinking Machines', contextK: 1024 },
  { id: 'poolside/laguna-s-2.1:free',                         label: 'laguna-s',              provider: 'Poolside',          contextK: 256  },
  { id: 'poolside/laguna-xs-2.1:free',                        label: 'laguna-xs',             provider: 'Poolside',          contextK: 256  },
  { id: 'cohere/north-mini-code:free',                        label: 'north-mini-code',       provider: 'Cohere',            contextK: 256  },
  { id: 'dots-studio/dots-3-note-preview:free',               label: 'dots-3-note',           provider: 'Dots Studio',       contextK: 512  },
  { id: 'recursive/flint-v1.0:free',                          label: 'flint',                 provider: 'Recursive',         contextK: 256  },
  { id: 'xingchen-agi/xing4.0-29b-a4b:free',                  label: 'xing-4.0',              provider: 'XingChen',          contextK: 256  },
  { id: 'liquid/lfm-2.5-2.6b:free',                           label: 'lfm-2.5',               provider: 'LiquidAI',          contextK: 64   },
] as const;

/* -------------------------------------------------------------------------- */
/*  System prompts — two modes                                                 */
/*                                                                            */
/*  'bikash' (default): answers about Bikash and the things on his portfolio,  */
/*  but also general questions — it's a portfolio assistant, not a jail.       */
/*                                                                            */
/*  'general': drops the Bikash framing entirely. Free-form assistant. The    */
/*  upstream models' own RLHF safety is the only guardrail.                   */
/*                                                                            */
/*  Toggle mid-conversation with `/general` or `/bikash` (consumed as a       */
/*  slash command, not sent to the API), or via the UI chip in the header.    */
/* -------------------------------------------------------------------------- */

export type ThresholdMode = 'bikash' | 'general';

export const BIKASH_PROMPT = `You are Threshold — the AI assistant embedded in Bikash Talukder's portfolio website.
You run on a multi-tier free OpenRouter cascade. If the current model can't answer or fails, the next tier takes over automatically; you don't need to mention this unless asked.

About Bikash (use this whenever relevant):
- 2nd Year CSE @ Metropolitan University, CGPA 3.65
- 105 public repositories, 2,600+ GitHub contributions
- 2x National Hackathon Finalist (PSTU 2026, SUST 2026)
- Built 13+ production-grade projects
- Skills: React, Next.js, Spring Boot, FastAPI, TypeScript, Java, Python, PostgreSQL, Docker, AI/LLM

Projects (with live + GitHub links):
1. Nexora AI — IELTS prep platform (voice, AI compare, podcast, summarizer, job prep, YouTube → flashcards).
   Live: https://old-ai-code.vercel.app/index.html
2. CENDRIX AI — IDE-grade editor, side-by-side LLM benchmarking, D3.js visualization lab, 3-tier resilient inference (Cloudflare → OpenRouter → Pollinations), QLoRA fine-tuned TinyLlama.
   Live: https://cendrix-ai.vercel.app/
3. LiquiGuard / iquiGuard — Enterprise liquidity command center, 12-min EWMA forecasting, anomaly detection, 60-day PostgreSQL history, SSE streaming.
   Live: https://liquiguard-frontend.vercel.app/
   GitHub: https://github.com/bikash-20/SUST-Final-hackathon-project
4. PSTU Wallet — Multi-provider mobile money (bKash, Nagad, Rocket), PSTU Hackathon 2026 finalist.
   Live: https://frontend-alpha-inky-87.vercel.app/
   GitHub: https://github.com/bikash-20/pstu-hackathon-money-movement
5. WalletSync — Consumer-facing multi-provider mobile money balance viewer, persona-aware fee calculator, festival forecaster, Bangla localization.
   GitHub: https://github.com/bikash-20/-multi-provider-mobile-money-balance-viewer-bKash-Nagad-Rocket-
6. Rentify — AI Car Rental System, Java 17 + Spring Boot 3, context-injection AI (zero hallucination).
   Live: https://rentify-ifs4.onrender.com/
   GitHub: https://github.com/bikash-20/2nd-year-java-project
7. QueueStorm Investigator — Safety-first complaint parser (English/Bengali/Banglish), hybrid rule + LLM, prompt-injection guardrails.
   GitHub: https://github.com/bikash-20/FInal-Preliminary-Test-SUST-Hackathon
8. Healthcare Triage AI — Offline-capable bilingual (Bangla/English) PWA for rural health workers, voice intake, vitals anomaly detection, prescription OCR.
   Live: https://rural-health-triage-nine.vercel.app/
   GitHub: https://github.com/bikash-20/Healthcare-Triage-AI
9. Cognexa AI — Authless zero-signup AI chat + voice playground, FastAPI monorepo, OCR/PDF extraction, glass-morphic React SPA.
   Live: https://cognexa-ai.vercel.app/chat
   GitHub: https://github.com/bikash-20/Cognexa-AI
10. JARVIS-MK1 — Cascading multi-model voice assistant (OpenRouter/Gemini/Grok/Ollama) + TTS pipeline.
    GitHub: https://github.com/bikash-20/AI-ENGINEERING-CODE
11. Nocta — Glassmorphic single-HTML-file local Ollama chat interface, MIT-licensed, full voice pipeline.
    Live: https://bikash-20.github.io/ollama-local-model-website/
    GitHub: https://github.com/bikash-20/ollama-local-model-website
12. OpenHospital RMS — Hospital resource & patient workflow management, Supabase + Spring Boot + Vite.
    Live: https://hospital-management-system-eta-nine.vercel.app/
    GitHub: https://github.com/bikash-20/Hospital-Management-System
13. Coffeeshop E-Commerce — High-performance viral-aesthetic coffee shop platform, AI features, edge-optimized RAG, Vite.
    Live: https://coffeshop-e-commerce-website.vercel.app/
    GitHub: https://github.com/bikash-20/Coffeshop-E-Commerce-Website

Interests:
- AI / ML, Deep Learning (PyTorch, QLoRA), NLP (multilingual), LLM Engineering (prompting, fallback chains, guardrails, voice)
- Quantum Machine Learning (VQC, quantum kernels, hybrid models) — emerging frontier

Contact:
- Email: bikashtalukder040@gmail.com
- Phone / WhatsApp: +8801926240062
- LinkedIn: https://www.linkedin.com/in/bikash-talukder-6497633b8/
- GitHub: https://github.com/bikash-20
- LeetCode: https://leetcode.com/bikashtalukder
- Codeforces: https://codeforces.com/profile/talukder_20

Rules:
- Answer the user's question helpfully. When the question is about Bikash, lean on the context above. When it isn't, answer it directly using your own knowledge — don't redirect.
- Be professional and a little enthusiastic.
- Keep responses concise (2-3 paragraphs unless the user asks for more).
- Format with markdown: **bold**, lists, inline code where helpful.
- For code samples, wrap in fenced \`\`\`language blocks.
- For math, use LaTeX: $inline$ or $$display$$.
- If you don't know something specific about Bikash, say so honestly and suggest emailing him directly.`;

/**
 * General-purpose mode. Drops the Bikash framing entirely — the chat is a
 * free-form assistant powered by the same 10-tier cascade. The cascade's
 * upstream models carry their own RLHF safety; we don't add extra rules
 * on top.
 */
export const GENERAL_PROMPT = `You are Threshold — a helpful, technically capable AI assistant embedded in a developer's portfolio site.

You run on a multi-tier free OpenRouter cascade; if the current model can't answer, the next tier takes over automatically. You don't need to mention this unless asked.

Rules:
- Answer the user's question directly. Be accurate, concise, and friendly.
- Use markdown: **bold**, lists, inline code. Wrap code samples in fenced \`\`\`language blocks. Use LaTeX ($inline$ / $$display$$) for math.
- If you genuinely don't know, say so — don't invent citations, URLs, or numbers.
- Keep responses proportionate to the question. Short questions get short answers.`;

/* -------------------------------------------------------------------------- */
/*  Constants + helpers                                                       */
/* -------------------------------------------------------------------------- */

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm Threshold — Bikash's AI assistant. Ask me about his projects, skills, and hackathon wins — or anything else: switch to general mode with `/general` (back with `/bikash`).",
};

const MODE_STORAGE_KEY = 'bt-threshold-mode';

function readInitialMode(): ThresholdMode {
  if (typeof window === 'undefined') return 'bikash';
  const hinted = new URLSearchParams(window.location.search).get('mode');
  if (hinted === 'general' || hinted === 'bikash') return hinted;
  const stored = window.localStorage.getItem(MODE_STORAGE_KEY);
  if (stored === 'general' || stored === 'bikash') return stored;
  return 'bikash';
}

function systemPromptFor(mode: ThresholdMode): string {
  return mode === 'general' ? GENERAL_PROMPT : BIKASH_PROMPT;
}

/**
 * Recognises slash commands and returns the (stripped, mode-flipped)
 * payload if one was found, or null if the input should be sent verbatim.
 * Commands: `/general`, `/bikash`. Both are case-insensitive and may be
 * followed by trailing whitespace or the rest of the input as a comment.
 */
export interface SlashResult {
  /** New mode after the command. */
  mode: ThresholdMode;
  /** The text to send to the API (the body after the slash command). May be ''. */
  body: string;
  /** True if `body` after stripping is non-empty — caller may surface this as a hint. */
  hasBody: boolean;
}

export function parseSlashCommand(input: string, current: ThresholdMode): SlashResult | null {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();
  if (lower === '/general' || lower.startsWith('/general ')) {
    const body = trimmed.slice('/general'.length).trim();
    return { mode: 'general', body, hasBody: body.length > 0 };
  }
  if (lower === '/bikash' || lower.startsWith('/bikash ')) {
    const body = trimmed.slice('/bikash'.length).trim();
    return { mode: 'bikash', body, hasBody: body.length > 0 };
  }
  // Implicit switch if the user types `/mode <name>`.
  if (lower.startsWith('/mode ')) {
    const arg = lower.slice('/mode '.length).trim();
    if (arg === 'general' || arg === 'bikash') {
      const body = trimmed.slice(('/mode ' + arg).length).trim();
      return { mode: arg, body, hasBody: body.length > 0 };
    }
  }
  // No command found.
  void current; // (current is informational; not used in this parser)
  return null;
}

const PER_TIER_TIMEOUT_MS = 30_000;

/** Transient → cascade to next tier. Fatal → stop and surface. */
export function isTransientFailure(status: number): boolean {
  return status === 429 || status === 404 || status === 408
      || status === 502 || status === 503 || status === 504
      || (status >= 500 && status < 600);
}

export function describeError(status: number): string {
  if (status === 429) return 'rate-limited';
  if (status === 401 || status === 403) return 'auth error';
  if (status === 404) return 'model unavailable';
  if (status >= 500) return `server error ${status}`;
  return `HTTP ${status}`;
}

/**
 * Strip / transliterate anything outside ISO-8859-1 from a header value.
 * `fetch` throws "String contains non ISO-8859-1 code point" if a header has
 * chars like em-dash (—), smart quotes, emoji, or non-Latin scripts.
 */
function asciiHeader(value: string): string {
  try {
    const bytes = new TextEncoder().encode(value);
    let out = '';
    for (let i = 0; i < bytes.length; i++) {
      const b = bytes[i];
      out += b < 0x80 ? String.fromCharCode(b) : '?';
    }
    return out;
  } catch {
    return value.replace(/[^\x20-\x7E]/g, '?');
  }
}

/**
 * Collision-resistant message id. We keep the human-readable prefix because
 * it makes the React DevTools tree and Sentry breadcrumbs easier to scan.
 * `crypto.randomUUID()` is available in every browser we target.
 */
function newId(): string {
  return `m-${crypto.randomUUID()}`;
}

/**
 * Parse an OpenAI-compatible SSE stream.
 * Yields the `delta` content string from each `data:` chunk.
 */
async function* readSseStream(
  body: ReadableStream<Uint8Array>,
  signal: AbortSignal,
): AsyncGenerator<string, void, void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      if (signal.aborted) return;
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE messages are newline-delimited; an empty line ends a message.
      let nl: number;
      while ((nl = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, nl).trimEnd();
        buffer = buffer.slice(nl + 1);
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') return;
        if (!payload) continue;
        try {
          const json = JSON.parse(payload);
          const delta: string | undefined = json?.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        } catch {
          /* malformed line — harmless */
        }
      }
    }
  } finally {
    try { reader.releaseLock(); } catch { /* noop */ }
  }
}

const NO_KEY_BODY =
  "**API key not configured.**\n\n" +
  "Add your free OpenRouter API key to `.env` at the project root:\n\n" +
  "```\nVITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here\n```\n\n" +
  "Then **restart the dev server** (`npm run dev`) so Vite picks up the new env file.\n\n" +
  "Get a free key at https://openrouter.ai/keys";

const WRONG_PREFIX_BODY =
  "**Wrong env variable name.**\n\n" +
  "Vite only exposes env vars prefixed with `VITE_` to the browser. " +
  "Rename your key in `.env`:\n\n" +
  "```\n# won't work - not exposed to client\n" +
  "OPENROUTER_API_KEY=...\n\n" +
  "# correct - Vite exposes this to the browser\n" +
  "VITE_OPENROUTER_API_KEY=...\n```\n\n" +
  "Then **restart the dev server** (`npm run dev`).";

export const OVERLOADED_BODY = (
  fatalSummary: string,
  detail: string,
  isFatalAuth: boolean = false,
): string => {
  const header = isFatalAuth
    ? '**Threshold API Authentication Error**'
    : '**Threshold is overloaded right now.**';
  return (
    `${header}\n\n${fatalSummary}\n\n` +
    (detail ? `Last attempts:\n${detail}\n\n` : '') +
    (isFatalAuth
      ? 'Please verify that your `VITE_OPENROUTER_API_KEY` in `.env` is valid and active at https://openrouter.ai/keys.'
      : 'Please try again in a minute, or reach out to Bikash directly: bikashtalukder040@gmail.com')
  );
};

/* -------------------------------------------------------------------------- */
/*  Hook                                                                      */
/* -------------------------------------------------------------------------- */

export interface UseThresholdReturn {
  messages: ChatMessage[];
  loading: boolean;
  activeTier: number;
  triedTiers: number;
  mode: ThresholdMode;
  setMode: (mode: ThresholdMode) => void;
  send: (userText: string) => Promise<void>;
  clear: () => void;
  stop: () => void;
}

export function useThreshold(): UseThresholdReturn {
  // Message list is persisted to localStorage (see useChatSession) so
  // the chat survives a page reload. Falls back to the welcome message
  // on first visit, on parse failures, and when storage is unavailable.
  const session = useChatSession([WELCOME_MESSAGE]);
  const { messages, setMessages, clear: clearSession } = session;
  const [loading, setLoading] = useState(false);
  const [activeTier, setActiveTier] = useState(-1);
  const [triedTiers, setTriedTiers] = useState(0);
  const [mode, setModeState] = useState<ThresholdMode>(readInitialMode);
  const abortRef = useRef<AbortController | null>(null);

  const setMode = useCallback((next: ThresholdMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(MODE_STORAGE_KEY, next);
    } catch {
      /* storage unavailable — silent */
    }
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const send = useCallback(async (userText: string) => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    // ── Slash command intercept ────────────────────────────────────────────
    // `/general`, `/bikash`, `/mode <name>` switch modes and (if there's a
    // trailing body) re-send the remainder as a normal message in the new
    // mode. The slash command itself never reaches the API.
    const slash = parseSlashCommand(userText, mode);
    if (slash) {
      setMode(slash.mode);
      if (!slash.hasBody) {
        // Pure mode switch — show an in-app confirmation, no API call.
        const ack = slash.mode === 'general'
          ? "Switched to **general** mode. Ask me anything — code, math, writing, anything at all. Use `/bikash` to come back."
          : "Switched back to **Bikash-aware** mode. Ask about his projects, skills, or anything else. Use `/general` for free-form chat.";
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: 'user', content: userText },
          { id: newId(), role: 'assistant', content: ack },
        ]);
        return;
      }
      // Fall through with the stripped body.
      userText = slash.body;
    }

    // ── No key path ────────────────────────────────────────────────────────
    if (!apiKey) {
      const hasUnprefixed = Object.keys(import.meta.env).some((k) => k === 'OPENROUTER_API_KEY');
      const body = hasUnprefixed ? WRONG_PREFIX_BODY : NO_KEY_BODY;
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: 'user', content: userText },
        { id: newId(), role: 'assistant', content: body },
      ]);
      return;
    }

    // Cancel any prior in-flight stream and reset progress UI.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const assistantId = newId();
    setMessages((prev) => [
      ...prev,
      { id: newId(), role: 'user', content: userText },
      { id: assistantId, role: 'assistant', content: '', streaming: true },
    ]);
    setLoading(true);
    setActiveTier(0);
    setTriedTiers(0);

    // Truncate context window to last 6 turns for prompt-budget safety.
    const conversation = [
      { role: 'system' as const, content: systemPromptFor(mode) },
      ...messages.slice(-6).filter((m) => m.role !== 'system'),
      { role: 'user' as const, content: userText },
    ];

    const failures: { tier: CascadeTier; reason: string }[] = [];
    let lastFatal: { tier: CascadeTier; reason: string } | null = null;
    let userCancelled = false;
    let tokensReceived = false;

    const appendDelta = (delta: string) => {
      tokensReceived = true;
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + delta } : m)),
      );
    };

    const finalizeAssistant = (tier: CascadeTier | undefined, latencyMs?: number) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, streaming: false, ...(tier ? { servedBy: tier, latencyMs } : {}) }
            : m,
        ),
      );
    };

    // ── Cascade ────────────────────────────────────────────────────────────
    for (let i = 0; i < CASCADE.length; i++) {
      if (controller.signal.aborted) {
        userCancelled = true;
        break;
      }
      const tier = CASCADE[i];
      setActiveTier(i);
      setTriedTiers(i);

      // Dedicated per-tier AbortController ensures a single tier's timeout
      // does NOT abort the master controller or short-circuit subsequent tiers.
      const tierController = new AbortController();
      const onUserAbort = () => tierController.abort();
      controller.signal.addEventListener('abort', onUserAbort, { once: true });
      const timer = window.setTimeout(() => tierController.abort(), PER_TIER_TIMEOUT_MS);
      const startedAt = performance.now();

      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            'HTTP-Referer': asciiHeader(window.location.origin),
            'X-Title': asciiHeader('Bikash Talukder Portfolio - Threshold'),
          },
          body: JSON.stringify({
            model: tier.id,
            messages: conversation,
            temperature: 0.7,
            max_tokens: 800,
            stream: true,
          }),
          signal: tierController.signal,
        });

        if (!res.ok || !res.body) {
          let errDetail = '';
          try {
            const errJson = await res.json();
            if (errJson?.error?.message) {
              errDetail = `: ${errJson.error.message}`;
            }
          } catch {
            /* ignore json parse error */
          }
          const reason = res.ok ? 'no body' : `${describeError(res.status)}${errDetail}`;
          failures.push({ tier, reason });
          if (!isTransientFailure(res.status)) {
            lastFatal = { tier, reason };
            break;
          }
          continue;
        }

        for await (const delta of readSseStream(res.body, tierController.signal)) {
          appendDelta(delta);
        }

        if (tokensReceived) {
          // We committed tokens under this tier's identity. Mark that tier as the server.
          const latencyMs = Math.round(performance.now() - startedAt);
          finalizeAssistant(tier, latencyMs);
          break;
        }

        // Stream opened, returned cleanly, but no tokens. Treat as transient.
        failures.push({ tier, reason: 'empty stream' });
      } catch (err) {
        if (controller.signal.aborted) {
          // The user explicitly requested to stop.
          userCancelled = true;
          break;
        }
        const isTimeout = tierController.signal.aborted;
        const reason = isTimeout
          ? `timeout (${PER_TIER_TIMEOUT_MS / 1000}s)`
          : err instanceof Error
            ? err.message
            : 'network error';

        if (tokensReceived) {
          // If we already received tokens before a mid-stream drop, finalize what we have.
          const latencyMs = Math.round(performance.now() - startedAt);
          finalizeAssistant(tier, latencyMs);
          break;
        }
        failures.push({ tier, reason });
      } finally {
        window.clearTimeout(timer);
        controller.signal.removeEventListener('abort', onUserAbort);
      }
    }

    // ── Surface outcome if we never finalized above ───────────────────────
    if (!userCancelled) {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        const stillStreaming = last && last.id === assistantId && last.streaming;
        if (!stillStreaming) return prev;
        const isFatalAuth = Boolean(
          lastFatal && (lastFatal.reason.includes('auth error') || lastFatal.reason.includes('401') || lastFatal.reason.includes('403'))
        );
        const fatalSummary = lastFatal
          ? `Stopped at **${lastFatal.tier.label}** (${lastFatal.tier.provider}): ${lastFatal.reason}.`
          : failures.length > 0
            ? `Tried ${failures.length} of ${CASCADE.length} tiers — all rate-limited or unreachable.`
            : 'No tiers were attempted.';
        const detail = failures.slice(-3).map((f) => `• \`${f.tier.label}\` — ${f.reason}`).join('\n');
        return prev.map((m) =>
          m.id === assistantId ? { ...m, streaming: false, content: OVERLOADED_BODY(fatalSummary, detail, isFatalAuth) } : m,
        );
      });
    }

    setLoading(false);
    setActiveTier(-1);
    setTriedTiers(0);
    abortRef.current = null;
  }, [messages, mode, setMode]);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    clearSession();
    setActiveTier(-1);
    setTriedTiers(0);
  }, [clearSession]);

  return { messages, loading, send, clear, stop, activeTier, triedTiers, mode, setMode };
}
