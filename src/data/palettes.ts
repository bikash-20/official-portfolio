/**
 * Palette registry — every theme Bikash's portfolio can switch to.
 *
 * Each palette defines the full set of semantic color tokens used throughout
 * the site (primary / secondary / bg / surface / text / borders). The default
 * theme in `useTheme.ts` and the initial `data-palette` in `index.css` must
 * agree — see DEFAULT_PALETTE below.
 *
 * To add a palette: drop a new entry below with a unique `id` and the same
 * shape. The palette picker UI in Navbar auto-discovers new entries.
 */

export interface PaletteTokens {
  /** Primary brand color — gradients, links, focus rings, accents. */
  primary: string;
  /** Lighter primary — used for hover states, gradient endpoints. */
  primaryLight: string;
  /** Darker primary — used for pressed states, deep accents. */
  primaryDark: string;
  /** Secondary brand — contrast hue for highlights, badges, CTAs. */
  secondary: string;
  /** Lighter secondary — used for hover/active on secondary CTAs. */
  secondaryLight: string;
  /** Page background (the outermost surface). */
  bg: string;
  /** Slightly lifted background — under navbar in idle state. */
  bg2: string;
  /** Card / panel surface. */
  surface: string;
  /** Slightly lifted surface — hovered cards, nested panels. */
  surface2: string;
  /** Default body text. */
  text: string;
  /** Muted text — captions, metadata. */
  textMuted: string;
  /** Borders, dividers, hairlines. */
  border: string;
}

export interface Palette {
  /** Stable id used in `data-palette` and localStorage. */
  id: string;
  /** Human-readable label, shown in picker tooltips. */
  label: string;
  /** Origin / source of the palette, shown as the picker subtitle. */
  origin: string;
  /** Three swatches used by the picker button. Order: [primary, secondary, surface]. */
  swatches: [string, string, string];
  /** Full token set applied as CSS custom properties under [data-palette="..."]. */
  tokens: PaletteTokens;
}

