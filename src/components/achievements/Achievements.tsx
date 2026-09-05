import { useState } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { RevealGroup, RevealItem } from '@/components/common/Reveal';
import AchievementCard from './AchievementCard';
import CertificateModal from './CertificateModal';
import { achievements, stats } from '@/data/achievements';
import { isAchievement, type AchievementOrStat } from '@/types';

export default function Achievements() {
  const [active, setActive] = useState<AchievementOrStat | null>(null);

  return (
    <section id="achievements" className="relative py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Milestones"
          title="Achievements"
          subtitle="Hackathon finals, internship offers, and a track record of consistent contribution."
        />

        <RevealGroup
          stagger={0.05}
          amount={0.1}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12"
        >
          {achievements.map((a) => (
            <RevealItem key={a.id} className="h-full">
              <AchievementCard item={a} onView={setActive} />
            </RevealItem>
          ))}
          {stats.map((s) => (
            <RevealItem key={s.id} className="h-full">
              <AchievementCard item={s} onView={setActive} />
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="text-center text-text-muted text-sm">
          <p className="inline-block px-4 py-2 rounded-full glass border border-border">
            Top 1% among Bangladeshi students · 2x National Hackathon Finalist
          </p>
        </div>
      </div>

      <CertificateModal
        open={!!active}
        onClose={() => setActive(null)}
        src={isAchievement(active!) ? active?.certificate : undefined}
        title={active?.title ?? ''}
        type={isAchievement(active!) ? active?.certificateType : undefined}
      />
    </section>
  );
}
