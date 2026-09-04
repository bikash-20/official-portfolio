import { useCallback, useState } from 'react';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
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
  { id: 'minimax/minimax-m3:free',           label: 'minimax-m3',     provider: 'MiniMax',            contextK: 1024 },
  { id: 'z-ai/glm-5.2:free',                 label: 'glm-5.2',        provider: 'Z.ai',               contextK: 256  },
  { id: 'thinkingmachines/inkling:free',     label: 'inkling',        provider: 'Thinking Machines',  contextK: 1024 },
  { id: 'google/gemma-4-31b-it:free',        label: 'gemma-4-31b',    provider: 'Google',             contextK: 256  },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free', label: 'nemotron-3-super', provider: 'NVIDIA',        contextK: 256  },
  { id: 'openrouter/free',                   label: 'openrouter/free', provider: 'OpenRouter',         contextK: 200  },
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
- When asked about projects, quote details from the list above.
- When asked about skills, list from the provided skill set.
- If you don't know something, say "I don't have that information, but you can ask Bikash directly!"`;

/* -------------------------------------------------------------------------- */
/*  Hook                                                                      */
/* -------------------------------------------------------------------------- */

const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content:
    "Hi! I'm Threshold — Bikash's AI assistant. Ask me anything about his projects, skills, hackathon wins, or how to get in touch.",
};

const PER_TIER_TIMEOUT_MS = 15_000;

function isTransientFailure(status: number): boolean {
  // 4xx (except 429) = non-recoverable for this prompt, do not cascade
  if (status === 429) return true;       // rate-limited → next tier
  if (status >= 500 && status < 600) return true; // server error → next tier
  return false;                          // 400/401/403/404 → stop, surface to user
}

function describeError(status: number, body: string): string {
  if (status === 429) return 'rate-limited';
  if (status === 401 || status === 403) return 'auth error';
  if (status === 404) return 'model unavailable';
  if (status >= 500) return `server error ${status}`;
  return `HTTP ${status}`;
}

export interface UseThresholdReturn {
  messages: ChatMessage[];
  loading: boolean;
  /** Index of the tier currently being tried (0-based). -1 when idle. */
  activeTier: number;
  /** Number of tiers that have failed in the current request. */
  triedTiers: number;
  send: (userText: string) => Promise<void>;
  clear: () => void;
}

export function useThreshold(): UseThresholdReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [activeTier, setActiveTier] = useState(-1);
  const [triedTiers, setTriedTiers] = useState(0);

  const send = useCallback(async (userText: string) => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    if (!apiKey) {
      // Vite only exposes env vars prefixed with `VITE_` to the browser.
      // If the user added `OPENROUTER_API_KEY=...` without the prefix, it'll
      // silently be `undefined` here. Surface the most common pitfalls.
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
          "```\n# ❌ won't work — not exposed to client\n" +
          "OPENROUTER_API_KEY=...\n\n" +
          "# ✅ correct — Vite exposes this to the browser\n" +
          "VITE_OPENROUTER_API_KEY=...\n```\n\n" +
          "Then **restart the dev server** (`npm run dev`).";
      }

      setMessages((prev) => [
        ...prev,
        { role: 'user', content: userText },
        { role: 'assistant', content: body },
      ]);
      return;
    }

    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setLoading(true);
    setActiveTier(0);
    setTriedTiers(0);

    const conversation: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      // keep last 6 turns for context (matches prior behaviour)
      ...messages.slice(-6).filter((m) => m.role !== 'system'),
      { role: 'user', content: userText },
    ];

    const failures: { tier: CascadeTier; reason: string }[] = [];
    let lastFatal: { tier: CascadeTier; reason: string } | null = null;

    for (let i = 0; i < CASCADE.length; i++) {
      const tier = CASCADE[i];
      setActiveTier(i);
      setTriedTiers(i);

      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), PER_TIER_TIMEOUT_MS);

      const startedAt = performance.now();
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Bikash Talukder Portfolio — Threshold',
          },
          body: JSON.stringify({
            model: tier.id,
            messages: conversation,
            temperature: 0.7,
            max_tokens: 600,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text();
          const reason = describeError(res.status, text);
          failures.push({ tier, reason });

          if (!isTransientFailure(res.status)) {
            // Fatal for this prompt (auth, bad request, etc.) — stop cascading.
            lastFatal = { tier, reason };
            break;
          }
          continue;
        }

        const json = await res.json();
        const reply: string | undefined = json?.choices?.[0]?.message?.content;

        if (reply && reply.trim().length > 0) {
          const latencyMs = Math.round(performance.now() - startedAt);
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: reply,
              servedBy: tier,
              latencyMs,
            },
          ]);
          setLoading(false);
          setActiveTier(-1);
          setTriedTiers(0);
          return;
        }

        // Empty body — treat as transient and cascade.
        failures.push({ tier, reason: 'empty response' });
      } catch (err) {
        const reason =
          err instanceof DOMException && err.name === 'AbortError'
            ? `timeout (${PER_TIER_TIMEOUT_MS / 1000}s)`
            : err instanceof Error
              ? err.message
              : 'network error';
        failures.push({ tier, reason });
        // continue to next tier
      } finally {
        window.clearTimeout(timer);
      }
    }

    // All tiers failed (or fatal stop)
    const fatalSummary = lastFatal
      ? `Stopped at **${lastFatal.tier.label}** (${lastFatal.tier.provider}): ${lastFatal.reason}.`
      : failures.length > 0
        ? `Tried ${failures.length} of ${CASCADE.length} tiers — all rate-limited or unreachable.`
        : 'No tiers were attempted.';

    const detail = failures
      .slice(-3)
      .map((f) => `• \`${f.tier.label}\` — ${f.reason}`)
      .join('\n');

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content:
          `**Threshold is overloaded right now.**\n\n${fatalSummary}\n\n` +
          (detail ? `Last attempts:\n${detail}\n\n` : '') +
          `Please try again in a minute, or reach out to Bikash directly: bikashtalukder040@gmail.com`,
      },
    ]);
    setLoading(false);
    setActiveTier(-1);
    setTriedTiers(0);
  }, [messages]);

  const clear = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setActiveTier(-1);
    setTriedTiers(0);
  }, []);

  return { messages, loading, send, clear, activeTier, triedTiers };
}
