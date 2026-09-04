import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CASCADE, useThreshold } from './useThreshold';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  "What are Bikash's top skills?",
  'Tell me about LiquiGuard.',
  'What hackathons has he won?',
  'How can I contact him?',
];

/* Small inline Threshold mark — a stepped "candle" line evoking a threshold/limit.
   Kept inline SVG so we don't pull in a new icon dep and avoid font-glyph drift. */
function ThresholdMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 18h4v-4H4z" />
      <path d="M10 18h4V8h-4z" />
      <path d="M16 18h4V4h-4z" />
    </svg>
  );
}

export default function ChatWidget({ open, onClose }: Props) {
  const { messages, loading, send, clear, activeTier, triedTiers } = useThreshold();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    void send(text);
  };

  return (
    <motion.div
      role="dialog"
      aria-label="Threshold AI chat"
      aria-modal="false"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ type: 'spring', damping: 22 }}
      className="fixed bottom-24 right-4 sm:right-6 z-[60] w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[calc(100vh-7rem)] glass-strong rounded-2xl shadow-2xl shadow-black/40 border border-border flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-2/50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shadow-lg shadow-primary/30 shrink-0">
            <ThresholdMark size={20} />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-bg" />
          </div>
          <div className="min-w-0">
            <div className="font-heading font-semibold text-sm truncate">Threshold</div>
            <div className="text-[10px] text-text-muted truncate">
              Bikash's Portfolio Assistant · {CASCADE.length}-tier cascade
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={clear}
            className="p-2 rounded-lg hover:bg-surface text-text-muted hover:text-text transition-colors"
            aria-label="Clear chat"
            title="Clear chat"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v5h5" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface text-text-muted hover:text-text transition-colors"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] ${m.role === 'user' ? '' : 'space-y-1'}`}>
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  m.role === 'user'
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-surface text-text rounded-bl-sm border border-border'
                }`}
              >
                {m.content}
              </div>
              {m.role === 'assistant' && m.servedBy && (
                <div className="flex items-center gap-2 px-1 text-[10px] text-text-muted">
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface/70 border border-border"
                    title={`${m.servedBy.provider} · ${m.servedBy.contextK}K context`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
                    <span className="font-mono">{m.servedBy.label}</span>
                  </span>
                  {typeof m.latencyMs === 'number' && (
                    <span className="font-mono">{(m.latencyMs / 1000).toFixed(1)}s</span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Loading + live cascade indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] space-y-1">
              <div className="bg-surface border border-border px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="w-2 h-2 rounded-full bg-primary-light"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-text-muted font-mono">
                    {activeTier >= 0 ? `Trying T${activeTier + 1}/${CASCADE.length}` : 'Thinking…'}
                  </span>
                </div>
                {/* Mini cascade progress strip */}
                <div className="flex items-center gap-1" aria-hidden="true">
                  {CASCADE.map((tier, idx) => {
                    const isDone = idx < triedTiers;
                    const isCurrent = idx === activeTier;
                    return (
                      <span
                        key={tier.id}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          isDone
                            ? 'bg-warning'
                            : isCurrent
                              ? 'bg-primary animate-pulse'
                              : 'bg-border'
                        }`}
                      />
                    );
                  })}
                </div>
                <div className="mt-1.5 text-[10px] text-text-muted font-mono truncate">
                  {activeTier >= 0 ? CASCADE[activeTier].label : ''}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {messages.length <= 1 && !loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-2 flex flex-wrap gap-1.5 overflow-hidden"
          >
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => void send(s)}
                disabled={loading}
                className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border hover:border-primary/40 text-text-muted hover:text-text transition-colors disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-border bg-bg-2/50 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Bikash…"
          disabled={loading}
          className="flex-1 min-w-0 px-3.5 py-2.5 rounded-lg bg-bg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-colors disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-lg gradient-bg text-white flex items-center justify-center shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform shrink-0"
          aria-label="Send"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </button>
      </form>
    </motion.div>
  );
}