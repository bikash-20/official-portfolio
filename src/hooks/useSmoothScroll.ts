import { useEffect } from 'react';

/**
 * Smooth scrolling — section-by-section momentum.
 *
 * The previous hand-rolled rAF lerp had two interacting bugs that surfaced in
 * the field:
 *   1. `window.scrollTo` was patched to re-enter the lerp, but the patched
 *      version also reset `current`, which immediately zeroed any progress the
 *      rAF loop had built up.
 *   2. `prefers-reduced-motion` opt-out left the listener registered but the
 *      rAF loop unscheduled, so on some browsers wheel events fired
 *      `preventDefault` but never scrolled.
 *
 * This implementation goes back to first principles:
 *   - Use the browser's native smooth scrolling via CSS.
 *   - Add a soft CSS scroll-snap that lands on each section's top after release.
 *   - Stop intercepting wheel events entirely — let the browser handle them.
 *
 * Result: scroll feels modern and "slow" (CSS transition handles the easing),
 * wheel/keyboard/touch all work natively, no JS hot loop, zero jank.
 *
 * The hook still exists so `App.tsx` keeps a single import; it now just
 * manages scroll-padding so anchor-link jumps clear the navbar.
 */

export function useSmoothScroll(): void {
  useEffect(() => {
    // Set scroll-padding dynamically so the offset matches whatever the
    // navbar's actual height turns out to be (avoids per-section scroll-margin
    // drift when navbar layout changes).
    const nav = document.querySelector('header nav');
    if (!nav) return;

    const sync = () => {
      const h = nav.getBoundingClientRect().height;
      document.documentElement.style.scrollPaddingTop = `${Math.ceil(h)}px`;
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(nav);
    window.addEventListener('resize', sync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, []);
}
