import { useEffect, useState } from 'react';

export interface GitHubUser {
  login: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  name: string;
  bio: string;
}

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const GITHUB_API = 'https://api.github.com';
const USERNAME = 'bikash-20';
const REQUEST_TIMEOUT_MS = 15_000;

const fallbackUser: GitHubUser = {
  login: USERNAME,
  public_repos: 78,
  followers: 31,
  following: 12,
  avatar_url: '',
  name: 'Bikash Talukder',
  bio: 'Full-Stack Developer & AI Systems Builder',
};

/** Native fetch with timeout — avoids pulling axios for one endpoint. */
async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    window.clearTimeout(timer);
  }
}

export function useGitHubUser() {
  const [data, setData] = useState<GitHubUser | null>(fallbackUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchJson<GitHubUser>(`${GITHUB_API}/users/${USERNAME}`)
      .then((user) => {
        if (mounted) setData(user);
      })
      .catch(() => {
        /* keep fallback on any failure */
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading };
}

/**
 * Build a synthetic 53-week contribution grid.
 *
 * Used as the fallback when the live GitHub endpoint is unreachable or not
 * opted-in (VITE_GITHUB_CONTRIBUTIONS !== 'live'). The shape matches what the
 * live parser returns so callers don't need a branch.
 */
function buildSyntheticGrid(): ContributionDay[][] {
  const grid: ContributionDay[][] = [];
  const today = new Date();
  for (let w = 0; w < 53; w++) {
    const week: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (52 - w) * 7 - (6 - d));
      // Pseudo-random pattern biased to look like real activity
      const seed = (w * 7 + d + Math.floor(date.getMonth() * 3)) % 11;
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (seed > 8) level = 4;
      else if (seed > 6) level = 3;
      else if (seed > 4) level = 2;
      else if (seed > 2) level = 1;
      week.push({
        date: date.toISOString().slice(0, 10),
        count: level * 3 + (seed % 3),
        level,
      });
    }
    grid.push(week);
  }
  return grid;
}

/**
 * Parse GitHub's public contributions SVG into our grid shape.
 * Endpoint: https://github.com/users/<name>.contributions (no auth).
 *
 * GitHub emits one `<g>` per week and one `<rect>` per day with a
 * `data-level` attribute (0–4) and a `data-date` attribute. We pull those
 * out into a 53×7 grid. Any rect we can't classify is level 0.
 */
function parseContributionsSvg(svg: string): ContributionDay[][] {
  // Group by week: each week is wrapped in `<g transform="translate(...)">`.
  // Inside, rects with `data-date` carry the day.
  const weekBlocks = svg.split(/<g /g).slice(1); // first chunk is the header
  const grid: ContributionDay[][] = [];

  for (const block of weekBlocks) {
    const dayMatches = block.matchAll(
      /<rect[^>]*data-date="([^"]+)"[^>]*data-level="([^"]+)"/g,
    );
    const week: ContributionDay[] = [];
    for (const m of dayMatches) {
      const date = m[1];
      const levelNum = Number(m[2]);
      const level = (
        levelNum >= 0 && levelNum <= 4 ? levelNum : 0
      ) as ContributionDay['level'];
      // Real count is in the tooltip ("X contributions on …"). Skip —
      // level alone is enough for the heatmap and avoids brittle regex.
      week.push({ date, count: 0, level });
    }
    if (week.length) grid.push(week);
  }
  return grid;
}

async function fetchLiveGrid(): Promise<ContributionDay[][] | null> {
  const url = `https://github.com/users/${USERNAME}.contributions`;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    const svg = await res.text();
    const grid = parseContributionsSvg(svg);
    return grid.length > 0 ? grid : null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Live GitHub contribution grid.
 *
 * By default this returns the synthetic grid + `isSynthetic: true` so we
 * never make a network call you didn't opt into. To fetch the real calendar,
 * set `VITE_GITHUB_CONTRIBUTIONS=live` in `.env`. The endpoint is public and
 * rate-limited per-IP; a 429 or any network failure silently falls back to
 * the synthetic grid (the hook still reports `isSynthetic: true` so callers
 * can label the chart honestly).
 */
export function useGitHubContributions() {
  const [grid, setGrid] = useState<ContributionDay[][]>(() => buildSyntheticGrid());
  const [isSynthetic, setIsSynthetic] = useState(true);

  useEffect(() => {
    if (import.meta.env.VITE_GITHUB_CONTRIBUTIONS !== 'live') return;
    let mounted = true;
    fetchLiveGrid().then((live) => {
      if (!mounted || !live) return;
      setGrid(live);
      setIsSynthetic(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { grid, isSynthetic } as const;
}
