import { useCallback, useRef, useState } from 'react';

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
/*  ⚠️  Last verified: 2026-09-05 (audit script: scripts/verify-cascade.mjs). */
/*  OpenRouter rotates the free pool frequently. Run the audit monthly and     */
/*  prune any tier that reports ERR. Don't auto-edit this file — review the   */
/*  report first, then drop dead slugs and add replacements.                    */
/* -------------------------------------------------------------------------- */

export const CASCADE_LAST_VERIFIED = '2026-09-05';

export const CASCADE: readonly CascadeTier[] = [
  // First hit wins. Any 404/429/5xx cascades to the next tier.
  // Rotate or extend as OpenRouter adds/removes tiers.
  { id: 'meta-llama/llama-3.3-70b-instruct:free',   label: 'llama-3.3-70b',   provider: 'Meta',              contextK: 128  },
  { id: 'meta-llama/llama-3.1-8b-instruct:free',    label: 'llama-3.1-8b',    provider: 'Meta',              contextK: 128  },
  { id: 'inclusionai/ling-3.0-flash-fin:free',      label: 'ling-flash-fin',  provider: 'Inclusion AI',      contextK: 256  },
  { id: 'google/gemma-4-31b-it:free',               label: 'gemma-4-31b',     provider: 'Google',            contextK: 256  },
  { id: 'minimax/minimax-m3:free',                  label: 'minimax-m3',      provider: 'MiniMax',           contextK: 1024 },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free',   label: 'nemotron-3-super',provider: 'NVIDIA',            contextK: 256  },
  { id: 'thinkingmachines/inkling:free',            label: 'inkling',         provider: 'Thinking Machines', contextK: 1024 },
  { id: 'z-ai/glm-5.2:free',                        label: 'glm-5.2',         provider: 'Z.ai',              contextK: 256  },
  { id: 'poolside/laguna-xs-2.1:free',              label: 'laguna-xs',       provider: 'Poolside',          contextK: 64   },
  { id: 'cohere/north-mini-code:free',              label: 'north-mini-code', provider: 'Cohere',            contextK: 32   },
] as const;

/* -------------------------------------------------------------------------- */
/*  System prompt                                                             */
/* -------------------------------------------------------------------------- */

const SYSTEM_PROMPT = `You are Threshold — the AI assistant embedded in Bikash Talukder's portfolio website.
You run on a 10-tier free OpenRouter cascade. If the current model can't answer or fails, the next tier takes over automatically; you don't need to mention this unless asked.
Your job is to answer questions about Bikash Talukder — a Full-Stack Developer & AI Systems Builder.

Context about Bikash:
- 2nd Year CSE @ Metropolitan University, CGPA 3.65
- 78+ public repositories, 2,280+ GitHub contributions
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
- Only answer questions about Bikash.
- Be professional and enthusiastic.
- Redirect if asked about anything else.
- Keep responses concise (2-3 paragraphs).
- Format responses with markdown: use **bold**, lists, and inline code where helpful.
- For code samples, wrap in fenced \`\`\`language blocks.
- For math, use LaTeX: $inline$ or $$display$$.
- When asked about projects, quote details from the list above.
- When asked about skills, list from the provided skill set.
- If you don't know something, say "I don't have that information, but you can ask Bikash directly!"`;

/* -------------------------------------------------------------------------- */
/*  Constants + helpers                                                       */
/* -------------------------------------------------------------------------- */

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm Threshold — Bikash's AI assistant. Ask me anything about his projects, skills, hackathon wins, or how to get in touch.",
};

const PER_TIER_TIMEOUT_MS = 30_000;

/** Transient → cascade to next tier. Fatal → stop and surface. */
function isTransientFailure(status: number): boolean {
  return status === 429 || status === 404 || status === 408
      || status === 502 || status === 503 || status === 504
      || (status >= 500 && status < 600);
}

function describeError(status: number): string {
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

const OVERLOADED_BODY = (
  fatalSummary: string,
  detail: string,
): string =>
  `**Threshold is overloaded right now.**\n\n${fatalSummary}\n\n` +
  (detail ? `Last attempts:\n${detail}\n\n` : '') +
  `Please try again in a minute, or reach out to Bikash directly: bikashtalukder040@gmail.com`;

/* -------------------------------------------------------------------------- */
/*  Hook                                                                      */
/* -------------------------------------------------------------------------- */

export interface UseThresholdReturn {
  messages: ChatMessage[];
  loading: boolean;
  activeTier: number;
  triedTiers: number;
  send: (userText: string) => Promise<void>;
  clear: () => void;
  stop: () => void;
}

export function useThreshold(): UseThresholdReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [activeTier, setActiveTier] = useState(-1);
  const [triedTiers, setTriedTiers] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const send = useCallback(async (userText: string) => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

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
      { role: 'system' as const, content: SYSTEM_PROMPT },
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

      const timer = window.setTimeout(() => controller.abort(), PER_TIER_TIMEOUT_MS);
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
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const reason = res.ok ? 'no body' : describeError(res.status);
          failures.push({ tier, reason });
          if (!isTransientFailure(res.status)) {
            lastFatal = { tier, reason };
            break;
          }
          continue;
        }

        for await (const delta of readSseStream(res.body, controller.signal)) {
          appendDelta(delta);
        }

        if (tokensReceived) {
          // We committed tokens under a previous tier's identity (the assistant message
          // is already on-screen with content). Mark that tier as the server.
          const latencyMs = Math.round(performance.now() - startedAt);
          finalizeAssistant(tier, latencyMs);
          break;
        }

        // Stream opened, returned cleanly, but no tokens. Treat as transient.
        failures.push({ tier, reason: 'empty stream' });
      } catch (err) {
        const aborted = controller.signal.aborted;
        const reason = aborted
          ? `timeout (${PER_TIER_TIMEOUT_MS / 1000}s)`
          : err instanceof Error
            ? err.message
            : 'network error';
        // If the user clicked Stop and we already streamed something, keep it
        // (without tier metadata) and bail. Otherwise record the failure.
        if (aborted && tokensReceived) {
          userCancelled = true;
          break;
        }
        failures.push({ tier, reason });
      } finally {
        window.clearTimeout(timer);
      }
    }

    // ── Surface outcome if we never finalized above ───────────────────────
    if (!userCancelled) {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        const stillStreaming = last && last.id === assistantId && last.streaming;
        if (!stillStreaming) return prev;
        const fatalSummary = lastFatal
          ? `Stopped at **${lastFatal.tier.label}** (${lastFatal.tier.provider}): ${lastFatal.reason}.`
          : failures.length > 0
            ? `Tried ${failures.length} of ${CASCADE.length} tiers — all rate-limited or unreachable.`
            : 'No tiers were attempted.';
        const detail = failures.slice(-3).map((f) => `• \`${f.tier.label}\` — ${f.reason}`).join('\n');
        return prev.map((m) =>
          m.id === assistantId ? { ...m, streaming: false, content: OVERLOADED_BODY(fatalSummary, detail) } : m,
        );
      });
    }

    setLoading(false);
    setActiveTier(-1);
    setTriedTiers(0);
    abortRef.current = null;
  }, [messages]);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setMessages([WELCOME_MESSAGE]);
    setActiveTier(-1);
    setTriedTiers(0);
  }, []);

  return { messages, loading, send, clear, stop, activeTier, triedTiers };
}
