import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaStar } from 'react-icons/fa';
import type { Project } from '@/types';

interface Props {
  project: Project;
  delay?: number;
}

const categoryColors: Record<Project['category'], string> = {
  AI: 'from-purple-500/30 to-pink-500/30 border-purple-500/40',
  Web: 'from-cyan-500/30 to-blue-500/30 border-cyan-500/40',
  Mobile: 'from-emerald-500/30 to-teal-500/30 border-emerald-500/40',
  Enterprise: 'from-amber-500/30 to-orange-500/30 border-amber-500/40',
};

const categoryBadge: Record<Project['category'], string> = {
  AI: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  Web: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  Mobile: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  Enterprise: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
};

export default function ProjectCard({ project, delay = 0 }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay }}
      className={`relative rounded-2xl glass overflow-hidden border bg-gradient-to-br ${categoryColors[project.category]} hover:-translate-y-1 transition-all group`}
    >
      {/* Decorative header */}
      <div className="relative h-32 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading text-3xl sm:text-4xl font-bold gradient-text opacity-50 group-hover:opacity-100 transition-opacity">
            #{project.id.toString().padStart(2, '0')}
          </span>
        </div>
        {project.featured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-primary/90 text-white shadow-lg">
            <FaStar size={10} /> Featured
          </span>
        )}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${categoryBadge[project.category]}`}
        >
          {project.category}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="font-heading font-semibold text-lg sm:text-xl mb-2 group-hover:text-primary-light transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-[11px] rounded-md bg-surface/60 border border-border text-text-muted font-mono"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-border">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary-light text-sm font-medium transition-colors"
            >
              <FaExternalLinkAlt size={12} /> Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface hover:bg-surface-2 text-text text-sm font-medium transition-colors border border-border"
            >
              <FaGithub size={13} /> GitHub
            </a>
          )}
          {!project.liveUrl && !project.githubUrl && (
            <span className="flex-1 text-center text-xs text-text-muted italic">
              Private / In Development
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
