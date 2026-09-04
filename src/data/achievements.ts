import type { Achievement } from '@/types';

export const achievements: Achievement[] = [
  {
    id: 1,
    title: 'SUST CSE Carnival 2026 — Finalist',
    organization: 'Codex Community × SUST',
    description:
      'Finalist with LiquiGuard / iquiGuard, an enterprise-grade multi-provider liquidity command center featuring 12-minute EWMA forecasting and live SSE streaming.',
    date: '2026',
    certificate: '/assets/hackathon-cert.png',
    certificateType: 'image',
    icon: 'Trophy',
  },
  {
    id: 2,
    title: 'PSTU National Hackathon 2026 — Finalist',
    organization: 'PSTU',
    description:
      'Built PSTU Wallet, a multi-provider mobile money movement system (bKash, Nagad, Rocket) for the PSTU National Hackathon 2026.',
    date: '2026',
    icon: 'Trophy',
  },
  {
    id: 3,
    title: 'Software Engineering Internship Offer',
    organization: 'Internship Offer 1',
    description:
      'Received an internship offer based on demonstrated production-grade full-stack and AI engineering skills. (Company name to be added.)',
    date: '2026',
    certificate: '/assets/internship-1.png',
    certificateType: 'image',
    icon: 'Briefcase',
  },
  {
    id: 4,
    title: 'Software Engineering Internship Offer',
    organization: 'Internship Offer 2',
    description:
      'Received a second internship offer recognizing real-world engineering capability across the stack. (Company name to be added.)',
    date: '2026',
    certificate: '/assets/internship-2.pdf',
    certificateType: 'pdf',
    icon: 'Briefcase',
  },
];

export const stats: Achievement[] = [
  {
    id: 'stat-1' as unknown as number,
    title: '2,280+ GitHub Contributions',
    organization: 'Last 12 months',
    description:
      'Top 1% among Bangladeshi students — consistent, year-round contribution activity across 78+ repositories.',
    date: '2025 — 2026',
    icon: 'Fire',
  },
  {
    id: 'stat-2' as unknown as number,
    title: '78+ Public Repositories',
    organization: 'GitHub',
    description:
      'One of the most active student developers on GitHub, shipping across AI, web, mobile, and systems domains.',
    date: 'Ongoing',
    icon: 'Package',
  },
];
