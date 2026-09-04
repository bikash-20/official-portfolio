import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 1,
    name: 'Nexora AI',
    description:
      'Next-generation IELTS 4-part preparation platform featuring voice practice, AI chat, AI compare, podcast generation, summarizer, job preparation tools, and YouTube link-to-flashcard/summary conversion.',
    tech: ['React', 'Node.js', 'OpenRouter', 'Tailwind CSS'],
    liveUrl: 'https://old-ai-code.vercel.app/index.html',
    featured: true,
    category: 'AI',
  },
  {
    id: 2,
    name: 'CENDRIX AI',
    description:
      'Next-gen intelligent learning platform with an IDE-grade editor, side-by-side LLM benchmarking, D3.js visualization lab (mind maps, algorithm visualizer, math plotter, code trace), and a 3-tier resilient inference architecture (Cloudflare → OpenRouter → Pollinations). Includes a custom QLoRA fine-tuned TinyLlama model.',
    tech: ['React', 'FastAPI', 'D3.js', 'TinyLlama', 'QLoRA'],
    liveUrl: 'https://cendrix-ai.vercel.app/',
    featured: true,
    category: 'AI',
  },
  {
    id: 3,
    name: 'LiquiGuard / iquiGuard',
    description:
      'Enterprise-grade, multi-provider liquidity command center built for the SUST CSE Carnival 2026 final round. Features real-time 12-minute rolling EWMA forecasting, anomaly detection, and an indexed 60-day PostgreSQL historical analytics layer with live transactional SSE streaming.',
    tech: ['Python', 'EWMA', 'PostgreSQL', 'SSE'],
    liveUrl: 'https://liquiguard-frontend.vercel.app/',
    githubUrl: 'https://github.com/bikash-20/SUST-Final-hackathon-project',
    featured: true,
    category: 'Enterprise',
  },
  {
    id: 4,
    name: 'PSTU Wallet',
    description:
      'Multi-provider mobile money movement and balance-tracking system (bKash, Nagad, Rocket) built as a finalist project for the PSTU National Hackathon 2026.',
    tech: ['React', 'Spring Boot', 'PostgreSQL'],
    liveUrl: 'https://frontend-alpha-inky-87.vercel.app/',
    githubUrl: 'https://github.com/bikash-20/pstu-hackathon-money-movement',
    featured: true,
    category: 'Web',
  },
  {
    id: 5,
    name: 'WalletSync',
    description:
      'Consumer-facing multi-provider mobile money balance viewer, evolved out of the LiquiGuard SUST project — now has a persona-aware fee calculator, festival spending forecaster, and spending-insights dashboard with full Bangla localization.',
    tech: ['Next.js', 'SQLite', 'TypeScript'],
    githubUrl: 'https://github.com/bikash-20/-multi-provider-mobile-money-balance-viewer-bKash-Nagad-Rocket-',
    category: 'Web',
  },
  {
    id: 6,
    name: 'Rentify — AI Car Rental',
    description:
      'Java 17 + Spring Boot 3 car rental platform with a live, data-grounded AI assistant. Context-injection architecture queries the database in real time so answers reflect the actual fleet, pricing, and revenue — zero hallucinated numbers.',
    tech: ['Java 17', 'Spring Boot 3', 'Thymeleaf'],
    liveUrl: 'https://rentify-ifs4.onrender.com/',
    githubUrl: 'https://github.com/bikash-20/2nd-year-java-project',
    category: 'Enterprise',
  },
  {
    id: 7,
    name: 'QueueStorm Investigator',
    description:
      'Safety-first, deterministic AI microservice built for the bKash SUST Hackathon preliminary round. Parses free-form customer complaints (English/Bengali/Banglish) into structured triage data using a hybrid rule + LLM architecture, with prompt-injection and phishing guardrails.',
    tech: ['FastAPI', 'OpenRouter', 'Guardrails'],
    githubUrl: 'https://github.com/bikash-20/FInal-Preliminary-Test-SUST-Hackathon',
    category: 'AI',
  },
  {
    id: 8,
    name: 'Healthcare Triage AI',
    description:
      'Offline-capable, bilingual (Bangla/English) PWA for rural community health workers. Features voice intake, automated vitals anomaly detection, prescription OCR, and adaptive LLM triage routing.',
    tech: ['React PWA', 'FastAPI', 'Cloudflare'],
    liveUrl: 'https://rural-health-triage-nine.vercel.app/',
    githubUrl: 'https://github.com/bikash-20/Healthcare-Triage-AI',
    category: 'AI',
  },
  {
    id: 9,
    name: 'Cognexa AI',
    description:
      'Authless, zero-signup AI chat assistant and voice playground. Monorepo with a FastAPI backend, fallback provider chain, local document extraction (OCR/PDF), and a glass-morphic React SPA.',
    tech: ['React', 'FastAPI', 'OCR/PDF'],
    liveUrl: 'https://cognexa-ai.vercel.app/chat',
    githubUrl: 'https://github.com/bikash-20/Cognexa-AI',
    category: 'AI',
  },
  {
    id: 10,
    name: 'JARVIS-MK1',
    description:
      'Cascading multi-model voice assistant with OpenRouter/Gemini/Grok/Ollama routing and a TTS pipeline.',
    tech: ['Python', 'OpenRouter', 'Gemini', 'Grok', 'Ollama', 'TTS'],
    githubUrl: 'https://github.com/bikash-20/AI-ENGINEERING-CODE',
    category: 'AI',
  },
  {
    id: 11,
    name: 'Nocta',
    description:
      'Glassmorphic, single-HTML-file local Ollama chat interface, developed into an MIT-licensed open-source project with a full voice pipeline.',
    tech: ['Vanilla JS', 'Ollama', 'Whisper'],
    liveUrl: 'https://bikash-20.github.io/ollama-local-model-website/',
    githubUrl: 'https://github.com/bikash-20/ollama-local-model-website',
    category: 'AI',
  },
  {
    id: 12,
    name: 'OpenHospital RMS',
    description:
      'Hospital resource and patient workflow management system, built with a Supabase (Postgres) backend, Spring Boot API, and a Vite frontend.',
    tech: ['Spring Boot', 'Supabase', 'Vite'],
    liveUrl: 'https://hospital-management-system-eta-nine.vercel.app/',
    githubUrl: 'https://github.com/bikash-20/Hospital-Management-System',
    category: 'Enterprise',
  },
  {
    id: 13,
    name: 'Coffeeshop E-Commerce',
    description:
      'High-performance, viral-aesthetic coffee shop e-commerce platform with smooth motion design, AI-powered features, and an edge-optimized RAG system. Built with Vite, deployed seamlessly across platforms.',
    tech: ['Vite', 'RAG', 'Cloudflare'],
    liveUrl: 'https://coffeshop-e-commerce-website.vercel.app/',
    githubUrl: 'https://github.com/bikash-20/Coffeshop-E-Commerce-Website',
    category: 'Web',
  },
];
