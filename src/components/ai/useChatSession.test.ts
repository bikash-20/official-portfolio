/**
 * Tests for useChatSession.
 *
 * Strategy: cover all the *logic* (validation, cap, streaming strip,
 * default fallback) through pure-function tests on `toPersisted` and
 * `fromPersisted`, which are exported for exactly this reason.
 *
 * Hook-level React-lifecycle tests are omitted on purpose: this
 * project's vitest config runs in `node` (no jsdom) and doesn't ship
 * @testing-library/react. Adding a dev-dep just to test one hook would
 * be more risk than value. The pure-function suite below is what
 * catches regressions in the persistence rules.
 */

import { describe, expect, it } from 'vitest';
import { fromPersisted, toPersisted } from './useChatSession';
import type { ChatMessage } from './useThreshold';

/* -------------------------------------------------------------------------- */
/*  toPersisted                                                               */
/* -------------------------------------------------------------------------- */

describe('toPersisted', () => {
  it('returns an empty array for an empty input', () => {
    expect(toPersisted([])).toEqual([]);
  });

  it('keeps simple user/assistant messages intact', () => {
    const input: ChatMessage[] = [
      { id: 'a', role: 'user', content: 'hi' },
      { id: 'b', role: 'assistant', content: 'hello!' },
    ];
    expect(toPersisted(input)).toEqual([
      { id: 'a', role: 'user', content: 'hi' },
      { id: 'b', role: 'assistant', content: 'hello!' },
    ]);
  });

  it('strips the streaming flag from saved messages', () => {
    const input: ChatMessage[] = [
      { id: 'a', role: 'assistant', content: 'partial…', streaming: true },
    ];
    expect(toPersisted(input)).toEqual([
      { id: 'a', role: 'assistant', content: 'partial…' },
    ]);
  });

  it('drops empty streaming messages (a half-open aborted stream)', () => {
    const input: ChatMessage[] = [
      { id: 'a', role: 'user', content: 'ask' },
      { id: 'b', role: 'assistant', content: '', streaming: true },
    ];
    expect(toPersisted(input)).toEqual([
      { id: 'a', role: 'user', content: 'ask' },
    ]);
  });

  it('caps the saved list to MAX_PERSISTED (4) messages', () => {
    const input: ChatMessage[] = Array.from({ length: 10 }, (_, i) => ({
      id: `m-${i}`,
      role: 'user' as const,
      content: `msg ${i}`,
    }));
    const out = toPersisted(input);
    expect(out).toHaveLength(4);
    // The cap is a tail-window, so we keep the LAST 4.
    expect(out.map((m) => m.id)).toEqual(['m-6', 'm-7', 'm-8', 'm-9']);
  });

  it('preserves servedBy and latencyMs when present', () => {
    const input: ChatMessage[] = [
      {
        id: 'a',
        role: 'assistant',
        content: 'ok',
        servedBy: { id: 'x', label: 'x', provider: 'p', contextK: 8 },
        latencyMs: 1234,
      },
    ];
    expect(toPersisted(input)).toEqual([
      {
        id: 'a',
        role: 'assistant',
        content: 'ok',
        servedBy: { id: 'x', label: 'x', provider: 'p', contextK: 8 },
        latencyMs: 1234,
      },
    ]);
  });

  it('omits servedBy/latencyMs when not set (no undefined keys)', () => {
    const out = toPersisted([{ id: 'a', role: 'user', content: 'q' }]);
    expect(out[0]).not.toHaveProperty('servedBy');
    expect(out[0]).not.toHaveProperty('latencyMs');
  });
});

/* -------------------------------------------------------------------------- */
/*  fromPersisted                                                             */
/* -------------------------------------------------------------------------- */

describe('fromPersisted', () => {
  it('returns null for non-objects (null, numbers, strings)', () => {
    expect(fromPersisted(null)).toBeNull();
    expect(fromPersisted(42)).toBeNull();
    expect(fromPersisted('hello')).toBeNull();
    expect(fromPersisted(undefined)).toBeNull();
  });

  it('returns null when the schema version is wrong', () => {
    expect(fromPersisted({ version: 999, messages: [] })).toBeNull();
  });

  it('returns null when messages is not an array', () => {
    expect(fromPersisted({ version: 1, messages: 'oops' })).toBeNull();
  });

  it('returns null when a message has an invalid role', () => {
    expect(
      fromPersisted({
        version: 1,
        messages: [{ id: 'a', role: 'wizard', content: 'no' }],
      }),
    ).toBeNull();
  });

  it('returns null when id is missing or empty', () => {
    expect(
      fromPersisted({ version: 1, messages: [{ role: 'user', content: 'x' }] }),
    ).toBeNull();
    expect(
      fromPersisted({ version: 1, messages: [{ id: '', role: 'user', content: 'x' }] }),
    ).toBeNull();
  });

  it('returns null when content is not a string', () => {
    expect(
      fromPersisted({ version: 1, messages: [{ id: 'a', role: 'user', content: 42 }] }),
    ).toBeNull();
  });

  it('restores a valid envelope and always sets streaming=false', () => {
    const out = fromPersisted({
      version: 1,
      savedAt: '2026-01-01T00:00:00Z',
      messages: [
        { id: 'a', role: 'user', content: 'hi' },
        {
          id: 'b',
          role: 'assistant',
          content: 'hello!',
          servedBy: { id: 'x', label: 'x', provider: 'p', contextK: 8 },
          latencyMs: 500,
        },
      ],
    });
    expect(out).toEqual([
      { id: 'a', role: 'user', content: 'hi', streaming: false },
      {
        id: 'b',
        role: 'assistant',
        content: 'hello!',
        streaming: false,
        servedBy: { id: 'x', label: 'x', provider: 'p', contextK: 8 },
        latencyMs: 500,
      },
    ]);
  });

  it('caps the restored list to MAX_PERSISTED (4) messages', () => {
    const huge = Array.from({ length: 10 }, (_, i) => ({
      id: `m-${i}`,
      role: 'user' as const,
      content: `msg ${i}`,
    }));
    const out = fromPersisted({ version: 1, messages: huge });
    expect(out).toHaveLength(4);
    expect(out?.map((m) => m.id)).toEqual(['m-6', 'm-7', 'm-8', 'm-9']);
  });
});