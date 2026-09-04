import { useEffect } from 'react';

/**
 * Smooth, momentum-based vertical scrolling.
 *
 * - Intercepts wheel + touch events.
 * - Builds a *target* scroll position; rAF lerps `window.scrollY` toward it.
 * - Settles to the nearest section on release for a clean section-by-section feel.
 * - Honors `prefers-reduced-motion: reduce` by becoming a passthrough.
 * - Leaves the chat widget (#threshold-chat) and its descendants alone.
 *
 * Why hand-rolled vs Lenis? The portfolio's section list is small and known at
 * runtime via `[data-snap-section]` (or section[id]). We don't need a library
 * to do this — and shipping ~3KB of vanilla TS keeps the bundle lean.
 */

const SCROLL_LERP = 0.085;            // smaller = smoother/slower, larger = snappier
const WHEEL_GAIN = 1.0;               // multiplier on wheel deltaY
const TOUCH_GAIN = 1.1;               // multiplier on touch deltaY
const SETTLE_THRESHOLD = 0.5;         // px — close enough to target to stop rAF
const SETTLE_DELAY_MS = 110;          // ms of inactivity before snapping to nearest section
const STOP_AFTER_MS = 600;            // ms — abort rAF loop if no progress for this long

const PREFS_QUERY = '(prefers-reduced-motion: reduce)';

function shouldSmoothScroll(): boolean {
  // SSR safety + opt-out for users who want the native feel.
  if (typeof window === 'undefined') return false;
  if (window.matchMedia(PREFS_QUERY).matches) return false;
  return true;
}

function inExcludedTarget(el: EventTarget | null): boolean {
  // Chat widget owns its own scroll; never hijack its wheel events.
  if (!(el instanceof Element)) return false;
  return el.closest('#threshold-chat') !== null;
}

interface SnapSection {
  top: number;
  height: number;
}

function collectSnapSections(): SnapSection[] {
  const nodes = document.querySelectorAll<HTMLElement>('section[id], [data-snap-section]');
  const sections: SnapSection[] = [];
  nodes.forEach((el) => {
    // Skip sections explicitly opted out (e.g. chat window internals).
    if (el.dataset.snapDisable === 'true') return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    sections.push({ top, height: el.offsetHeight });
  });
  sections.sort((a, b) => a.top - b.top);
  return sections;
}

function nearestSectionTop(target: number, sections: readonly SnapSection[]): number {
  if (sections.length === 0) return target;
  let best = sections[0].top;
  let bestDelta = Math.abs(target - best);
  for (let i = 1; i < sections.length; i++) {
    const s = sections[i];
    const delta = Math.abs(target - s.top);
    if (delta < bestDelta) {
      best = s.top;
      bestDelta = delta;
    }
  }
  return best;
}

