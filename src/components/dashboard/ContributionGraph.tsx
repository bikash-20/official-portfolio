import { motion } from 'framer-motion';
import { useGitHubContributions } from '@/hooks/useGitHub';

const levelColors = [
  'bg-surface',
  'bg-primary/20',
  'bg-primary/40',
  'bg-primary/60',
  'bg-primary',
];

export default function ContributionGraph() {
  const { grid } = useGitHubContributions();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-5 sm:p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="font-heading font-semibold text-lg">
            Contribution Activity
          </h3>
          <p className="text-xs text-text-muted mt-1">
            2,280+ contributions in the last year
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>Less</span>
          {levelColors.map((c, i) => (
            <span key={i} className={`w-3 h-3 rounded-sm ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="inline-flex gap-[3px] min-w-full">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <motion.div
                  key={di}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: (wi * 7 + di) * 0.0008 }}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm ${levelColors[day.level]} hover:ring-1 hover:ring-primary transition-all cursor-pointer`}
                  title={`${day.count} contributions on ${day.date}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
