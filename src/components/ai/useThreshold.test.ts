import { describe, expect, it } from 'vitest';
import {
  CASCADE,
  CASCADE_LAST_VERIFIED,
  describeError,
  isTransientFailure,
  OVERLOADED_BODY,
  parseSlashCommand,
} from './useThreshold';

describe('parseSlashCommand', () => {
  it('returns null for plain messages', () => {
    expect(parseSlashCommand('Tell me about LiquiGuard', 'bikash')).toBeNull();
    expect(parseSlashCommand('What is a monad?', 'general')).toBeNull();
  });

  it('switches to general mode on /general with no body', () => {
    const r = parseSlashCommand('/general', 'bikash');
    expect(r).toEqual({ mode: 'general', body: '', hasBody: false });
  });

  it('switches to bikash mode on /bikash with no body', () => {
    const r = parseSlashCommand('/bikash', 'general');
    expect(r).toEqual({ mode: 'bikash', body: '', hasBody: false });
  });

  it('strips a trailing message after the command and reports hasBody', () => {
    const r = parseSlashCommand('/general what is recursion?', 'bikash');
    expect(r).toEqual({ mode: 'general', body: 'what is recursion?', hasBody: true });
  });

  it('accepts /mode bikash and /mode general', () => {
    expect(parseSlashCommand('/mode bikash', 'general')).toEqual({
      mode: 'bikash',
      body: '',
      hasBody: false,
    });
    expect(parseSlashCommand('/mode general', 'bikash')).toEqual({
      mode: 'general',
      body: '',
      hasBody: false,
    });
  });

  it('rejects unknown /mode values', () => {
    expect(parseSlashCommand('/mode evil', 'bikash')).toBeNull();
  });

  it('is case-insensitive on the command name', () => {
    expect(parseSlashCommand('/GENERAL hi', 'bikash')).toEqual({
      mode: 'general',
      body: 'hi',
      hasBody: true,
    });
  });

  it('does not match mid-word /general (must be at start)', () => {
    expect(parseSlashCommand('explain /general as a command', 'bikash')).toBeNull();
  });
});

describe('CASCADE configuration', () => {
  it('has verified active tiers defined', () => {
    expect(CASCADE.length).toBeGreaterThanOrEqual(10);
    expect(CASCADE_LAST_VERIFIED).toBe('2026-10-30');
  });

  it('contains no duplicate model ids', () => {
    const ids = CASCADE.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('has valid structure for all tiers', () => {
    for (const tier of CASCADE) {
      expect(tier.id).toMatch(/^[\w.-]+\/[\w.-]+(:[\w.-]+)?$/);
      expect(tier.label.trim().length).toBeGreaterThan(0);
      expect(tier.provider.trim().length).toBeGreaterThan(0);
      expect(tier.contextK).toBeGreaterThan(0);
    }
  });
});

describe('isTransientFailure and describeError', () => {
  it('identifies transient errors correctly', () => {
    expect(isTransientFailure(429)).toBe(true);
    expect(isTransientFailure(404)).toBe(true);
    expect(isTransientFailure(502)).toBe(true);
    expect(isTransientFailure(503)).toBe(true);
    expect(isTransientFailure(500)).toBe(true);
  });

  it('identifies fatal errors correctly', () => {
    expect(isTransientFailure(400)).toBe(false);
    expect(isTransientFailure(401)).toBe(false);
    expect(isTransientFailure(403)).toBe(false);
  });

  it('describes error status codes meaningfully', () => {
    expect(describeError(429)).toBe('rate-limited');
    expect(describeError(401)).toBe('auth error');
    expect(describeError(403)).toBe('auth error');
    expect(describeError(404)).toBe('model unavailable');
    expect(describeError(500)).toBe('server error 500');
  });
});

describe('OVERLOADED_BODY', () => {
  it('formats overloaded error message for rate-limiting or cascade exhaustion', () => {
    const body = OVERLOADED_BODY('Tried 15 of 15 tiers', 'detail', false);
    expect(body).toContain('**Threshold is overloaded right now.**');
    expect(body).toContain('Tried 15 of 15 tiers');
    expect(body).toContain('bikashtalukder040@gmail.com');
  });

  it('formats authentication error message cleanly when auth fails', () => {
    const body = OVERLOADED_BODY('Stopped at gemma-4-31b: auth error', 'detail', true);
    expect(body).toContain('**Threshold API Authentication Error**');
    expect(body).not.toContain('**Threshold is overloaded right now.**');
    expect(body).toContain('VITE_OPENROUTER_API_KEY');
  });
});
