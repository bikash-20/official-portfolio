import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/components/common/SectionHeading';
import { RevealGroup, RevealItem } from '@/components/common/Reveal';
import ProjectCard from './ProjectCard';
import { projects } from '@/data/projects';
import type { Project } from '@/types';
import {
  projectMatchesFilter,
  useSkillFilter,
} from '@/hooks/useSkillFilter';

type Filter = 'All' | Project['category'];

const filters: Filter[] = ['All', 'AI', 'Web', 'Enterprise'];

function prettyKey(key: string): string {
  return key
    .split(' ')
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0]?.toUpperCase() + w.slice(1)))
    .join(' ');
}

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('All');
  const { selected, toggle, clear, isActive } = useSkillFilter();

  // Project must satisfy: category match AND skill filter match.
  const visible = useMemo(
    () =>
      projects.filter((p) => {
        const catOk = filter === 'All' || p.category === filter;
        const skillOk = projectMatchesFilter(p.tech, selected);
        return catOk && skillOk;
      }),
    [filter, selected],
  );

  return (
    <section id="projects" className="relative py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Work"
          title="Projects"
          subtitle="A selection of 13+ production-grade projects spanning AI, web, enterprise, and mobile."
        />

        {/* Category filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {filters.map((f) => (
            <motion.button
              key={f}
              whileTap={{ scale: 0.96 }}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? 'gradient-bg text-white shadow-lg shadow-primary/30'
                  : 'glass text-text-muted hover:text-text'
              }`}
              aria-pressed={filter === f}
            >
              {f}
            </motion.button>
          ))}
        </div>

        {/* Active skill-filter chips row — appears only when filters are set */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-text-muted">Filtering by skill:</span>
                {Array.from(selected).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggle(prettyKey(key))}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/40 text-primary-light hover:bg-primary/25 transition-colors"
                  >
                    {prettyKey(key)}
                    <span className="text-primary-light/80 hover:text-white" aria-hidden="true">×</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clear}
                  className="ml-1 px-2.5 py-1 rounded-full text-text-muted hover:text-secondary-light underline-offset-2 hover:underline transition-colors"
                >
                  Clear all
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project grid (or empty state) */}
        <RevealGroup
          stagger={0.05}
          amount={0.1}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 min-h-[120px]"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <RevealItem key={p.id} className="h-full">
                {/* Layout + exit wrapper: handles filter-change position
                    swap and the fade-out. The outer RevealItem (above) owns
                    the scroll-reveal variant; this inner motion.div only
                    animates on filter change, not on first paint. */}
                <motion.div
                  layout
                  initial={false}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  <ProjectCard project={p} />
                </motion.div>
              </RevealItem>
            ))}
          </AnimatePresence>

          {visible.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <p className="text-text-muted text-sm">
                No projects match the current filters.
              </p>
              <button
                type="button"
                onClick={clear}
                className="mt-3 text-primary-light hover:underline text-sm"
              >
                Clear skill filters
              </button>
            </motion.div>
          )}
        </RevealGroup>

        <p className="text-center text-text-muted text-sm mt-8">
          Showing {visible.length} of {projects.length} projects ·{' '}
          <a
            href="https://github.com/bikash-20"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-light hover:underline"
          >
            See all on GitHub →
          </a>
        </p>
      </div>
    </section>
  );
}
