# Bikash Talukder — Portfolio PRD (Threshold AI Context)

> **Project Name:** Bikash Talukder — Portfolio
> **Type:** Personal Portfolio Website
> **Goal:** Showcase 13+ production-grade projects, skills, achievements, and an AI assistant
> **Target Audience:** Recruiters, tech enthusiasts, open-source community
> **Tech Stack:** React + TypeScript + Vite + Tailwind CSS v4 + Framer Motion
> **AI Assistant:** OpenRouter Free Models (Llama 3.1 8B / Gemini Flash / Mistral 7B)
> **Deployment:** Vercel (auto-deploy from GitHub)

---

## 🎯 Core Objectives

- **Professional Branding** — Position Bikash as a Full-Stack Developer & AI Systems Builder
- **Project Showcase** — Highlight 13+ top projects with live demos and GitHub links
- **Skills Visualization** — Display technical competencies in a clean, organized manner
- **AI Assistant** — Deploy a **Threshold** chatbot (OpenRouter free-model cascade) that answers questions about Bikash
- **Live Dashboard** — Show GitHub stats, LeetCode progress, weather, time, and more
- **Achievements** — Display hackathon certificates and recognitions
- **Contact** — Easy ways to connect (email, WhatsApp, LinkedIn)

---

## 👤 Profile Summary

| Attribute | Details |
|-----------|---------|
| **Name** | Bikash Talukder |
| **Title** | Full-Stack Developer & AI Systems Builder |
| **Tagline** | I build production-grade software. I architect AI systems. I solve real problems. |
| **Education** | 2nd Year CSE @ Metropolitan University |
| **CGPA** | 3.65 |
| **GitHub** | 78+ public repositories, 2,280+ contributions |
| **Hackathons** | 2x National Hackathon Finalist (PSTU 2026, SUST 2026) |
| **Projects** | 13+ production-grade projects |

---

