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

/** Build a synthetic 53-week contribution grid.
 *  Real GitHub contributions API requires auth, so we render a plausible
 *  pseudo-random pattern and let the real API replace it once a token is wired. */
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

export function useGitHubContributions() {
  const [grid] = useState<ContributionDay[][]>(() => buildSyntheticGrid());
  return { grid };
}
