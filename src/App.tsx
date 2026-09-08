import { ReactLenis } from 'lenis/react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Hero from '@/components/home/Hero';
import SkillsGrid from '@/components/skills/SkillsGrid';
import Projects from '@/components/projects/Projects';
import Dashboard from '@/components/dashboard/Dashboard';
import Achievements from '@/components/achievements/Achievements';
import Interests from '@/components/interests/Interests';
import Contact from '@/components/contact/Contact';
import ChatBubble from '@/components/ai/ChatBubble';
import { SkillFilterProvider } from '@/hooks/useSkillFilter';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

/**
 * Lenis options — the "extra-heavy inertia" tuning for a senior-engineer-grade feel.
 *
 * Why each value:
 *   lerp: 0.04 — much lower than the 0.1 default → long, visible momentum tail
 *                (~1.0–1.4s of coast after the wheel stops). Reads as deliberate,
 *                premium, weighty.
 *   duration: 2.0 — baseline scroll duration (used by `scrollTo` when no easing
 *                   overrides). Pairs with the expo-out easing for fast-start /
 *                   soft-landing hash anchors.
 *   easing: expo-out, `1 - 2^(-10t)`. First ~70% of the visual travel happens
 *           in the first ~25% of the time → perceived faster than the raw 2.0s.
 *   syncTouch + syncTouchLerp: 0.025 — matching mobile inertia so touch flicks
 *                                 feel as weighted as wheel scrolling.
 *   wheelMultiplier: 1.25, touchMultiplier: 1.6 — meaningful nudge above defaults
 *                    so one wheel notch still travels a satisfying distance
 *                    under the heavier lerp.
 *   autoToggle: false — we own the `prefers-reduced-motion` switching in
 *                `useSmoothScroll` so Lenis doesn't double-toggle state on
 *                media-query changes.
 */
const LENIS_OPTIONS = {
  lerp: 0.04,
  duration: 2.0,
  easing: (t: number) => 1 - Math.pow(2, -10 * t),
  smoothWheel: true,
  syncTouch: true,
  syncTouchLerp: 0.025,
  wheelMultiplier: 1.25,
  touchMultiplier: 1.6,
  autoToggle: false,
} as const;

export default function App() {
  useSmoothScroll();
  return (
    <SkillFilterProvider>
      <ReactLenis root options={LENIS_OPTIONS}>
        <div className="min-h-screen bg-bg text-text font-body selection:bg-primary selection:text-white">
          <Navbar />
          <main>
            <Hero />
            <SkillsGrid />
            <Projects />
            <Dashboard />
            <Achievements />
            <Interests />
            <Contact />
          </main>
          <Footer />
          <ChatBubble />
        </div>
      </ReactLenis>
    </SkillFilterProvider>
  );
}
