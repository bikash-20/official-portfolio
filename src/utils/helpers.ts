/* -------------------------------------------------------------------------- */
/*  helpers                                                                    */
/*                                                                             */
/*  Pure, dependency-free utility functions. Anything used in more than one    */
/*  component lives here; one-off formatters stay inline at the call site.    */
/* -------------------------------------------------------------------------- */

/**
 * Compact a number for display: 1234 → "1.2k", 2_500_000 → "2.5M".
 * Drops trailing ".0" so 1000 renders as "1k", not "1.0k".
 *
 * Returns `"0"` for non-finite inputs rather than throwing — these helpers
 * are on the hot path of dashboard widgets that fetch from third-party APIs
 * and we don't want a single bad payload to white-screen a card.
 */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '0';
  if (Math.abs(n) >= 1_000_000) return trimZero((n / 1_000_000).toFixed(1)) + 'M';
  if (Math.abs(n) >= 1_000) return trimZero((n / 1_000).toFixed(1)) + 'k';
  return n.toString();
}

function trimZero(s: string): string {
  return s.endsWith('.0') ? s.slice(0, -2) : s;
}

/**
 * Copy text to the clipboard. Returns true on success so callers can show a
 * "Copied" affordance. Swallows the rejection silently — we surface success
 * through the boolean, not via exceptions, because copy failures are common
 * (permissions, focus loss) and not actionable for the user.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
