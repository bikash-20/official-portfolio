import SectionHeading from '@/components/common/SectionHeading';
import { RevealGroup, RevealItem } from '@/components/common/Reveal';
import GitHubStatsCard from './GitHubStatsCard';
import LeetCodeCard from './LeetCodeCard';
import CodeforcesCard from './CodeforcesCard';
import WeatherCard from './WeatherCard';
import ClockCard from './ClockCard';
import ContributionGraph from './ContributionGraph';
import DashboardCard from './DashboardCard';

/**
 * Local-time + date card. Kept inline because it has no fetch — just the
 * browser's clock — so it's cheaper than a separate file.
 */
function TodayCard() {
  const now = new Date();
  const headline = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Dhaka',
  });
  const yearLine = now.toLocaleDateString('en-US', {
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  });
  return (
    <DashboardCard
      icon={<span className="font-heading font-bold text-sm">D</span>}
      iconChipClass="bg-success/15"
      iconTextClass="text-success"
      title="Today"
      rightSlot={<span className="text-xs text-text-muted">Bangladesh</span>}
    >
      <div className="font-heading text-xl sm:text-2xl font-bold gradient-text">{headline}</div>
      <div className="text-xs text-text-muted mt-2">{yearLine}</div>
    </DashboardCard>
  );
}

export default function Dashboard() {
  return (
    <section id="dashboard" className="relative py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Live Data"
          title="Dashboard"
          subtitle="Real-time snapshots of my developer footprint, location, and learning streak."
        />

        <RevealGroup
          stagger={0.05}
          amount={0.1}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6"
        >
          <RevealItem><GitHubStatsCard /></RevealItem>
          <RevealItem><LeetCodeCard /></RevealItem>
          <RevealItem><CodeforcesCard /></RevealItem>
          <RevealItem><WeatherCard /></RevealItem>
          <RevealItem><ClockCard /></RevealItem>
          <RevealItem><TodayCard /></RevealItem>
        </RevealGroup>

        <ContributionGraph />
      </div>
    </section>
  );
}
