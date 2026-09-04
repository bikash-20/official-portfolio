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

export interface Interest {
  id: number;
  title: string;
  description: string;
  icon: string;
  gradient: string;
}
