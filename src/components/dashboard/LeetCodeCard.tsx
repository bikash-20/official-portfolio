import { SiLeetcode } from 'react-icons/si';
import DashboardCard from './DashboardCard';

/**
 * LeetCode card — currently renders a static snapshot.
 *
 * LeetCode doesn't expose a public stats API; the values here are a manual
 * snapshot. The "static" tag in the right slot is a small honesty cue so
 * visitors don't read the numbers as live data.
 */
export default function LeetCodeCard() {
  const solved = 45;
  const streak = 7;

  return (
    <DashboardCard
      icon={<SiLeetcode size={18} />}
      iconChipClass="bg-warning/15"
      iconTextClass="text-warning"
      title="LeetCode"
      rightSlot={
        <a
          href="https://leetcode.com/bikashtalukder"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 py-1 clip-corner-bl border border-border text-xs text-text-muted hover:text-primary-light hover:border-primary/40 transition-all duration-300"
        >
          @bikashtalukder →
        </a>
      }
    >
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="text-2xl sm:text-3xl font-heading font-bold gradient-text">{solved}</div>
          <div className="text-xs text-text-muted mt-1">Solved</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-heading font-bold gradient-text">
            #3.6M
          </div>
          <div className="text-xs text-text-muted mt-1">Rank</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-heading font-bold gradient-text">
            {streak}d
          </div>
          <div className="text-xs text-text-muted mt-1">Streak</div>
        </div>
      </div>
      <p className="mt-3 text-[10px] text-text-muted font-mono uppercase tracking-wider">
        Static snapshot — LeetCode stats API not public
      </p>
    </DashboardCard>
  );
}
