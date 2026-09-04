import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/common/SectionHeading';
import ProjectCard from './ProjectCard';
import { projects } from '@/data/projects';
import type { Project } from '@/types';

type Filter = 'All' | Project['category'];

const filters: Filter[] = ['All', 'AI', 'Web', 'Enterprise'];

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('All');

  const visible = projects.filter((p) => filter === 'All' || p.category === filter);

  return (
    <section id="projects" className="relative py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Work"
          title="Projects"
          subtitle="A selection of 13+ production-grade projects spanning AI, web, enterprise, and mobile."
        />

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
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
            >
              {f}
            </motion.button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {visible.map((p, i) => (
            <ProjectCard key={p.id} project={p} delay={(i % 6) * 0.05} />
          ))}
        </div>

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
