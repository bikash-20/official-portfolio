import { motion } from 'framer-motion';
import { SiCodeforces } from 'react-icons/si';

export default function CodeforcesCard() {
  // Static snapshot (codeforces handle not provided in PRD — using placeholder rating)
  const rating = 800;
  const contests = 1;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-5 border border-border hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-info/15 flex items-center justify-center text-info">
            <SiCodeforces size={18} />
          </div>
          <h3 className="font-heading font-semibold">Codeforces</h3>
        </div>
        <span className="text-xs text-text-muted">Pupil</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-2xl sm:text-3xl font-heading font-bold gradient-text">{rating}</div>
          <div className="text-xs text-text-muted mt-1">Rating</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-heading font-bold gradient-text">{contests}</div>
          <div className="text-xs text-text-muted mt-1">Contests</div>
        </div>
      </div>
    </motion.div>
  );
}
