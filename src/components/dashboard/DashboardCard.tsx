import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Shared shell for every card in the Dashboard section.
 *
 * Centralises:
 *   - the glass + hover-border treatment
 *   - the icon-chip + title + right-slot header pattern
 *   - the hover-lift motion (respects reduced motion via useReducedMotion below)
 *   - consistent padding so every card lines up in the grid
 *
 * Body content is provided as children so each consumer stays free to layout
 * its own stats/figures/visualizations.
 */
interface Props {
  /** Optional accent for the icon chip background (e.g. 'bg-info/15'). */
  iconChipClass?: string;
  /** Accent text color for the chip's icon/letter. */
  iconTextClass?: string;
  /** Icon node OR a single letter for monogram cards. */
  icon: ReactNode;
  title: string;
  /** Small badge on the right side of the header (e.g. "@handle →"). */
  rightSlot?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function DashboardCard({
  iconChipClass = 'bg-primary/15',
  iconTextClass = 'text-primary-light',
  icon,
  title,
  rightSlot,
  children,
  className = '',
}: Props) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className={`glass rounded-2xl p-5 border border-border hover:border-primary/40 transition-colors h-full flex flex-col ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-9 h-9 rounded-lg ${iconChipClass} flex items-center justify-center ${iconTextClass} shrink-0`}
          >
            {icon}
          </div>
          <h3 className="font-heading font-semibold truncate">{title}</h3>
        </div>
        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </motion.div>
  );
}
