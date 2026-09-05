import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWidget from './ChatWidget';
import ThresholdMark from './ThresholdMark';

export default function ChatBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: 'spring', damping: 12 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full gradient-bg text-white shadow-2xl shadow-primary/40 flex items-center justify-center"
        aria-label={open ? 'Close Threshold' : 'Open Threshold'}
        aria-expanded={open}
        aria-controls="threshold-chat"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-center justify-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </motion.span>
          ) : (
            <motion.span
              key="mark"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-center justify-center"
            >
              <ThresholdMark size={24} />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success border-2 border-bg animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <div id="threshold-chat">
            <ChatWidget open={open} onClose={() => setOpen(false)} />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}