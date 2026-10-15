/**
 * useChatSession — localStorage-backed message persistence for Threshold.
 *
 * Goals
 * ─────
 * 1.  Survive a page reload: when the visitor comes back, the chat shows
 *     the recent turns (up to MAX_PERSISTED) instead of resetting to the
 *     welcome message.
 * 2.  Stay invisible until needed: a brand-new visitor (no localStorage
 *     entry) still sees the welcome message, identical to the old UX.
 * 3.  Never break the app: any localStorage failure (quota, disabled
 *     storage, malformed JSON, schema mismatch) is swallowed and we fall
 *     back to the in-memory messages. The chat must keep working.
 * 4.  Never persist transient state. `streaming: true` is stripped on both
 *     save and load — a half-streamed reload becomes a settled, complete
 *     message (or gets dropped if empty).
 *
 * Design notes
 * ────────────
 * - We persist the *minimum* needed to reconstruct the visible state:
 *   id, role, content, servedBy, latencyMs. The tier `id` slug is
 *   intentionally not stored — it's noise for the UI and would balloon
 *   the payload.
 * - The hook is decoupled from the cascade. `useThreshold` calls it and
 *   gets back `{ messages, setMessages, clear }`; the cascade logic stays
 *   exactly where it is.
 * - Persistence runs in a `useEffect` (NOT during render). React 18 may
 *   double-invoke renders in StrictMode; writing to localStorage from
 *   render would cause spurious writes.
 * - Schema is versioned (`version: 1`) so a future migration can detect
 *   old payloads and discard instead of crashing.
 *
 * Constants
 * ─────────
 * `MAX_PERSISTED` = 4 messages = 2 conversation turns (user + assistant
 * each). A "turn" is one user message plus one assistant reply, so 2
 * turns ≈ the user's "remember the last 2 messages" requirement with a
 * small buffer for both sides of each turn. Bump the constant to widen
 * the memory window — no other code needs to change.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatMessage } from './useThreshold';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Persisted schema. Bump `version` if you change the shape; the loader
 * will discard any payload with a different version.
 */
const SCHEMA_VERSION = 1;

/** localStorage key. Prefix `bt-` mirrors `bt-threshold-mode`. */
const STORAGE_KEY = 'bt-threshold-session';

/**
 * Cap on the number of messages we keep in localStorage. 4 messages =
 * 2 user/assistant pairs. Kept conservative to stay well under the
 * typical 5 MB localStorage budget even with long assistant replies.
 */
const MAX_PERSISTED = 4;

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The shape we actually write to disk. We strip `streaming` (always
 * transient) and don't need any other ChatMessage field beyond what the
 * UI renders.
 */
interface PersistedMessage {
  id: string;
  role: ChatMessage['role'];
  content: string;
  servedBy?: ChatMessage['servedBy'];
  latencyMs?: number;
}

interface PersistedEnvelope {
  version: number;
  /** ISO timestamp of the last save — useful for debugging, not displayed. */
  savedAt: string;
  messages: PersistedMessage[];
}

/* -------------------------------------------------------------------------- */
/*  Pure helpers (testable in isolation)                                      */
/* -------------------------------------------------------------------------- */

/**
 * Project a ChatMessage[] down to the persisted shape. Drops empty
 * streaming messages (a half-finished assistant reply that was in-flight
 * at the moment of the save) and any transient `streaming` flag.
 *
 * Exported for unit tests; not used outside this file.
 */
export function toPersisted(messages: ChatMessage[]): PersistedMessage[] {
  const tail = messages.slice(-MAX_PERSISTED);
  const out: PersistedMessage[] = [];
  for (const m of tail) {
    // If a streaming message has no content, the upstream call was
    // aborted before any tokens arrived — there's nothing meaningful to
    // restore, so we drop it. Otherwise we persist with streaming=false.
    if (m.streaming && m.content.length === 0) continue;
    out.push({
      id: m.id,
      role: m.role,
      content: m.content,
      ...(m.servedBy ? { servedBy: m.servedBy } : {}),
      ...(typeof m.latencyMs === 'number' ? { latencyMs: m.latencyMs } : {}),
    });
  }
  return out;
}

