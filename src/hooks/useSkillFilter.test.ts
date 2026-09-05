import { describe, expect, it } from 'vitest';
import {
  normalizeSkill,
  projectMatchesFilter,
} from './useSkillFilter';

describe('normalizeSkill', () => {
  it('lowercases input', () => {
    expect(normalizeSkill('React')).toBe('react');
  });

  it('strips a trailing single-digit version', () => {
    expect(normalizeSkill('React 18')).toBe('react');
    expect(normalizeSkill('Spring Boot 3')).toBe('spring boot');
  });

  it('strips a trailing dotted version', () => {
    expect(normalizeSkill('Next.js 16')).toBe('next.js');
    expect(normalizeSkill('Java 17')).toBe('java');
  });

  it('preserves mid-word dots, slashes and casing elsewhere', () => {
    expect(normalizeSkill('HTML / CSS')).toBe('html / css');
    expect(normalizeSkill('OpenRouter')).toBe('openrouter');
  });

  it('collapses internal whitespace', () => {
    expect(normalizeSkill('  PyTorch   Lightning  ')).toBe('pytorch lightning'.replace(/\s+/g, ' '));
  });

  it('returns empty string for blank input', () => {
    expect(normalizeSkill('')).toBe('');
    expect(normalizeSkill('   ')).toBe('');
  });
});

describe('projectMatchesFilter', () => {
  const tech = ['React 18', 'FastAPI', 'D3.js'];

  it('returns true when no filter is selected', () => {
    expect(projectMatchesFilter(tech, new Set())).toBe(true);
  });

  it('matches by single selected skill using normalized key', () => {
    const sel = new Set(['react']);
    expect(projectMatchesFilter(tech, sel)).toBe(true);
  });

  it('matches when a different casing/version is in the set', () => {
    // Selected keys are already normalized (toggle() runs normalizeSkill
    // before insertion). So we pass the normalized form here, and the
    // filter still collides with "React 18" because normalizeSkill also
    // strips trailing versions on the tech side.
    expect(projectMatchesFilter(tech, new Set([normalizeSkill('React 18')]))).toBe(true);
    expect(projectMatchesFilter(tech, new Set([normalizeSkill('React')]))).toBe(true);
  });

  it('returns false when none of the selected keys match any tech', () => {
    expect(projectMatchesFilter(tech, new Set(['rust']))).toBe(false);
  });

  it('requires at least one match across multiple selected skills', () => {
    expect(projectMatchesFilter(tech, new Set(['rust', 'fastapi']))).toBe(true);
    expect(projectMatchesFilter(tech, new Set(['rust', 'go']))).toBe(false);
  });
});
