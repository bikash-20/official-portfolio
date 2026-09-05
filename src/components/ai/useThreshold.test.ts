import { describe, expect, it } from 'vitest';
import { parseSlashCommand } from './useThreshold';

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
