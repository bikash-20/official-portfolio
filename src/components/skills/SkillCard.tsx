import { motion } from 'framer-motion';
import type { SkillCategory } from '@/types';

interface Props {
  category: SkillCategory;
  delay?: number;
}

function Monogram({ label, color }: { label: string; color: string }) {
  const letter = label.charAt(0).toUpperCase();
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-lg"
      style={{
        background: `${color}20`,
        border: `1px solid ${color}40`,
        color,
      }}
    >
      {letter}
    </div>
  );
}

export default function SkillCard({ category, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-2xl p-6 hover:border-primary/40 transition-all group"
    >
      <div className="flex items-center gap-3 mb-5">
        <Monogram label={category.icon} color={category.color} />
        <h3 className="font-heading font-semibold text-lg">{category.name}</h3>
      </div>

      <ul className="space-y-3">
        {category.skills.map((skill) => (
          <li key={skill.name}>
            <div className="flex justify-between text-xs sm:text-sm mb-1">
              <span className="text-text-muted">{skill.name}</span>
              <span className="text-text-muted font-mono">{skill.level}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-bg-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: delay + 0.1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${category.color}, #FF6584)`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
