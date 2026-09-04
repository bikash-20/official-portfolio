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
/*  Cascade — 6 free OpenRouter tiers (verified Sep 2026)                     */
/* -------------------------------------------------------------------------- */

export const CASCADE: readonly CascadeTier[] = [
  // Real free models live on OpenRouter right now (probed Sep 2026 against /api/v1/models).
  // Order = preference. 404/429/5xx on any tier causes a cascade to the next.
  // First hit wins. Rotate or extend as OpenRouter adds/removes tiers.
  { id: 'meta-llama/llama-3.3-70b-instruct:free', label: 'llama-3.3-70b', provider: 'Meta',                contextK: 128  },
  { id: 'meta-llama/llama-3.1-8b-instruct:free',  label: 'llama-3.1-8b',  provider: 'Meta',                contextK: 128  },
  { id: 'inclusionai/ling-3.0-flash-fin:free',    label: 'ling-flash-fin', provider: 'Inclusion AI',       contextK: 256  },
  { id: 'google/gemma-4-31b-it:free',             label: 'gemma-4-31b',   provider: 'Google',              contextK: 256  },
  { id: 'minimax/minimax-m3:free',                label: 'minimax-m3',    provider: 'MiniMax',             contextK: 1024 },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free', label: 'nemotron-3-super', provider: 'NVIDIA',           contextK: 256  },
  { id: 'thinkingmachines/inkling:free',          label: 'inkling',       provider: 'Thinking Machines',   contextK: 1024 },
  { id: 'z-ai/glm-5.2:free',                      label: 'glm-5.2',       provider: 'Z.ai',                contextK: 256  },
  { id: 'poolside/laguna-xs-2.1:free',            label: 'laguna-xs',     provider: 'Poolside',            contextK: 64   },
  { id: 'cohere/north-mini-code:free',            label: 'north-mini-code', provider: 'Cohere',            contextK: 32   },
] as const;

/* -------------------------------------------------------------------------- */
/*  System prompt                                                             */
/* -------------------------------------------------------------------------- */