export const PALETTES: readonly Palette[] = [
  /* ────────────────────────────────────────────────────────────────────────
   * DEFAULT — Briar Rose + Cioccolato (Stickdazzle)
   * Editorial, romantic, warm. Matches the new portrait hero.
   * ──────────────────────────────────────────────────────────────────────── */
  {
    id: 'briar-rose',
    label: 'Briar Rose',
    origin: 'Stickdazzle + custom midnight',
    swatches: ['#BE7585', '#5B392F', '#0F0807'],
    tokens: {
      primary:      '#BE7585',  // Briar Rose
      primaryLight: '#E1A1AD',  // Berry Riche
      primaryDark:  '#8E5463',
      secondary:    '#5B392F',  // Cioccolato
      secondaryLight:'#7D5648',
      bg:           '#0F0807',  // custom midnight — almost black, brown undertone
      bg2:          '#080404',
      surface:      '#1A0F0E',
      surface2:     '#261816',
      text:         '#F8CDD4',  // April Blush — soft warm white
      textMuted:    '#A88594',
      border:       '#33201F',
    },
  },

  /* ────────────────────────────────────────────────────────────────────────
   * Navy → Coral (Dopely.top)
   * Professional + warm. Moodiest deep mode.
   * ──────────────────────────────────────────────────────────────────────── */
  {
    id: 'navy-coral',
    label: 'Navy → Coral',
    origin: 'Dopely.top gradient',
    swatches: ['#2B2F6C', '#DE978F', '#0A0B1E'],
    tokens: {
      primary:      '#2B2F6C',
      primaryLight: '#564779',
      primaryDark:  '#1B1E48',
      secondary:    '#DE978F',
      secondaryLight:'#F1B5AC',
      bg:           '#0A0B1E',
      bg2:          '#050614',
      surface:      '#14163A',
      surface2:     '#1F2255',
      text:         '#F2F0EE',
      textMuted:    '#9C8FA0',
      border:       '#252962',
    },
  },

  /* ────────────────────────────────────────────────────────────────────────
   * Purple Shades
   * Closest to the original brand. Soft lavender → deep plum.
   * ──────────────────────────────────────────────────────────────────────── */
  {
    id: 'purple-shades',
    label: 'Purple Shades',
    origin: 'Classic 5-step',
    swatches: ['#693B69', '#A987A8', '#10071A'],
    tokens: {
      primary:      '#693B69',
      primaryLight: '#A987A8',
      primaryDark:  '#511F52',
      secondary:    '#ECD4EA',
      secondaryLight:'#FFFFFF',
      bg:           '#10071A',
      bg2:          '#080310',
      surface:      '#1C0F26',
      surface2:     '#281838',
      text:         '#ECD4EA',
      textMuted:    '#A487A8',
      border:       '#2E1E3D',
    },
  },

  /* ────────────────────────────────────────────────────────────────────────
   * Red / Maroon Shades
   * Bold, fiery — high contrast. Darkest surface of the set.
   * ──────────────────────────────────────────────────────────────────────── */
  {
    id: 'red-maroon',
    label: 'Red / Maroon',
    origin: '5-step fire',
    swatches: ['#C72C41', '#EE4540', '#0E0307'],
    tokens: {
      primary:      '#C72C41',
      primaryLight: '#EE4540',
      primaryDark:  '#801336',
      secondary:    '#801336',
      secondaryLight:'#A81949',
      bg:           '#0E0307',
      bg2:          '#070104',
      surface:      '#1F0710',
      surface2:     '#2D142C',
      text:         '#FFE5DC',
      textMuted:    '#B57F8B',
      border:       '#3D1525',
    },
  },

  /* ────────────────────────────────────────────────────────────────────────
   * Pink / Magenta (Dopely.top)
   * Romantic gradient, light to mid-dark.
   * ──────────────────────────────────────────────────────────────────────── */
  {
    id: 'pink-magenta',
    label: 'Pink / Magenta',
    origin: 'Dopely.top gradient',
    swatches: ['#C14E76', '#F7B2CF', '#160308'],
    tokens: {
      primary:      '#C14E76',
      primaryLight: '#DF7DA6',
      primaryDark:  '#7E1037',
      secondary:    '#F7B2CF',
      secondaryLight:'#FFE4E1',
      bg:           '#160308',
      bg2:          '#0B0204',
      surface:      '#26091A',
      surface2:     '#34112A',
      text:         '#FFE4E1',
      textMuted:    '#C29AAD',
      border:       '#451A3A',
    },
  },

  /* ────────────────────────────────────────────────────────────────────────
   * Midnight — custom pick (Bikash's choice + my recommendation)
   * Deep midnight teal + champagne gold. Most distinctive of the set.
   * ──────────────────────────────────────────────────────────────────────── */
  {
    id: 'midnight',
    label: 'Midnight',
    origin: 'Custom — teal + champagne',
    swatches: ['#0E7490', '#D4AF7A', '#03101A'],
    tokens: {
      primary:      '#0E7490',  // teal-700
      primaryLight: '#22D3EE',  // cyan-400 — bright accent
      primaryDark:  '#0E4F6E',
      secondary:    '#D4AF7A',  // champagne
      secondaryLight:'#E8C9A0',
      bg:           '#03101A',  // near-black with blue undertone
      bg2:          '#01070D',
      surface:      '#0A1F2C',
      surface2:     '#0F2C3D',
      text:         '#F4ECD8',  // warm cream
      textMuted:    '#8AA4B0',
      border:       '#15384A',
    },
  },
] as const;

export type PaletteId = (typeof PALETTES)[number]['id'];

export const DEFAULT_PALETTE: PaletteId = 'midnight';

export function findPalette(id: string | null | undefined): Palette {
  if (!id) return PALETTES[0];
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}
