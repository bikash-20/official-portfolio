import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaRegClock } from 'react-icons/fa';

export default function ClockCard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Dhaka',
  });

  const date = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  });

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-5 border border-border hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary-light">
            <FaRegClock size={16} />
          </div>
          <h3 className="font-heading font-semibold">Local Time</h3>
        </div>
        <span className="text-xs text-text-muted">BD · GMT+6</span>
      </div>

      <div className="font-mono text-xl sm:text-2xl font-semibold text-text">
        {time}
      </div>
      <div className="text-xs text-text-muted mt-2">{date}</div>
    </motion.div>
  );
}
