import { describe, expect, it } from 'vitest';
import { WELCOME } from './useLang';

describe('WELCOME message map', () => {
  it('renders nothing for English', () => {
    expect(WELCOME.en).toBe('');
  });

  it('has a non-empty Bangla greeting', () => {
    expect(WELCOME.bn.length).toBeGreaterThan(0);
    // Bangla unicode range: U+0980–U+09FF
    expect(/\p{Script=Bengali}/u.test(WELCOME.bn)).toBe(true);
  });
});
