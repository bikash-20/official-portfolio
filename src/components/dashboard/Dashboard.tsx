import { motion } from 'framer-motion';
import SectionHeading from '@/components/common/SectionHeading';
import GitHubStatsCard from './GitHubStatsCard';
import LeetCodeCard from './LeetCodeCard';
import CodeforcesCard from './CodeforcesCard';
import WeatherCard from './WeatherCard';
import ClockCard from './ClockCard';
import ContributionGraph from './ContributionGraph';

export default function Dashboard() {
  return (
    <section id="dashboard" className="relative py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Live Data"
          title="Dashboard"
          subtitle="Real-time snapshots of my developer footprint, location, and learning streak."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">
          <GitHubStatsCard />
          <LeetCodeCard />
          <CodeforcesCard />
          <WeatherCard />
          <ClockCard />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-5 border border-border hover:border-primary/40 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-success/15 flex items-center justify-center text-success">
                  <span className="font-heading font-bold text-sm">D</span>
                </div>
                <h3 className="font-heading font-semibold">Today</h3>
              </div>
              <span className="text-xs text-text-muted">Bangladesh</span>
            </div>
            <div className="font-heading text-xl sm:text-2xl font-bold gradient-text">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                timeZone: 'Asia/Dhaka',
              })}
            </div>
            <div className="text-xs text-text-muted mt-2">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                timeZone: 'Asia/Dhaka',
              })}{' '}
              · Friday
            </div>
          </motion.div>
        </div>

        <ContributionGraph />
      </div>
    </section>
  );
}

// re-import motion in this file
