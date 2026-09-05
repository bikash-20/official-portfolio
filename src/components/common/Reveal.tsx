import {
  motion,
  type HTMLMotionProps,
  type Transition,
  type Variants,
} from 'framer-motion';
import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* -------------------------------------------------------------------------- */
/*  Reveal / RevealGroup / RevealItem                                         */
/*                                                                             */
/*  Tiny wrappers around framer-motion's whileInView that give us a single,   */
/*  consistent scroll-reveal across every section:                              */
/*                                                                             */
/*    - Default viewport: `once: true, amount: 0.15`                           */
/*      Triggers when ~15% of the element has entered the viewport — feels     */
/*      natural for cards/sections without flickering on tiny scroll bumps.   */
/*    - Default motion: fade + 24px slide-up, 550ms, ease-out                  */
/*      Tuned to read as "confident settle-in", not a slow creep.             */
/*    - Reduced motion: when `prefers-reduced-motion: reduce`, all reveals     */
/*      collapse to a no-op (opacity 1, no offset) so users who explicitly    */
/*      opted out still see content — just instantly.                          */
/*                                                                             */
/*  RevealGroup + RevealItem use framer's native `staggerChildren` so a        */
/*  single `viewport` on the parent drives the cascade — children inherit     */
/*  the same variant shape, no manual delay math.                             */
/*                                                                             */
/*  Usage:                                                                     */
/*    <Reveal>...</Reveal>                       // single element              */
/*    <RevealGroup as="ul" stagger={0.08}>       // parent + stagger            */
/*      <RevealItem index={0}>...</RevealItem>                                 */
/*      <RevealItem index={1}>...</RevealItem>                                 */
/*    </RevealGroup>                                                           */
/* -------------------------------------------------------------------------- */

type MotionProps = HTMLMotionProps<'div'>;

const STAGGER_GROUP_VARIANT = 'showGroup';

/* ---- shared variant shapes ---------------------------------------------- */

function makeItemVariants(y: number, duration: number, reduced: boolean): Variants {
  // When reduced, hidden == show so the element never animates from off-state.
  const targetY = reduced ? 0 : y;
  const targetOpacity = 1;
  const transition: Transition = reduced
    ? { duration: 0 }
    : { duration, ease: [0.22, 1, 0.36, 1] };

  return {
    hidden: { opacity: targetOpacity, y: targetY },
    [STAGGER_GROUP_VARIANT]: { opacity: targetOpacity, y: targetY, transition },
    show: { opacity: targetOpacity, y: targetY, transition },
  };
}

/* Context: lets a RevealGroup tell its Reveal/RevealItem children that the
   parent owns the entrance. The reduced-motion flag is forwarded the same
   way so every level of the cascade stays consistent. */
const RevealCtx = createContext<{ inStaggerGroup: boolean; reduced: boolean }>({
  inStaggerGroup: false,
  reduced: false,
});

/* ---- single-element reveal ---------------------------------------------- */

export interface RevealProps extends Omit<MotionProps, 'initial' | 'animate' | 'whileInView' | 'viewport' | 'transition' | 'variants'> {
  /** Vertical offset to slide from, in px. Default 24. */
  y?: number;
  /** Animation duration in seconds. Default 0.55. */
  duration?: number;
  /** How much of the element must be in view to trigger. 0–1. Default 0.15. */
  amount?: number;
  /** Replay every time the element re-enters view. Default false. */
  repeat?: boolean;
  children: ReactNode;
}

export function Reveal({
  y = 24,
  duration = 0.55,
  amount = 0.15,
  repeat = false,
  children,
  ...rest
}: RevealProps) {
  const { inStaggerGroup, reduced } = useContext(RevealCtx);
  const variants = makeItemVariants(y, duration, reduced);

  // Inside a stagger group: the parent drives `animate` via staggerChildren,
  // so children just inherit + use `showGroup` as their animate target.
  if (inStaggerGroup) {
    return (
      <motion.div variants={variants} {...rest}>
        {children}
      </motion.div>
    );
  }

  // Reduced motion: render a plain div — no intersection observer, no
  // animation, content is visible the instant it renders. This also avoids
  // running an observer for nothing.
  if (reduced) {
    return <div {...(rest as HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: !repeat, amount }}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ---- staggered group ---------------------------------------------------- */

export interface RevealGroupProps extends Omit<MotionProps, 'initial' | 'animate' | 'whileInView' | 'viewport' | 'transition' | 'variants' | 'children'> {
  /** Seconds between each item's entrance. Default 0.07. */
  stagger?: number;
  /** How much of the group must be in view to trigger. 0–1. Default 0.12. */
  amount?: number;
  /** Replay every time the group re-enters view. Default false. */
  repeat?: boolean;
  children: ReactNode;
}

export function RevealGroup({
  stagger = 0.07,
  amount = 0.12,
  repeat = false,
  children,
  ...rest
}: RevealGroupProps) {
  const reduced = useReducedMotion();

  // Reduced motion: skip the group motion entirely; render a plain div so
  // children appear immediately without any observer-driven cascade.
  if (reduced) {
    return (
      <RevealCtx.Provider value={{ inStaggerGroup: true, reduced: true }}>
        <div {...(rest as HTMLAttributes<HTMLDivElement>)}>{children}</div>
      </RevealCtx.Provider>
    );
  }

  return (
    <RevealCtx.Provider value={{ inStaggerGroup: true, reduced: false }}>
      <motion.div
        initial="hidden"
        whileInView={STAGGER_GROUP_VARIANT}
        viewport={{ once: !repeat, amount }}
        variants={{
          hidden: {},
          [STAGGER_GROUP_VARIANT]: {
            transition: {
              staggerChildren: stagger,
              delayChildren: 0.05,
            },
          },
        }}
        {...rest}
      >
        {children}
      </motion.div>
    </RevealCtx.Provider>
  );
}

/* ---- item inside a stagger group ---------------------------------------- */

export interface RevealItemProps extends Omit<MotionProps, 'initial' | 'animate' | 'whileInView' | 'viewport' | 'transition' | 'variants'> {
  /** Vertical offset to slide from, in px. Default 24. */
  y?: number;
  /** Animation duration in seconds. Default 0.55. */
  duration?: number;
  children: ReactNode;
}

export const RevealItem = forwardRef<HTMLDivElement, RevealItemProps>(function RevealItem(
  { y = 24, duration = 0.55, children, ...rest },
  ref,
) {
  const { reduced } = useContext(RevealCtx);
  const variants = makeItemVariants(y, duration, reduced);

  // Reduced motion: render a plain div, no variants propagation needed.
  // The ref is forwarded so framer-motion's PopChild measure still functions.
  if (reduced) {
    return (
      <div ref={ref} {...(rest as HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} variants={variants} {...rest}>
      {children}
    </motion.div>
  );
});