## 🧱 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (CDN + Hosting)                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           React SPA (TypeScript + Vite)             │   │
│  │                                                     │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │   │
│  │  │  Home   │ │Projects │ │ Skills  │ │Dashboard│  │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘  │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐              │   │
│  │  │Achieve- │ │Contact  │ │  AI     │              │   │
│  │  │ ments   │ │         │ │Assistant│              │   │
│  │  │         │ │         │ │(Threshold)            │   │
│  │  └─────────┘ └─────────┘ └────┬────┘              │   │
│  └─────────────────────────────────┼───────────────────┘   │
│                                    │                        │
└────────────────────────────────────┼────────────────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│  OpenRouter API     │ │   GitHub API        │ │   OpenWeather API   │
│(Threshold Cascade)  │ │  (Contributions)    │ │   (Weather Widget)  │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘
```

---

## 🛠️ Skills & Tools

### Categorized Skills

| Category | Skills |
|----------|--------|
| **Frontend** | React 18, Next.js 16, TypeScript, JavaScript, Tailwind CSS, Vite, Vanilla JS, Thymeleaf, HTML/CSS |
| **Backend** | Spring Boot 3, FastAPI, Node.js, REST APIs, WebSockets |
| **Languages** | Java, Python, TypeScript, JavaScript, Go, C++, C |
| **Database** | PostgreSQL, SQLite, H2, Redis, Supabase |
| **DevOps** | Docker, Cloudflare, Render, Vercel, GitHub Actions |
| **AI / ML** | Ollama, OpenRouter, Whisper, Piper, RAG, LangChain, PyTorch, NumPy |
| **Architecture** | Microservices, Event Sourcing, CQRS, Saga Pattern |
| **Security** | Spring Security, JWT, OAuth2, mTLS, RBAC |
| **Testing** | JUnit, Vitest, Playwright, k6 |

### Visual Style
- Interactive Icons: Hover effect with color transitions
- Proficiency Bars: Visual representation of skill level
- Category Tags: Color-coded by domain

---

## 🚀 Top Projects (13+)

### 1. Nexora AI
**Brief:** Next-generation IELTS 4-part preparation platform featuring voice practice, AI chat, AI compare, podcast generation, summarizer, job preparation tools, and YouTube link-to-flashcard/summary conversion.
**Tech Stack:** React, Node.js, OpenRouter
**Status:** 🟢 Live
- **Live:** https://old-ai-code.vercel.app/index.html
- **GitHub:** —

### 2. CENDRIX AI
**Brief:** Next-gen intelligent learning platform with an IDE-grade editor, side-by-side LLM benchmarking, D3.js visualization lab (mind maps, algorithm visualizer, math plotter, code trace), and a 3-tier resilient inference architecture (Cloudflare → OpenRouter → Pollinations). Includes a custom QLoRA fine-tuned TinyLlama model.
**Tech Stack:** React, FastAPI, D3.js, TinyLlama (QLoRA fine-tuned)
**Status:** 🟢 Live
- **Live:** https://cendrix-ai.vercel.app/
- **GitHub:** —

### 3. LiquiGuard / iquiGuard
**Brief:** Enterprise-grade, multi-provider liquidity command center built for the SUST CSE Carnival 2026 final round. Features real-time 12-minute rolling EWMA forecasting, anomaly detection, and an indexed 60-day PostgreSQL historical analytics layer with live transactional SSE streaming.
**Tech Stack:** Python, EWMA, PostgreSQL, SSE
**Status:** 🟢 Live
- **Live:** https://liquiguard-frontend.vercel.app/
- **GitHub:** https://github.com/bikash-20/SUST-Final-hackathon-project

### 4. PSTU Wallet
**Brief:** Multi-provider mobile money movement and balance-tracking system (bKash, Nagad, Rocket) built as a finalist project for the PSTU National Hackathon 2026.
**Tech Stack:** React, Spring Boot, PostgreSQL
**Status:** 🟢 Live
- **Live:** https://frontend-alpha-inky-87.vercel.app/
- **GitHub:** https://github.com/bikash-20/pstu-hackathon-money-movement

### 5. WalletSync
**Brief:** Consumer-facing multi-provider mobile money balance viewer, evolved out of the LiquiGuard/iquiGuard SUST project — now has a persona-aware fee calculator, festival spending forecaster, and spending-insights dashboard with full Bangla localization.
**Tech Stack:** Next.js, SQLite, TypeScript
**Status:** 🟢 Live
- **Live:** —
- **GitHub:** https://github.com/bikash-20/-multi-provider-mobile-money-balance-viewer-bKash-Nagad-Rocket-

### 6. Rentify — AI Car Rental System
**Brief:** Java 17 + Spring Boot 3 car rental platform with a live, data-grounded AI assistant. Context-injection architecture queries the database in real time so answers reflect the actual fleet, pricing, and revenue — zero hallucinated numbers.
**Tech Stack:** Java 17, Spring Boot 3, AI Context-Injection
**Status:** 🟢 Live
- **Live:** https://rentify-ifs4.onrender.com/
- **GitHub:** https://github.com/bikash-20/2nd-year-java-project

### 7. QueueStorm Investigator
**Brief:** Safety-first, deterministic AI microservice built for the bKash SUST Hackathon preliminary round. Parses free-form customer complaints (English/Bengali/Banglish) into structured triage data using a hybrid rule + LLM architecture, with prompt-injection and phishing guardrails.
**Tech Stack:** FastAPI, OpenRouter, Guardrails
**Status:** 🟢 Live
- **Live:** —
- **GitHub:** https://github.com/bikash-20/FInal-Preliminary-Test-SUST-Hackathon

### 8. Healthcare Triage AI
**Brief:** Offline-capable, bilingual (Bangla/English) PWA for rural community health workers. Features voice intake, automated vitals anomaly detection, prescription OCR, and adaptive LLM triage routing.
**Tech Stack:** React PWA, FastAPI, Cloudflare
**Status:** 🟢 Live
- **Live:** https://rural-health-triage-nine.vercel.app/
- **GitHub:** https://github.com/bikash-20/Healthcare-Triage-AI

### 9. Cognexa AI
**Brief:** Authless, zero-signup AI chat assistant and voice playground. Monorepo with a FastAPI backend, fallback provider chain, local document extraction (OCR/PDF), and a glass-morphic React SPA.
**Tech Stack:** React, FastAPI, OCR/PDF
**Status:** 🟢 Live
- **Live:** https://cognexa-ai.vercel.app/chat
- **GitHub:** https://github.com/bikash-20/Cognexa-AI

### 10. JARVIS-MK1
**Brief:** Cascading multi-model voice assistant with OpenRouter/Gemini/Grok/Ollama routing and a TTS pipeline.
**Tech Stack:** Python, OpenRouter, Gemini, Grok, Ollama, TTS
**Status:** 🟢 Live
- **Live:** —
- **GitHub:** https://github.com/bikash-20/AI-ENGINEERING-CODE

### 11. Nocta
**Brief:** Glassmorphic, single-HTML-file local Ollama chat interface, developed into an MIT-licensed open-source project with a full voice pipeline.
**Tech Stack:** Vanilla JS, Ollama, Whisper
**Status:** 🟢 Live
- **Live:** https://bikash-20.github.io/ollama-local-model-website/
- **GitHub:** https://github.com/bikash-20/ollama-local-model-website

### 12. OpenHospital RMS
**Brief:** Hospital resource and patient workflow management system, built with a Supabase (Postgres) backend, Spring Boot API, and a Vite frontend.
**Tech Stack:** Spring Boot, Supabase, Vite
**Status:** 🟢 Live
- **Live:** https://hospital-management-system-eta-nine.vercel.app/
- **GitHub:** https://github.com/bikash-20/Hospital-Management-System

### 13. Coffeeshop E-Commerce
**Brief:** High-performance, viral-aesthetic coffee shop e-commerce platform with smooth motion design, AI-powered features, and an edge-optimized RAG system. Built with Vite, deployed seamlessly across platforms.
**Tech Stack:** Vite, RAG, Cloudflare
**Status:** 🟢 Live
- **Live:** https://coffeshop-e-commerce-website.vercel.app/
- **GitHub:** https://github.com/bikash-20/Coffeshop-E-Commerce-Website

---

## 🤖 AI Assistant (Threshold)

### Configuration

| Attribute | Details |
|-----------|---------|
| **Name** | Threshold |
| **Provider** | OpenRouter API (Free Tier, Cascading Fallback) |
| **Models** | 6-tier free-model cascade (see below) |
| **Purpose** | Answers questions about Bikash's skills, projects, experience |
| **Cost** | $0 (Free models, rate-limited) |
| **UI** | Floating chat bubble → Modal/Widget |

### Threshold Cascade — Free Model Fallback Chain

Verified free models available on OpenRouter (September 2026). Threshold tries each tier in order, falling back automatically on any failure (rate limit, timeout, error). Typical free-tier limit per model is **20 requests/min, 200 requests/day**.

| Tier | Model ID | Provider | Context | Best For |
|------|----------|----------|---------|----------|
| **T1 — Primary** | `minimax/minimax-m3:free` | MiniMax | 1.0M | Vision/multimodal, top quality score, default first pick |
| **T2 — Fallback** | `z-ai/glm-5.2:free` | Z.ai | 256K | Highest general/coding quality, strong English |
| **T3 — Fallback** | `thinkingmachines/inkling:free` | Thinking Machines | 1.0M | Reasoning-heavy questions, large context |
| **T4 — Fallback** | `google/gemma-4-31b-it:free` | Google | 262K | Reliable, well-rounded general Q&A |
| **T5 — Fallback** | `nvidia/nemotron-3-super-120b-a12b:free` | NVIDIA | 262K | MoE backbone, fast responses |
| **T6 — Last Resort** | `openrouter/free` | OpenRouter | 200K | Auto-routed free endpoint, ensures the assistant never fully dies |

> **Why this cascade?** It's ranked by *quality + context length + provider diversity*. If T1 is throttled, T2 (different provider, coding-strong) picks up. If the network blips T1/T2, T3's huge context handles long-form Q&A. T4/T5 provide provider redundancy. T6 (`openrouter/free`) is a true catch-all — OpenRouter's own auto-routed free tier that guarantees a response even if every named model is rate-limited.

### Additional Free Models (Available, Not in Default Cascade)

These are also free on OpenRouter today but reserved as on-demand alternates or for future tuning:

| Model ID | Provider | Context |
|----------|----------|---------|
| `minimax/minimax-m2.7:free` | MiniMax | 197K |
| `thinkingmachines/inkling-small:free` | Thinking Machines | 1.0M |
| `nvidia/nemotron-3-ultra-550b-a55b:free` | NVIDIA | 1.0M |
| `nvidia/nemotron-3.5-lightning:free` | NVIDIA | 1.0M |
| `nvidia/nemotron-3.5-content-safety:free` | NVIDIA | 128K |
| `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | NVIDIA | 256K |
| `google/gemma-4-26b-a4b-it:free` | Google | 262K |
| `cohere/north-mini-code:free` | Cohere | 256K |
| `liquid/lfm-2.5-2.6b:free` | LiquidAI | 66K |
| `dots-studio/dots-3-note-preview:free` | dots-studio | 512K |
| `inclusionai/ling-3.0-flash-fin:free` | InclusionAI | 262K |
| `poolside/laguna-s-2.1:free` | Poolside | 262K |
| `poolside/laguna-xs-2.1:free` | Poolside | 262K |

