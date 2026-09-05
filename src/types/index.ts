export interface Project {
  id: number;
  name: string;
  description: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  category: 'AI' | 'Web' | 'Mobile' | 'Enterprise';
}

export interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
  color: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
}

export interface Achievement {
  id: number;
  title: string;
  organization: string;
  description: string;
  date: string;
  certificate?: string; // path in /assets
  certificateType?: 'pdf' | 'image';
  icon: string;
}

/**
 * A "stat" card displayed alongside achievements. Visually identical to
 * `Achievement` (rendered by `AchievementCard`) but carries no certificate
 * and uses a string id so we don't pretend it's a numbered milestone.
 */
export interface Stat {
  id: string;
  title: string;
  organization: string;
  description: string;
  date: string;
  icon: string;
}

/** Union of items that can sit in the Achievements grid. */
export type AchievementOrStat = Achievement | Stat;

/** Narrow an AchievementOrStat to Achievement (true numbered milestone). */
export function isAchievement(item: AchievementOrStat): item is Achievement {
  return typeof item.id === 'number';
}

export interface Interest {
  id: number;
  title: string;
  description: string;
  icon: string;
  gradient: string;
}