export function useSmoothScroll(): void {
  useEffect(() => {
    if (!shouldSmoothScroll()) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let rafId = 0;
    let lastActivityAt = performance.now();
    let lastFrameAt = performance.now();
    let sections: SnapSection[] = collectSnapSections();
    let settleTimer = 0;

    const recompute = () => {
      sections = collectSnapSections();
    };

    const scrollHeight = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    const clamp = (y: number) => Math.max(0, Math.min(y, scrollHeight()));

    const onWheel = (e: WheelEvent) => {
      if (inExcludedTarget(e.target)) return;
      e.preventDefault();
      target = clamp(target + e.deltaY * WHEEL_GAIN);
      lastActivityAt = performance.now();
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(snapToNearest, SETTLE_DELAY_MS);
    };

    let touchStartY = 0;
    let lastTouchY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (inExcludedTarget(e.target)) return;
      touchStartY = e.touches[0]?.clientY ?? 0;
      lastTouchY = touchStartY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (inExcludedTarget(e.target)) return;
      const y = e.touches[0]?.clientY;
      if (y == null) return;
      const delta = lastTouchY - y;
      lastTouchY = y;
      e.preventDefault();
      target = clamp(target + delta * TOUCH_GAIN);
      lastActivityAt = performance.now();
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(snapToNearest, SETTLE_DELAY_MS);
    };

    const onTouchEnd = () => {
      // Nothing to do — the rAF loop handles settling.
    };

    const onKey = (e: KeyboardEvent) => {
      // Native PageDown/PageUp/Space/Arrow keys should still work — let them through.
      // We don't smooth keyboard scrolls; users expect them to be instant.
      if (inExcludedTarget(document.activeElement)) return;
      switch (e.key) {
        case 'PageDown':
        case ' ':
          target = clamp(target + window.innerHeight * 0.9);
          e.preventDefault();
          break;
        case 'PageUp':
          target = clamp(target - window.innerHeight * 0.9);
          e.preventDefault();
          break;
        case 'Home':
          target = 0;
          e.preventDefault();
          break;
        case 'End':
          target = scrollHeight();
          e.preventDefault();
          break;
        default:
          return;
      }
      lastActivityAt = performance.now();
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(snapToNearest, SETTLE_DELAY_MS);
    };

    const snapToNearest = () => {
      const anchor = nearestSectionTop(target, sections);
      // If we're already within ~one viewport of a snap point, prefer it.
      const delta = Math.abs(target - anchor);
      if (delta < window.innerHeight * 0.5) {
        target = anchor;
      }
    };

    const tick = () => {
      const now = performance.now();
      const diff = target - current;
      const absDiff = Math.abs(diff);

      if (absDiff > SETTLE_THRESHOLD) {
        current += diff * SCROLL_LERP;
        window.scrollTo(0, current);
        lastFrameAt = now;
      }

      // Stop the rAF loop if nothing is happening to save CPU.
      if (now - lastActivityAt > STOP_AFTER_MS && absDiff <= SETTLE_THRESHOLD) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    const ensureRunning = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    // Native scroll (e.g. nav anchor click) → sync target so we don't fight it.
    const onNativeScroll = () => {
      // If the user (or a programmatic scrollTo) moved the page directly, the
      // native scrollY becomes the new target. This keeps anchor-link clicks
      // feeling smooth too.
      target = window.scrollY;
      current = window.scrollY;
      lastActivityAt = performance.now();
      ensureRunning();
    };

    // rAF runs whenever target != current; kick it on first wheel.
    const kick = () => {
      lastActivityAt = performance.now();
      ensureRunning();
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    window.addEventListener('resize', recompute);
    // Recompute on a tick after layout settles (fonts loading, images, etc.)
    const recomputeTimer = window.setTimeout(recompute, 250);

    // Patch scrollTo so React Router/Framer Motion's smooth-scroll calls still
    // work — they hit our target instead of snapping the page.
    const origScrollTo = window.scrollTo.bind(window);
    window.scrollTo = ((...args: Parameters<typeof origScrollTo>) => {
      const y = typeof args[0] === 'number' ? args[1] : (args[0] as ScrollToOptions).top ?? 0;
      target = clamp(y);
      current = window.scrollY;
      lastActivityAt = performance.now();
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(snapToNearest, SETTLE_DELAY_MS);
      ensureRunning();
    }) as typeof window.scrollTo;

    // Defer first tick — start the rAF lazily on first user input.
    const onFirstInput = () => {
      kick();
      window.removeEventListener('wheel', onFirstInput);
      window.removeEventListener('touchstart', onFirstInput);
      window.removeEventListener('keydown', onFirstInput);
    };
    window.addEventListener('wheel', onFirstInput, { passive: true });
    window.addEventListener('touchstart', onFirstInput, { passive: true });
    window.addEventListener('keydown', onFirstInput);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onNativeScroll);
      window.removeEventListener('resize', recompute);
      window.removeEventListener('wheel', onFirstInput);
      window.removeEventListener('touchstart', onFirstInput);
      window.removeEventListener('keydown', onFirstInput);
      window.clearTimeout(settleTimer);
      window.clearTimeout(recomputeTimer);
      if (rafId) cancelAnimationFrame(rafId);
      window.scrollTo = origScrollTo;
    };
  }, []);
}