### Cascade Architecture

```
User Question
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Threshold Chat Widget                        │
│                  (system prompt + context)                       │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
                    OpenRouter API call
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
  ┌──────────┐         ┌──────────┐         ┌──────────┐
  │ T1 try   │──fail─▶ │ T2 try   │──fail─▶ │ T3 try   │──fail─▶ ...
  │minimax-m3│         │ glm-5.2  │         │  inkling │
  └──────────┘         └──────────┘         └──────────┘
        │                     │                     │
        ▼                     ▼                     ▼
  ┌──────────┐         ┌──────────┐         ┌──────────┐
  │ Response │         │ Response │         │ Response │
  └──────────┘         └──────────┘         └──────────┘

  Cascade continues T4 → T5 → T6 (openrouter/free) until success.
  Each failure triggers an automatic retry on the next tier.
  Last-resort T6 is OpenRouter's auto-routed free endpoint.
```

### Failure Detection (Triggers Next Tier)

| Trigger | Action |
|---------|--------|
| HTTP 429 (rate limit) | Move to next tier |
| HTTP 5xx (server error) | Move to next tier |
| Request timeout (>15s) | Move to next tier |
| Empty / malformed response | Move to next tier |
| Refusal on out-of-scope query | Stay on tier (don't cascade), surface refusal to user |

### Tier Metadata Surfaced to User

When a response is delivered, the UI can show which tier served it (subtle indicator, not noise):

> ✓ *Answered by Tier 2 (z-ai/glm-5.2)*

This helps debug and lets users know when the primary is being bypassed.

> ⚠️ **Live limits caveat:** OpenRouter's free-tier roster and limits change frequently. The cascade is designed to absorb model changes — when a model is removed, the next tier simply becomes the new primary. Re-verify the cascade quarterly.

### Example Questions Users Can Ask
- "What are Bikash's top skills?"
- "Tell me about WalletSync."
- "What projects has Bikash built?"
- "What is Bikash's educational background?"
- "What tech stack does Bikash use?"
- "Tell me about LiquiGuard."
- "What hackathons has Bikash participated in?"
- "How can I contact Bikash?"

---

## 📊 Live Dashboard

### Widgets

| Widget | Source | Description |
|--------|--------|-------------|
| **GitHub Stats** | GitHub API | Repos (78+), contributions (2,200+), stars, followers |
| **LeetCode Progress** | LeetCode API | Problems solved, ranking, streak |
| **Codeforces Rating** | Codeforces API | Current rating, contests |
| **Weather** | OpenWeather API | Sylhet/Bangladesh weather |
| **Local Time** | Browser API | Bangladesh time with clock |
| **Activity Graph** | GitHub API | Contribution heatmap |

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  📊 Live Dashboard                                         │
│                                                             │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐    │
│  │ 📈 GitHub     │ │ 💻 LeetCode   │ │ 🌤️ Weather    │    │
│  │ 78 Repos      │ │ 45 Solved     │ │ 28°C ☀️       │    │
│  │ 2.2k Contrib  │ │ Rank #3.6M    │ │ Sylhet        │    │
│  │ 31 Followers  │ │ 7 Day Streak  │ │ Humidity 65%  │    │
│  └───────────────┘ └───────────────┘ └───────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 🔥 GitHub Contribution Graph                       │    │
│  │ [Interactive Heatmap]                              │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐    │
│  │ 🏆 Codeforces │ │ ⏰ Local Time │ │ 📅 Date       │    │
│  │ Rating: 800  │ │ 08:45 PM      │ │ Sep 5, 2026   │    │
│  │ Contests: 1   │ │ Bangladesh    │ │ Friday        │    │
│  └───────────────┘ └───────────────┘ └───────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏆 Achievements

| Achievement | Details | Certificate |
|-------------|---------|-------------|
| **PSTU National Hackathon 2026 Finalist** | Intelligent Emergency Response Platform | 📄 Uploaded |
| **Codex Community Hackathon Finalist** | SUST CSE Carnival 2026 | 📄 Uploaded |
| **2,200+ GitHub Contributions** | Top 1% among Bangladeshi students | — |
| **78+ Public Repositories** | One of the most active student developers | — |

### Display Style
- Card-based layout
- Certificate image viewer (PDF/PNG)
- Organization logos (PSTU, SUST)

---

## 🔬 Interests & Research

### AI / ML
im  deeply fascinated by artificial intelligence and machine learning as transformative technologies. my work spans practical applications of neural networks, deep learning architectures, and intelligent system design. i actively experiment with state-of-the-art models, builds production AI pipelines, and explores how AI can solve real-world problems — from education (Nexora AI, CENDRIX AI) to healthcare (Healthcare Triage AI) to enterprise tooling (LiquiGuard, QueueStorm).

### Deep Learning
He works hands-on with PyTorch to design, train, and fine-tune deep neural networks including CNNs, RNNs, and Transformer-based architectures. His interests include transfer learning, model compression, and domain-specific fine-tuning — most notably his QLoRA fine-tuned TinyLlama model inside CENDRIX AI. He believes in understanding models from first principles rather than treating them as black boxes.

### NLP (Natural Language Processing)
Bikash is passionate about building systems that understand and generate human language. His NLP work spans multilingual processing (Bangla, English, Banglish in QueueStorm), text summarization, sentiment analysis, conversational AI, and document understanding (OCR + PDF extraction in Cognexa AI). He actively follows the latest research in transformer architectures and retrieval-augmented generation.

### LLM Engineering
A core focus area — Bikash architects end-to-end LLM systems including prompt engineering, fallback provider chains (OpenRouter → Cloudflare → Pollinations), context injection for zero-hallucination answers (Rentify), guardrails for safety (QueueStorm), and voice pipelines combining Whisper, LLMs, and TTS (JARVIS-MK1, Nocta). He treats LLM engineering as a first-class software discipline.

### Quantum Machine Learning
An emerging frontier that captivates Bikash's curiosity. He is actively exploring how quantum computing principles — superposition, entanglement, and quantum parallelism — can accelerate classical machine learning workloads. His long-term research interest lies in hybrid quantum-classical models, variational quantum circuits (VQCs), and quantum kernel methods for high-dimensional data. He sees QML as the next paradigm shift in computational intelligence and is self-studying the mathematical foundations (linear algebra, quantum mechanics) required to contribute meaningfully to this field.

---

## 📞 Contact

| Platform | Details |
|----------|---------|
| **Email** | bikashtalukder040@gmail.com |
| **Phone / WhatsApp** | +8801926240062 |
| **LinkedIn** | https://www.linkedin.com/in/bikash-talukder-6497633b8/ |
| **GitHub** | https://github.com/bikash-20 |
| **LeetCode** | leetcode.com/bikashtalukder |

### Features
- Contact form (Name, Email, Message) → EmailJS integration
- Click-to-copy email/phone
- Social icons with hover animation
- "Hire Me" CTA button

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#6C63FF` (Purple) | Brand color, buttons, links |
| **Secondary** | `#FF6584` (Rose) | Accent, highlights |
| **Background** | `#0A0A0F` (Dark) | Dark mode background |
| **Surface** | `#1A1A2E` (Dark Card) | Card background |
| **Surface-2** | `#26264A` (Lighter) | Hover states |
| **Text** | `#FFFFFF` (White) | Primary text |
| **Text-Muted** | `#8888AA` (Gray) | Secondary text |
| **Border** | `#2A2A4A` (Border) | Card borders |
| **Success** | `#00C853` (Green) | Live status |

### Typography

| Role | Font |
|------|------|
| **Heading** | 'Space Grotesk', sans-serif |
| **Body** | 'Inter', sans-serif |
| **Code** | 'JetBrains Mono', monospace |

### UI Components
- Glassmorphism effects on cards
- Smooth animations (Framer Motion)
- Hover micro-interactions
- Responsive grid layout
- Dark mode primary (light mode optional)

---

## 🛠️ Technical Specification

### Frontend Stack

| Package | Version | Purpose |
|---------|---------|---------|
| React | 18.3 | Framework |
| TypeScript | 5.6 | Type safety |
| Vite | 5.4 | Bundler |
| Tailwind CSS | 4.0 | Styling |
| Framer Motion | 11.0 | Animations |
| React Router DOM | 6.26 | Routing |
| React Query | 5.59 | Data fetching |
| Axios | 1.7 | HTTP client |
| Chart.js | 4.4 | Charts |
| React Icons | 5.3 | Icons |
| React Markdown | 9.0 | Markdown rendering |

### APIs & Services

| Service | Purpose | Cost |
|---------|---------|------|
| OpenRouter (Llama 3.1 8B) | AI Assistant | Free |
| GitHub API | Repository stats, contributions | Free |
| LeetCode API | Problem solving stats | Free |
| Codeforces API | Rating and contest info | Free |
| OpenWeather API | Weather widget | Free |
| EmailJS | Contact form | Free |

### Deployment

| Platform | Purpose |
|----------|---------|
| Vercel | Frontend hosting |
| GitHub Actions | CI/CD |
| Custom Domain | bikash.dev (or bikash-20.github.io) |

---

## 📁 Project Structure

```
portfolio/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── profile.jpg
│   │   │   └── projects/
│   │   ├── certificates/
│   │   │   ├── pstu-hackathon.pdf
│   │   │   └── sust-hackathon.pdf
│   │   └── favicon/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   └── TypingEffect.tsx
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectModal.tsx
│   │   │   └── ProjectFilters.tsx
│   │   ├── skills/
│   │   │   ├── SkillsGrid.tsx
│   │   │   └── SkillCategory.tsx
│   │   ├── dashboard/
│   │   │   ├── GitHubStats.tsx
│   │   │   ├── LeetCodeStats.tsx
│   │   │   ├── CodeforcesStats.tsx
│   │   │   ├── WeatherWidget.tsx
│   │   │   ├── TimeWidget.tsx
│   │   │   └── ContributionGraph.tsx
│   │   ├── ai/
│   │   │   ├── ChatBubble.tsx
│   │   │   ├── ChatWidget.tsx
│   │   │   └── useAI.ts
│   │   ├── achievements/
│   │   │   └── AchievementCard.tsx
│   │   └── contact/
│   │       └── ContactForm.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Achievements.tsx
│   │   └── Contact.tsx
│   ├── hooks/
│   │   ├── useGitHub.ts
│   │   ├── useLeetCode.ts
│   │   ├── useCodeforces.ts
│   │   ├── useWeather.ts
│   │   └── useAI.ts
│   ├── utils/
│   │   ├── api.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── data/
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   └── achievements.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## 📊 Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Score | ≥ 95 |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 2.5s |
| Total Bundle Size | < 500KB |
| SEO | 100% |
| Accessibility | 100% |

---

## 🧠 Threshold System Prompt

```
You are Threshold, an AI assistant embedded in Bikash Talukder's portfolio website.
You run on a 6-tier OpenRouter free-model cascade (minimax-m3 → glm-5.2 → inkling → gemma-4-31b → nemotron-3-super → openrouter/free).
If the current model can't answer or fails, the next tier in the cascade automatically takes over — you don't need to mention this to the user unless asked.
Your job is to answer questions about Bikash — a Full-Stack Developer & AI Systems Builder.

Context about Bikash:
- 2nd Year CSE @ Metropolitan University, CGPA 3.65
- 78+ public repositories, 2,200+ GitHub contributions
- 2x National Hackathon Finalist (PSTU 2026, SUST 2026)
- Built 13+ production-grade projects
- Skills: React, Next.js, Spring Boot, FastAPI, TypeScript, Java, Python, PostgreSQL, Docker, AI/LLM

Projects (with live + GitHub links):
1. Nexora AI — IELTS preparation platform with voice, AI compare, podcast, summarizer, job prep, YouTube → flashcards
   Live: https://old-ai-code.vercel.app/index.html
2. CENDRIX AI — IDE-grade editor with side-by-side LLM benchmarking, D3.js visualization lab, 3-tier resilient inference (Cloudflare → OpenRouter → Pollinations), custom QLoRA fine-tuned TinyLlama
   Live: https://cendrix-ai.vercel.app/
3. LiquiGuard / iquiGuard — Enterprise liquidity command center, 12-min EWMA forecasting, anomaly detection, 60-day PostgreSQL history, SSE streaming
   Live: https://liquiguard-frontend.vercel.app/
   GitHub: https://github.com/bikash-20/SUST-Final-hackathon-project
4. PSTU Wallet — Multi-provider mobile money (bKash, Nagad, Rocket), PSTU Hackathon 2026 finalist
   Live: https://frontend-alpha-inky-87.vercel.app/
   GitHub: https://github.com/bikash-20/pstu-hackathon-money-movement
5. WalletSync — Consumer-facing multi-provider mobile money balance viewer with persona-aware fee calculator, festival forecaster, Bangla localization
   GitHub: https://github.com/bikash-20/-multi-provider-mobile-money-balance-viewer-bKash-Nagad-Rocket-
6. Rentify — AI Car Rental System, Java 17 + Spring Boot 3, context-injection AI (zero hallucination)
   Live: https://rentify-ifs4.onrender.com/
   GitHub: https://github.com/bikash-20/2nd-year-java-project
7. QueueStorm Investigator — Safety-first complaint parser (English/Bengali/Banglish), hybrid rule + LLM, prompt-injection guardrails
   GitHub: https://github.com/bikash-20/FInal-Preliminary-Test-SUST-Hackathon
8. Healthcare Triage AI — Offline-capable bilingual (Bangla/English) PWA for rural health workers, voice intake, vitals anomaly detection, prescription OCR
   Live: https://rural-health-triage-nine.vercel.app/
   GitHub: https://github.com/bikash-20/Healthcare-Triage-AI
9. Cognexa AI — Authless zero-signup AI chat + voice playground, FastAPI monorepo, OCR/PDF extraction, glass-morphic React SPA
   Live: https://cognexa-ai.vercel.app/chat
   GitHub: https://github.com/bikash-20/Cognexa-AI
10. JARVIS-MK1 — Cascading multi-model voice assistant (OpenRouter/Gemini/Grok/Ollama) + TTS pipeline
    GitHub: https://github.com/bikash-20/AI-ENGINEERING-CODE
11. Nocta — Glassmorphic single-HTML-file local Ollama chat interface, MIT-licensed, full voice pipeline
    Live: https://bikash-20.github.io/ollama-local-model-website/
    GitHub: https://github.com/bikash-20/ollama-local-model-website
12. OpenHospital RMS — Hospital resource & patient workflow management, Supabase + Spring Boot + Vite
    Live: https://hospital-management-system-eta-nine.vercel.app/
    GitHub: https://github.com/bikash-20/Hospital-Management-System
13. Coffeeshop E-Commerce — High-performance viral-aesthetic coffee shop platform, AI features, edge-optimized RAG, Vite
    Live: https://coffeshop-e-commerce-website.vercel.app/
    GitHub: https://github.com/bikash-20/Coffeshop-E-Commerce-Website

Interests:
- AI / ML — Neural networks, deep learning, computer vision
- Deep Learning — PyTorch, CNNs, Transfer Learning, QLoRA fine-tuning
- NLP — Transformers, LLMs, RAG, multilingual processing
- LLM Engineering — Prompt engineering, fallback chains, context injection, guardrails, voice pipelines
- Quantum Machine Learning — Hybrid quantum-classical models, VQCs, quantum kernel methods

Contact:
- Email: bikashtalukder040@gmail.com
- Phone / WhatsApp: +8801926240062
- LinkedIn: https://www.linkedin.com/in/bikash-talukder-6497633b8/
- GitHub: https://github.com/bikash-20

Rules:
- Only answer questions about Bikash
- Be professional and enthusiastic
- Redirect if asked about anything else
- Keep responses concise (2-3 paragraphs)
- If asked about specific projects, provide details from the list above
- If asked about skills, list from the provided skill set
- If you don't know something, say "I don't have that information, but you can ask Bikash directly!"
```

---

## ✅ Acceptance Criteria

- [x] Portfolio works on all devices (responsive)
- [x] AI Assistant answers questions about Bikash accurately
- [x] All 13+ projects displayed with live/github links
- [x] Dashboard shows live GitHub, LeetCode, weather, time data
- [x] Achievements section displays hackathon certificates
- [x] Contact section with working form and social links
- [ ] Lighthouse score ≥ 90
- [ ] Deployed on Vercel with custom domain
- [x] Threshold AI works on OpenRouter free-model cascade (T1: minimax-m3)
- [x] Cascade fallback works (T1 → T2 → T3 → T4 → T5 → T6)
- [ ] Tier-surfacing indicator visible in chat UI (which tier served the answer)

---

## 🚀 Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| Phase 1 | Basic Portfolio (Hero, Projects, Skills, Contact) | ✅ |
| Phase 2 | AI Assistant (Threshold on OpenRouter free cascade) | ✅ |
| Phase 3 | Live Dashboard (GitHub, LeetCode, Weather, Time) | 🔄 |
| Phase 4 | Achievements with Certificate Viewer | 🔄 |
| Phase 5 | Blog/Articles Section | 🔄 |
| Phase 6 | Dark/Light Theme Toggle | 🔄 |

---

**PRD Version:** 1.0
**Last Updated:** September 2026
**Status:** ✅ Ready for Development

Let's build something amazing, Bikash! Threshold is ready when you are. 🚀
