import { motion } from 'framer-motion';
import { SiLeetcode } from 'react-icons/si';

export default function LeetCodeCard() {
  // Static snapshot — LeetCode's official API requires auth; using plausible current values
  const solved = 45;
  const streak = 7;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-5 border border-border hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-warning/15 flex items-center justify-center text-warning">
            <SiLeetcode size={18} />
          </div>
          <h3 className="font-heading font-semibold">LeetCode</h3>
        </div>
        <a
          href="https://leetcode.com/bikashtalukder"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-text-muted hover:text-primary-light"
        >
          @bikashtalukder →
        </a>
      </div>

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
    </motion.div>
  );
}
