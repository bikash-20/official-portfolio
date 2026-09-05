import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_PALETTE,
  PALETTES,
  findPalette,
  type PaletteId,
} from '@/data/palettes';

const STORAGE_KEY = 'bt-palette';
const PALETTE_EVENT = 'bt-palette-change';

function readInitial(): PaletteId {
  if (typeof window === 'undefined') return DEFAULT_PALETTE;
  // URL hint (?palette=midnight) wins over storage — useful for previews and
  // deep-linking. Stored preference still persists after the hint is applied.
  const params = new URLSearchParams(window.location.search);
  const hinted = params.get('palette');
  if (hinted && PALETTES.some((p) => p.id === hinted)) return hinted as PaletteId;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && PALETTES.some((p) => p.id === stored)) return stored as PaletteId;
  } catch {
    /* storage unavailable — use the default palette */
  }
  return DEFAULT_PALETTE;
}

/**
 * Apply the palette by setting `data-palette` on <html> and pushing the full
 * token set as CSS custom properties so any component using `var(--color-*)`
 * picks up the new theme immediately.
 */
function applyPalette(id: PaletteId) {
  const palette = findPalette(id);
  const root = document.documentElement;
  root.dataset.palette = palette.id;
  const t = palette.tokens;
  root.style.setProperty('--color-primary',        t.primary);
  root.style.setProperty('--color-primary-light',  t.primaryLight);
  root.style.setProperty('--color-primary-dark',   t.primaryDark);
  root.style.setProperty('--color-secondary',      t.secondary);
  root.style.setProperty('--color-secondary-light',t.secondaryLight);
  root.style.setProperty('--color-bg',             t.bg);
  root.style.setProperty('--color-bg-2',           t.bg2);
  root.style.setProperty('--color-surface',        t.surface);
  root.style.setProperty('--color-surface-2',      t.surface2);
  root.style.setProperty('--color-text',           t.text);
  root.style.setProperty('--color-text-muted',     t.textMuted);
  root.style.setProperty('--color-border',         t.border);
}

export function useTheme() {
  const [paletteId, setPaletteId] = useState<PaletteId>(readInitial);

  useEffect(() => {
    const onPaletteChange = (event: Event) => {
      const id = (event as CustomEvent<PaletteId>).detail;
      if (PALETTES.some((p) => p.id === id)) setPaletteId(id);
    };
    window.addEventListener(PALETTE_EVENT, onPaletteChange);
    return () => window.removeEventListener(PALETTE_EVENT, onPaletteChange);
  }, []);

  useEffect(() => {
    applyPalette(paletteId);
    try {
      window.localStorage.setItem(STORAGE_KEY, paletteId);
    } catch {
      /* storage unavailable — silent */
    }
  }, [paletteId]);

  const setPalette = useCallback((id: PaletteId) => {
    setPaletteId(id);
    window.dispatchEvent(new CustomEvent<PaletteId>(PALETTE_EVENT, { detail: id }));
  }, []);

  return {
    paletteId,
    palette: findPalette(paletteId),
    setPalette,
  };
}
