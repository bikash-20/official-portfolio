import { useState } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import AchievementCard from './AchievementCard';
import CertificateModal from './CertificateModal';
import { achievements, stats } from '@/data/achievements';
import type { Achievement } from '@/types';

export default function Achievements() {
  const [active, setActive] = useState<Achievement | null>(null);

  return (
    <section id="achievements" className="relative py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Milestones"
          title="Achievements"
          subtitle="Hackathon finals, internship offers, and a track record of consistent contribution."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12">
          {achievements.map((a, i) => (
            <AchievementCard key={a.id} achievement={a} onView={setActive} delay={i * 0.05} />
          ))}
          {stats.map((s, i) => (
            <AchievementCard
              key={s.id}
              achievement={s}
              onView={setActive}
              delay={(achievements.length + i) * 0.05}
            />
          ))}
        </div>

        <div className="text-center text-text-muted text-sm">
          <p className="inline-block px-4 py-2 rounded-full glass border border-border">
            Top 1% among Bangladeshi students · 2x National Hackathon Finalist
          </p>
        </div>
      </div>

      <CertificateModal
        open={!!active}
        onClose={() => setActive(null)}
        src={active?.certificate}
        title={active?.title ?? ''}
        type={active?.certificateType}
      />
    </section>
  );
}