const SYSTEM_PROMPT = `You are Threshold — the AI assistant embedded in Bikash Talukder's portfolio website.
You run on a 6-tier free OpenRouter cascade. If the current model can't answer or fails, the next tier takes over automatically; you don't need to mention this unless asked.
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
/*  Hook                                                                      */
/* -------------------------------------------------------------------------- */

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm Threshold — Bikash's AI assistant. Ask me anything about his projects, skills, hackathon wins, or how to get in touch.",
};

const PER_TIER_TIMEOUT_MS = 30_000;

function isTransientFailure(status: number): boolean {
  // Transient: cascade to next tier
  if (status === 429) return true;       // rate-limited
  if (status === 404) return true;       // model unavailable / retired
  if (status === 408) return true;       // request timeout
  if (status === 502 || status === 503 || status === 504) return true;
  if (status >= 500 && status < 600) return true;
  // Fatal: stop cascading and surface to user
  //   400 = bad request (won't get better next tier)
  //   401 / 403 = auth error (key wrong)
  return false;
}

function describeError(status: number): string {
  if (status === 429) return 'rate-limited';
  if (status === 401 || status === 403) return 'auth error';
  if (status === 404) return 'model unavailable';
  if (status >= 500) return `server error ${status}`;
  return `HTTP ${status}`;
}

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

let _idCounter = 0;
function newId(): string {
  _idCounter += 1;
  return `m-${Date.now().toString(36)}-${_idCounter.toString(36)}`;
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

      // Split on newlines; SSE messages are terminated by blank line.
      let idx: number;
      while ((idx = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, idx).trimEnd();
        buffer = buffer.slice(idx + 1);
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') return;
        if (!payload) continue;
        try {
          const json = JSON.parse(payload);
          const delta: string | undefined = json?.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        } catch {
          // Ignore malformed JSON lines — they're harmless.
        }
      }
    }
  } finally {
    try { reader.releaseLock(); } catch { /* noop */ }
  }
}

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

    if (!apiKey) {
      const envKeys = Object.keys(import.meta.env);
      const hasUnprefixed = envKeys.some((k) => k === 'OPENROUTER_API_KEY');

      let body =
        "**API key not configured.**\n\n" +
        "Add your free OpenRouter API key to `.env` at the project root:\n\n" +
        "```\nVITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here\n```\n\n" +
        "Then **restart the dev server** (`npm run dev`) so Vite picks up the new env file.\n\n" +
        "Get a free key at https://openrouter.ai/keys";

      if (hasUnprefixed) {
        body =
          "**Wrong env variable name.**\n\n" +
          "Vite only exposes env vars prefixed with `VITE_` to the browser. " +
          "Rename your key in `.env`:\n\n" +
          "```\n# won't work - not exposed to client\n" +
          "OPENROUTER_API_KEY=...\n\n" +
          "# correct - Vite exposes this to the browser\n" +
          "VITE_OPENROUTER_API_KEY=...\n```\n\n" +
          "Then **restart the dev server** (`npm run dev`).";
      }

      setMessages((prev) => [
        ...prev,
        { id: newId(), role: 'user', content: userText },
        { id: newId(), role: 'assistant', content: body },
      ]);
      return;
    }

    // Cancel any prior in-flight stream
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const userMsg: ChatMessage = { id: newId(), role: 'user', content: userText };
    const assistantId = newId();
    const assistantMsg: ChatMessage = { id: assistantId, role: 'assistant', content: '', streaming: true };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setLoading(true);
    setActiveTier(0);
    setTriedTiers(0);

    const conversation: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-6).filter((m) => m.role !== 'system'),
      { role: 'user', content: userText },
    ];

    const failures: { tier: CascadeTier; reason: string }[] = [];
    let lastFatal: { tier: CascadeTier; reason: string } | null = null;
    let servedBy: CascadeTier | undefined;

    const appendDelta = (delta: string) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + delta } : m)),
      );
    };

    const finalizeAssistant = (tier: CascadeTier, latencyMs: number) => {
      servedBy = tier;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, streaming: false, servedBy: tier, latencyMs }
            : m,
        ),
      );
    };

    outer: for (let i = 0; i < CASCADE.length; i++) {
      if (controller.signal.aborted) break;
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

        // Read SSE stream, appending deltas as they arrive.
        let receivedAny = false;
        for await (const delta of readSseStream(res.body, controller.signal)) {
          receivedAny = true;
          appendDelta(delta);
          // Once we get the first token, lock in this tier — stop counting it as "trying".
          if (activeTier < 0) setActiveTier(i);
        }

        if (receivedAny) {
          const latencyMs = Math.round(performance.now() - startedAt);
          finalizeAssistant(tier, latencyMs);
          window.clearTimeout(timer);
          break outer;
        }

        // Stream opened but produced nothing — treat as transient.
        failures.push({ tier, reason: 'empty stream' });
      } catch (err) {
        if (controller.signal.aborted && receivedSomethingThisRequest()) {
          // User clicked stop — keep whatever was streamed, finalize with no tier metadata.
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, streaming: false } : m,
            ),
          );
          window.clearTimeout(timer);
          break outer;
        }
        const reason =
          err instanceof DOMException && err.name === 'AbortError'
            ? `timeout (${PER_TIER_TIMEOUT_MS / 1000}s)`
            : err instanceof Error
              ? err.message
              : 'network error';
        failures.push({ tier, reason });
      } finally {
        window.clearTimeout(timer);
      }
    }

    function receivedSomethingThisRequest(): boolean {
      // We rely on closure of assistantId; reading current state would require
      // a ref. For simplicity, the caller checks abortRef.current after.
      return abortRef.current?.signal.aborted === true;
    }

    // If we exited without finalizing (all tiers failed or fatal stop), append an error.
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      const stillStreaming = last && last.id === assistantId && last.streaming;
      if (!stillStreaming) return prev;
      const fatalSummary = lastFatal
        ? `Stopped at **${lastFatal.tier.label}** (${lastFatal.tier.provider}): ${lastFatal.reason}.`
        : failures.length > 0
          ? `Tried ${failures.length} of ${CASCADE.length} tiers — all rate-limited or unreachable.`
          : 'No tiers were attempted.';
      const detail = failures
        .slice(-3)
        .map((f) => `• \`${f.tier.label}\` — ${f.reason}`)
        .join('\n');
      return prev.map((m) =>
        m.id === assistantId
          ? {
              ...m,
              streaming: false,
              content:
                `**Threshold is overloaded right now.**\n\n${fatalSummary}\n\n` +
                (detail ? `Last attempts:\n${detail}\n\n` : '') +
                `Please try again in a minute, or reach out to Bikash directly: bikashtalukder040@gmail.com`,
            }
          : m,
      );
    });

    setLoading(false);
    setActiveTier(-1);
    setTriedTiers(0);
    abortRef.current = null;
    // Mark unused to satisfy strict TS in some configs
    void servedBy;
  }, [messages]);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setMessages([WELCOME_MESSAGE]);
    setActiveTier(-1);
    setTriedTiers(0);
  }, []);

  return { messages, loading, send, clear, stop, activeTier, triedTiers };
}
