import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PALETTES } from '@/data/palettes';
import { useTheme } from '@/hooks/useTheme';

/**
 * Palette picker — a small swatch dot that opens a popover of all palettes.
 * Clicking a swatch applies it instantly and persists via useTheme.
 *
 * Layout (desktop):
 *   [active dot]   <- button (always visible)
 *
 * On click, popover drops down with:
 *   - Title: "Theme"
 *   - Grid of 6 swatches (3 per row)
 *   - Each swatch = [primary | secondary | surface] strip + label
 *   - Active swatch gets a primary-color ring
 *
 * Closes on outside-click and Escape.
 */
export default function PalettePicker() {
  const { palette, setPalette } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside / Escape to close
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Theme: ${palette.label}. Click to change.`}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={`Theme: ${palette.label}`}
        className="group relative w-9 h-9 rounded-full bg-surface/80 border border-border backdrop-blur-sm flex items-center justify-center hover:border-primary/60 hover:shadow-md hover:shadow-primary/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {/* Tri-tone ring mirroring the active palette */}
        <span
          className="block w-5 h-5 rounded-full overflow-hidden ring-1 ring-border"
          aria-hidden="true"
          style={{
            background: `conic-gradient(${palette.swatches[0]} 0deg 120deg, ${palette.swatches[1]} 120deg 240deg, ${palette.swatches[2]} 240deg 360deg)`,
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Theme picker"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] glass-strong rounded-xl shadow-2xl shadow-black/40 border border-border p-3 z-[60]"
            style={{ top: '100%' }}
          >
            <div className="flex items-baseline justify-between px-1 mb-2">
              <span className="font-heading text-xs uppercase tracking-[0.2em] text-text-muted">
                Theme
              </span>
              <span className="font-mono text-[10px] text-text-muted">
                {PALETTES.length} palettes
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {PALETTES.map((p) => {
                const active = p.id === palette.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPalette(p.id);
                      setOpen(false);
                    }}
                    aria-pressed={active}
                    title={p.origin}
                    className={`group flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all ${
                      active
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/40 hover:bg-surface'
                    }`}
                  >
                    <span
                      className="block w-7 h-7 rounded-md overflow-hidden ring-1 ring-border shrink-0"
                      aria-hidden="true"
                      style={{
                        background: `conic-gradient(${p.swatches[0]} 0deg 120deg, ${p.swatches[1]} 120deg 240deg, ${p.swatches[2]} 240deg 360deg)`,
                      }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className={`block text-[11px] font-medium truncate ${active ? 'text-primary-light' : 'text-text'}`}>
                        {p.label}
                      </span>
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-text-muted truncate">
                        {active ? 'Active' : 'Switch'}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
