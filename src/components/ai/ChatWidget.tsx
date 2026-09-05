import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CASCADE, useThreshold } from './useThreshold';
import MarkdownContent from './MarkdownContent';
import ThresholdMark from './ThresholdMark';
import ErrorBoundary from '@/components/common/ErrorBoundary';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SUGGESTIONS_BY_MODE = {
  bikash: [
    "What are Bikash's top skills?",
    'Tell me about LiquiGuard.',
    'What hackathons has he won?',
    'How can I contact him?',
  ],
  general: [
    'Explain monads in one paragraph.',
    'Write a Python decorator that retries on exception.',
    'What is the difference between SQL JOIN types?',
    'Give me 3 ideas for a side project this weekend.',
  ],
} as const;

export default function ChatWidget({ onClose }: Props) {
  const { messages, loading, send, clear, stop, activeTier, triedTiers, mode, setMode } = useThreshold();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const suggestions = SUGGESTIONS_BY_MODE[mode];

  // Auto-scroll on new tokens / new messages.
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
      id="threshold-chat"
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
              {mode === 'bikash' ? "Bikash's Portfolio Assistant" : 'General Assistant'} ·{' '}
              {CASCADE.length}-tier cascade
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {/* Mode toggle — click to switch between Bikash-aware and general. */}
          <button
            onClick={() => setMode(mode === 'bikash' ? 'general' : 'bikash')}
            className={`text-[10px] px-2 py-1 rounded-full border transition-colors uppercase tracking-wider font-mono ${
              mode === 'bikash'
                ? 'border-primary/40 text-primary-light hover:bg-primary/10'
                : 'border-secondary/40 text-secondary-light hover:bg-secondary/10'
            }`}
            title={
              mode === 'bikash'
                ? 'Currently scoped to Bikash. Click to switch to general.'
                : 'Currently general. Click to switch back to Bikash-aware.'
            }
            aria-label={`Mode: ${mode}. Click to toggle.`}
          >
            {mode === 'bikash' ? 'Bikash' : 'General'}
          </button>
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
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide"
      >
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[88%] ${m.role === 'user' ? '' : 'space-y-1'}`}>
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                  m.role === 'user'
                    ? 'bg-primary text-white rounded-br-sm whitespace-pre-wrap'
                    : 'bg-surface text-text rounded-bl-sm border border-border'
                }`}
              >
                {m.role === 'assistant' ? (
                  m.content.length === 0 && m.streaming ? (
                    <span className="inline-flex gap-1.5 py-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 rounded-full bg-primary-light"
                        />
                      ))}
                    </span>
                  ) : (
                    <>
                      <ErrorBoundary label="assistant message">
                        <MarkdownContent content={m.content} />
                      </ErrorBoundary>
                      {m.streaming && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                          className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-primary-light"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )
                ) : (
                  m.content
                )}
              </div>
              {m.role === 'assistant' && !m.streaming && m.servedBy && (
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

        {/* Cascade progress strip — only visible while the FIRST tier is being attempted
            and no tokens have arrived yet. Once a token streams in, we hide this and
            show only the streaming caret on the assistant bubble. */}
        {loading && !messages.some((m) => m.role === 'assistant' && m.content.length > 0) && (
          <div className="flex justify-start">
            <div className="max-w-[88%] space-y-1">
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
                    {activeTier >= 0 ? `Trying T${activeTier + 1}/${CASCADE.length}` : 'Thinking'}
                  </span>
                </div>
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
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={loading}
              className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border hover:border-primary/40 text-text-muted hover:text-text transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-border bg-bg-2/50 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'bikash'
              ? 'Ask about Bikash...  (try /general)'
              : 'Ask anything...  (try /bikash)'
          }
          disabled={loading}
          className="flex-1 px-3.5 py-2.5 rounded-lg bg-bg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-colors disabled:opacity-60"
        />
        {loading ? (
          <button
            type="button"
            onClick={stop}
            className="w-10 h-10 rounded-lg bg-secondary text-white flex items-center justify-center shadow-lg shadow-secondary/30 hover:scale-105 transition-transform"
            aria-label="Stop generating"
            title="Stop generating"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-10 h-10 rounded-lg gradient-bg text-white flex items-center justify-center shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            aria-label="Send"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
          </button>
        )}
      </form>
    </motion.div>
  );
}
