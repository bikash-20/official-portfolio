# Bikash Talukder — Portfolio
<img width="1280" height="755" alt="image" src="https://github.com/user-attachments/assets/e91da81c-32ae-4901-98d0-01ee0df20459" />
live link:https://official-portfolio-kappa-seven.vercel.app/

A single-page React portfolio for **Bikash Talukder** — Full-Stack Developer &
AI Systems Builder. Showcases 13+ projects, a live developer dashboard, an AI
chat assistant ("Threshold") that cascades through free OpenRouter models, and a
swappable multi-palette theme system.

> For the full product spec see [`PRD.md`](./PRD.md).
> For the deployed site see [bikash-20.github.io/official-portfolio](https://bikash-20.github.io/official-portfolio) (or whatever URL Vercel surfaces).

---

## Quick start

```bash
npm install
cp .env.example .env       # optional — only needed to enable live features
npm run dev                # http://localhost:5173
```

Production build + preview:

```bash
npm run build
npm run preview
```

---

## Environment variables

All keys are **optional** — the site is fully rendered with sensible fallbacks
if a key is absent. Copy `.env.example` to `.env` and fill in whichever you
have:

| Variable | Unlocks | Required for |
|---|---|---|
| `VITE_OPENROUTER_API_KEY` | Threshold AI assistant | Chat responses |
| `VITE_OPENWEATHER_API_KEY` | Sylhet live weather | Dashboard weather widget |
| `VITE_EMAILJS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` | Contact form | Form sends instead of falling back to `mailto:` |

Restart the dev server after editing `.env` so Vite picks up the new vars.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18.3 + TypeScript 5.6 (`strict: true`) |
| Bundler | Vite 5.4 with the `@` path alias mapped to `./src` |
| Styling | Tailwind CSS v4 (CSS-first `@theme` block, no `tailwind.config.js`) + a small set of glassmorphism utilities |
| Animation | Framer Motion 11 |
| Smooth scroll | Lenis (by Studio Freight) via `lenis/react` |
| AI | OpenRouter streaming SSE with a 10-tier free-model cascade |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-katex` |
| Code blocks | Prism via `react-syntax-highlighter` (lazy-loaded) |
| Contact | `@emailjs/browser` |
| Icons | `react-icons` (Heroicons + FA + Simple Icons) |

---

## Project structure

```
src/
├── App.tsx                # section composition + <ReactLenis root>
├── main.tsx               # createRoot, StrictMode
├── index.css              # Tailwind v4 @theme + glass/grid/clip-corner utilities
├── vite-env.d.ts          # typed import.meta.env
├── types/                 # shared TS interfaces
├── data/                  # projects, skills, achievements, interests, palettes
├── hooks/
│   ├── useSmoothScroll.ts # Lenis start/stop + reduced-motion opt-out
│   ├── useTheme.ts        # palette state, URL-hint aware, localStorage-persisted
│   ├── useSkillFilter.tsx # Context provider + skill-key normalization
│   └── useGitHub.ts       # GitHub user fetch + synthetic contribution grid
├── utils/helpers.ts       # formatNumber, copyToClipboard, formatDate/Time, cn
└── components/
    ├── common/            # Navbar, Footer, PalettePicker, SectionHeading
    ├── home/              # Hero, TypingEffect
    ├── skills/            # SkillsGrid, SkillCard
    ├── projects/          # Projects, ProjectCard
    ├── dashboard/         # Dashboard + GitHubStatsCard / LeetCodeCard /
    │                     # CodeforcesCard / WeatherCard / ClockCard /
    │                     # ContributionGraph
    ├── achievements/      # Achievements, AchievementCard, CertificateModal
    ├── interests/         # Interests
    ├── contact/           # Contact
    └── ai/                # ChatBubble, ChatWidget, MarkdownContent,
                          # CodeBlock (lazy), useThreshold (cascade hook)
```

---

## Feature highlights

### Threshold AI chat

`src/components/ai/useThreshold.ts` implements a **10-tier free OpenRouter
cascade** (rotated quarterly as OpenRouter adds/removes models):

1. Streams OpenAI-compatible SSE from `openrouter.ai/api/v1/chat/completions`.
2. Per-tier 30s timeout; on transient failure (429/404/408/5xx) advances to
   the next tier; on non-transient (401/403) stops and surfaces.
3. Once any tokens arrive, the streaming tier becomes the message's `servedBy`
   metadata — surfaced in the UI as a tier chip + latency readout.
4. Graceful no-key path: prints a multi-paragraph markdown message telling you
   exactly which env var to set and why a `OPENROUTER_API_KEY` (without `VITE_`)
   won't work.
5. `Stop` mid-stream aborts via an `AbortController` ref; partial tokens are
   preserved.

The full system prompt — including all 13 project links, interests, contact
info, and behavioral rules — is embedded in the hook and serves as the model
context.

### Palettes

Six dark themes live in `src/data/palettes.ts`. **Midnight** (deep teal +
champagne) is the default and is mirrored in `src/index.css`'s `@theme` block
so the first paint is correct before `useTheme` mounts. Use `?palette=` in the
URL to deep-link to any theme; the choice persists in `localStorage`.

### Smooth scroll

`useSmoothScroll` is a thin wrapper around Lenis. The hook:
- syncs `scroll-padding-top` with the navbar's actual height via `ResizeObserver`;
- listens for `prefers-reduced-motion: reduce` and calls `lenis.stop()` /
  `lenis.start()` accordingly.

The chat widget's message list carries `data-lenis-prevent` so wheel events
inside the chat scroll only the message list, not the page.

### Skill filter

`useSkillFilter` exposes a Context with `selected: Set<string>`, `toggle`,
`clear`, `isSelected`, `isActive`. `normalizeSkill()` lowercases and strips
trailing versions, so `"React 18"` and `"React"` collide on the same key.
`projectMatchesFilter(tech[], selected)` is used by the Projects grid to
cross-filter by *both* category and any selected skill.

---

## Conventions

- **Tailwind**: classes inline; semantic color tokens are exposed as `bg-primary`,
  `text-text`, etc. (declared via Tailwind v4 `@theme` in `index.css`). Don't
  hard-code hex values in components — use the tokens so themes Just Work.
- **Sections**: every section has `id="…"`. The navbar links + Lenis scrollTo
  rely on those IDs. Anchored sections also clear the sticky navbar by
  inheriting `scroll-padding-top` from the hook.
- **CTAs**: prefer pill or cut-corner shapes via the utilities in
  `src/index.css` (`rounded-full`, `.clip-corner-tr`, `.clip-corner-bl`). The
  four section grids use the cut-corner motif for visual rhythm.
- **Motion**: respects `prefers-reduced-motion`. Add new motion behind that
  media query.
- **Data files**: `src/data/*` are the source of truth for content shown in
  the UI. Update them, not the components, when copy changes.

---

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check via `tsc -b`, then `vite build` |
| `npm run preview` | Serve the production build locally |

---

## Deployment

The repo ships with a `vite build` output ready for any static host. Vercel
auto-detects Vite; just import the GitHub repo. The `index.html` already
includes OG tags, a `theme-color` matching the Midnight bg, and the
Inter/Space Grotesk/JetBrains Mono font preloads.

---

## License

Personal portfolio. Source-available for reference; no license granted for
reuse without permission.
