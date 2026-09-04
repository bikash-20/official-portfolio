import { motion } from 'framer-motion';
import { FaEye, FaFilePdf, FaImage } from 'react-icons/fa';
import type { Achievement } from '@/types';

interface Props {
  achievement: Achievement;
  onView: (a: Achievement) => void;
  delay?: number;
}

export default function AchievementCard({ achievement, onView, delay = 0 }: Props) {
  const hasCert = !!achievement.certificate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-2xl p-6 border border-border hover:border-primary/40 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 font-heading font-bold text-sm text-primary-light">
            {achievement.icon.charAt(0)}
          </span>
        </div>
        <span className="text-xs text-text-muted font-mono">{achievement.date}</span>
      </div>

      <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-primary-light transition-colors">
        {achievement.title}
      </h3>
      <p className="text-sm text-primary-light mb-3">{achievement.organization}</p>
      <p className="text-sm text-text-muted leading-relaxed mb-4">
        {achievement.description}
      </p>

      {hasCert ? (
        <button
          onClick={() => onView(achievement)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary-light text-sm font-medium transition-colors"
        >
          <FaEye size={12} /> View Certificate
          <span className="text-xs text-text-muted">
            {achievement.certificateType === 'pdf' ? <FaFilePdf /> : <FaImage />}
          </span>
        </button>
      ) : (
        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface text-text-muted text-xs italic">
          Certificate coming soon
        </span>
      )}
    </motion.div>
  );
}
