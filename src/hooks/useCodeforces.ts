import { useEffect, useState } from 'react';

/**
 * Live Codeforces user info, fetched from the public REST API.
 *
 * Endpoint: https://codeforces.com/api/user.info?handles=<handle>
 * No auth required. Returns `{ status: "OK", result: [User] }` on hit,
 * `{ status: "FAILED", comment: "..." }` on miss. We map the first user
 * record and surface a `loading` flag + `error` message so the card can
 * render a useful fallback when the handle is wrong / API is down.
 *
 * We keep a local fallback (`fallbackUser`) so the card never blanks on a
 * transient network blip — the live data, when it arrives, replaces it.
 */

export interface CodeforcesUser {
  handle: string;
  rating: number;
  /** Pretty rank label (e.g. "Pupil", "Specialist", "Expert"). Empty until ranked. */
  rank: string;
  /** Highest rating ever attained. */
  maxRating: number;
  /** Highest rank label corresponding to maxRating. */
  maxRank: string;
  /** Number of contests participated in. */
  contestsAttended: number;
  /** ISO 8601 last-online timestamp. */
  lastOnlineAt: string;
  /** Avatar URL. */
  avatar: string;
  /** Country string from the profile (e.g. "Bangladesh"). */
  country: string;
  /** yyyy-MM-dd when the account was first seen online. */
  joinedAt: string;
}

interface RawUser {
  handle: string;
  rating?: number;
  rank?: string;
  maxRating?: number;
  maxRank?: string;
  avatar?: string;
  country?: string;
  lastOnlineTimeSeconds?: number;
  registrationTimeSeconds?: number;
  contribution?: number;
}

interface ApiOk {
  status: 'OK';
  result: RawUser[];
}

interface ApiFail {
  status: 'FAILED';
  comment: string;
}

type ApiResponse = ApiOk | ApiFail;

const HANDLE = 'talukder_20';
const REQUEST_TIMEOUT_MS = 8000;

/** Honest fallback used until the API responds. Numbers are placeholders,
    not faked ratings — the card surfaces this via the `loading` flag. */
const fallbackUser: CodeforcesUser = {
  handle: HANDLE,
  rating: 0,
  rank: '—',
  maxRating: 0,
  maxRank: '—',
  contestsAttended: 0,
  lastOnlineAt: '',
  avatar: '',
  country: '',
  joinedAt: '',
};

function toEpochDate(seconds?: number): string {
  if (!seconds) return '';
  // UTC date-only — keeps the cell narrow and locale-stable.
  return new Date(seconds * 1000).toISOString().slice(0, 10);
}

function mapUser(raw: RawUser): CodeforcesUser {
  return {
    handle: raw.handle,
    rating: raw.rating ?? 0,
    rank: raw.rank ?? 'Unrated',
    maxRating: raw.maxRating ?? raw.rating ?? 0,
    maxRank: raw.maxRank ?? raw.rank ?? 'Unrated',
    contestsAttended: raw.contribution ?? 0,
    lastOnlineAt: toEpochDate(raw.lastOnlineTimeSeconds),
    avatar: raw.avatar ?? '',
    country: raw.country ?? '',
    joinedAt: toEpochDate(raw.registrationTimeSeconds),
  };
}

async function fetchUser(handle: string): Promise<CodeforcesUser> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`,
      { signal: controller.signal, headers: { Accept: 'application/json' } },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as ApiResponse;
    if (json.status !== 'OK' || json.result.length === 0) {
      throw new Error((json as ApiFail).comment ?? 'No user found');
    }
    return mapUser(json.result[0]);
  } finally {
    window.clearTimeout(timer);
  }
}

/** React hook around fetchUser. Returns the cached fallback until the
    request resolves; non-blocking — never throws, surfaces `error` instead. */
export function useCodeforcesUser() {
  const [user, setUser] = useState<CodeforcesUser>(fallbackUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchUser(HANDLE)
      .then((u) => {
        if (!mounted) return;
        setUser(u);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : 'Failed to load Codeforces data');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading, error };
}
