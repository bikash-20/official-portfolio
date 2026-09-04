import { motion } from 'framer-motion';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${align === 'center' ? 'text-center mx-auto' : 'text-left'} max-w-3xl`}
    >
      {eyebrow && (
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-primary-light font-semibold mb-3 px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && (
        <p className="mt-4 text-text-muted text-base sm:text-lg leading-relaxed">{subtitle}</p>
      )}
    </motion.div>
  );
}
