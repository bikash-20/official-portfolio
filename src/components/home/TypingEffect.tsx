import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const phrases = [
  'I build production-grade software.',
  'I architect AI systems.',
  'I solve real problems.',
  'I ship to production weekly.',
];

export default function TypingEffect() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIndex];
    const speed = deleting ? 35 : 65;

    const timeout = setTimeout(() => {
      if (!deleting) {
        const next = phrase.slice(0, text.length + 1);
        setText(next);
        if (next === phrase) {
          setTimeout(() => setDeleting(true), 1600);
        }
      } else {
        const next = phrase.slice(0, text.length - 1);
        setText(next);
        if (next.length === 0) {
          setDeleting(false);
          setPhraseIndex((phraseIndex + 1) % phrases.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, deleting, phraseIndex]);

  return (
    <span className="inline-flex items-center">
      <span className="gradient-text font-semibold">{text}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-0.5 h-7 sm:h-9 ml-1 bg-primary"
      />
    </span>
  );
}
