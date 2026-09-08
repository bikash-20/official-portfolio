import { useEffect } from 'react';
import { useLenis } from 'lenis/react';

/**
 * Smooth scrolling — Lenis-driven inertia scroll.
 *
 * Lenis (by Studio Freight) gives the page that heavy, lerped,
 * momentum-based feel without intercepting wheel events ourselves. The
 * `<ReactLenis root options={...}>` wrapper in App.tsx mounts a single
 * global Lenis instance tied to `window` with the heavy-inertia tuning
 * (`lerp: 0.04`, `duration: 2.0`, expo-out `easing`, `syncTouch` on,
 * `wheelMultiplier: 1.25`). This hook only handles the side effects that
 * ride on top of that instance:
 *
 *   1. Keep `scroll-padding-top` in sync with the navbar height so
 *      `<a href="#id">` jumps (which fall back to native scroll when
 *      Lenis is stopped) clear the navbar.
 *   2. Honor `prefers-reduced-motion: reduce` by stopping Lenis entirely
 *      and letting the browser handle scroll natively. We disable
 *      Lenis's own `autoToggle` so this hook is the single source of
 *      truth — no doubled state churn on media-query changes.
 */

export function useSmoothScroll(): void {
  const lenis = useLenis();

  // Sync scroll-padding-top with the navbar's actual height. This is used
  // by native `<a href="#section">` jumps (and by Lenis's scrollTo offset
  // when needed) so anchored sections clear the sticky navbar.
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>('header nav');
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

  // Reduced-motion opt-out — stop Lenis entirely and let the browser
  // handle scroll. We re-evaluate on the media-query change so a user
  // toggling the OS setting at runtime gets the right behavior.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      if (!lenis) return;
      if (mq.matches) lenis.stop();
      else lenis.start();
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [lenis]);
}
