import { useEffect, useState } from 'react';

/**
 * Live-tracked `prefers-reduced-motion` state.
 *
 * Returns `true` when the user has opted out of motion at the OS level.
 * Re-evaluates on media-query change so a runtime toggle (settings panel,
 * dev tools) is picked up without a reload.
 *
 * Components should branch on this to disable Framer Motion transitions and
 * CSS keyframe animations — otherwise users who explicitly opted out still
 * see the full motion show.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return reduced;
}