/**
 * Validate a parsed JSON value and turn it back into ChatMessage[]. The
 * returned messages are guaranteed safe to render: `streaming` is
 * always false (we never restore an in-flight stream), every entry has
 * the required fields, and the array is capped to MAX_PERSISTED.
 *
 * Returns null when the payload is unrecognizable (wrong version,
 * missing fields, wrong types) — callers should treat that as "no
 * session" and fall back to the default welcome message.
 *
 * Exported for unit tests.
 */
export function fromPersisted(value: unknown): ChatMessage[] | null {
  if (!value || typeof value !== 'object') return null;
  const env = value as Partial<PersistedEnvelope>;
  if (env.version !== SCHEMA_VERSION) return null;
  if (!Array.isArray(env.messages)) return null;

  const out: ChatMessage[] = [];
  for (const raw of env.messages.slice(-MAX_PERSISTED)) {
    if (!raw || typeof raw !== 'object') return null;
    const m = raw as Partial<PersistedMessage>;
    if (typeof m.id !== 'string' || m.id.length === 0) return null;
    if (m.role !== 'user' && m.role !== 'assistant' && m.role !== 'system') {
      return null;
    }
    if (typeof m.content !== 'string') return null;
    out.push({
      id: m.id,
      role: m.role,
      content: m.content,
      streaming: false, // never restore as streaming
      ...(m.servedBy ? { servedBy: m.servedBy } : {}),
      ...(typeof m.latencyMs === 'number' ? { latencyMs: m.latencyMs } : {}),
    });
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/*  Hook                                                                      */
/* -------------------------------------------------------------------------- */

export interface UseChatSessionReturn {
  /**
   * The current message list. Initialised from localStorage on mount
   * (if a valid session exists); otherwise the caller-provided default
   * is used and the next save will replace it.
   */
  messages: ChatMessage[];
  /**
   * Same setter semantics as `useState`. Caller is responsible for
   * providing immutable updates; the hook handles persistence.
   */
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  /** Wipes both in-memory state and the localStorage entry. */
  clear: () => void;
}

/**
 * Wrap a `messages` state with localStorage persistence.
 *
 * @param defaultMessages  The fallback used when no valid session
 *   exists in localStorage. Typically the welcome message array.
 *
 * The hook is SSR-safe (returns `defaultMessages` when `window` is
 * undefined) and tolerant of every localStorage failure mode
 * (quota, disabled, malformed JSON, schema mismatch).
 */
export function useChatSession(defaultMessages: ChatMessage[]): UseChatSessionReturn {
  // Lazy initialiser — runs once. Falls back to default on any failure.
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === 'undefined') return defaultMessages;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultMessages;
      const restored = fromPersisted(JSON.parse(raw));
      // Only adopt the restored list if it has at least one message.
      // An empty array would be indistinguishable from a brand-new
      // visitor; we want the default welcome in that case.
      return restored && restored.length > 0 ? restored : defaultMessages;
    } catch {
      // JSON.parse threw, localStorage threw, anything — fall back.
      return defaultMessages;
    }
  });

  // Persist on every change. We skip the very first render because the
  // lazy initialiser already represents either the restored state (no
  // need to re-write it) or the default (we don't want to save the
  // default until the user has actually sent something).
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (typeof window === 'undefined') return;
    try {
      const envelope: PersistedEnvelope = {
        version: SCHEMA_VERSION,
        savedAt: new Date().toISOString(),
        messages: toPersisted(messages),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    } catch {
      // Quota exceeded, storage disabled, private mode — silent. The
      // in-memory state still works for the current session.
    }
  }, [messages]);

  const clear = useCallback(() => {
    setMessages(defaultMessages);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* silent */
    }
  }, [defaultMessages]);

  return { messages, setMessages, clear };
}
