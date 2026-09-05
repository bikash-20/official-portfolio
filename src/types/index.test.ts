import { describe, expect, it } from 'vitest';
import {
  isAchievement,
  type Achievement,
  type Stat,
} from './index';

const achievement: Achievement = {
  id: 1,
  title: 'Hackathon Finalist',
  organization: 'SUST',
  description: 'desc',
  date: '2026',
  icon: 'Trophy',
};

const stat: Stat = {
  id: 'stat-repos',
  title: '78+ Public Repositories',
  organization: 'GitHub',
  description: 'desc',
  date: 'Ongoing',
  icon: 'Package',
};

describe('isAchievement', () => {
  it('narrows by number id', () => {
    expect(isAchievement(achievement)).toBe(true);
    expect(isAchievement(stat)).toBe(false);
  });
});
