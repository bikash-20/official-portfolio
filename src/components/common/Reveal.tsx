import {
  motion,
  type HTMLMotionProps,
  type Transition,
  type Variants,
} from 'framer-motion';
import { createContext, useContext, type ReactNode } from 'react';

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

function makeItemVariants(y: number, duration: number): Variants {
  return {
    hidden: { opacity: 0, y },
    [STAGGER_GROUP_VARIANT]: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
}

/* Context: lets a RevealGroup tell its Reveal/RevealItem children which
   variant string to drive. With stagger, the parent uses native
   staggerChildren (single trigger on the group). Without it, each child
   uses its own whileInView trigger. */
const RevealCtx = createContext<{ inStaggerGroup: boolean }>({
  inStaggerGroup: false,
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
  const { inStaggerGroup } = useContext(RevealCtx);
  const variants = makeItemVariants(y, duration);

  // Inside a stagger group: the parent drives `animate` via staggerChildren,
  // so children just inherit + use `showGroup` as their animate target.
  // Outside: child has its own viewport trigger.
  if (inStaggerGroup) {
    return (
      <motion.div variants={variants} {...rest}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: !repeat, amount }}
      variants={variants}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] } satisfies Transition}
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
  return (
    <RevealCtx.Provider value={{ inStaggerGroup: true }}>
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

export function RevealItem({
  y = 24,
  duration = 0.55,
  children,
  ...rest
}: RevealItemProps) {
  const variants = makeItemVariants(y, duration);
  return (
    <motion.div variants={variants} {...rest}>
      {children}
    </motion.div>
  );
}
