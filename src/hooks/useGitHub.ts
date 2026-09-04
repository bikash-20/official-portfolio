import { useEffect, useState } from 'react';
import { api } from '@/utils/api';

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

const fallbackUser: GitHubUser = {
  login: 'bikash-20',
  public_repos: 78,
  followers: 31,
  following: 12,
  avatar_url: '',
  name: 'Bikash Talukder',
  bio: 'Full-Stack Developer & AI Systems Builder',
};

export function useGitHubUser() {
  const [data, setData] = useState<GitHubUser | null>(fallbackUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get<GitHubUser>('https://api.github.com/users/bikash-20')
      .then((res) => {
        if (mounted) setData(res.data);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading };
}

// Generate a synthetic 53-week contribution grid (real API requires auth)
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
  const [grid, setGrid] = useState<ContributionDay[][]>(() => buildSyntheticGrid());

  useEffect(() => {
    // Real GitHub contribution API requires auth, so we keep the synthetic grid.
    // (For an authenticated view, swap in a custom backend proxy or GH token.)
  }, []);

  return { grid };
}
