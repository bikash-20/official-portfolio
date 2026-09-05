import { motion } from 'framer-motion';
import {
  FaEnvelope,
  FaDownload,
  FaArrowRight,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { SOCIALS } from '@/data/socials';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs sm:text-sm text-primary-light mb-5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            Open to opportunities · Sylhet, Bangladesh
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05]"
          >
            Hi, I'm{' '}
            <span className="gradient-text">Bikash</span>
            <br />
            <span className="text-text">Talukder.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 font-heading text-xl sm:text-2xl text-text-muted"
          >
            Full-Stack Developer &{' '}
            <span className="gradient-text font-semibold">AI Systems Builder</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 font-mono text-xs sm:text-sm tracking-[0.18em] uppercase text-text-muted text-center lg:text-left"
          >
            Full-stack · LLM engineering · Production AI systems
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 flex items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm text-text-muted flex-wrap"
          >
            <span className="inline-flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-secondary" /> 2nd Year CSE @ Metropolitan University
            </span>
            <span className="hidden sm:inline">•</span>
            <span>CGPA 3.65</span>
            <span className="hidden sm:inline">•</span>
            <span>78+ Repos · 2,280+ Contributions</span>
          </motion.div>

          {/* CTA block: primary + secondary + CV — no toggle, no duplicate. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4"
          >
            {/* Primary: View Work → projects */}
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-full gradient-bg text-white font-medium shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-shadow"
              aria-label="View Work"
            >
              View Work
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                <FaArrowRight />
              </span>
            </motion.a>

            {/* Secondary: Hire Me → contact */}
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-full border border-secondary/40 text-secondary-light hover:bg-secondary/10 hover:border-secondary/70 transition-all"
              aria-label="Hire Me"
            >
              <FaEnvelope />
              Hire Me
            </motion.a>

            {/* Tertiary: download CV */}
            <a
              href="/assets/resume.pdf"
              download
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border text-text-muted hover:text-text hover:border-primary/40 transition-all hover:-translate-y-0.5"
            >
              <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
                <FaDownload />
              </span>
              Download CV
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex items-center justify-center lg:justify-start gap-3"
          >
            {SOCIALS.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="group w-10 h-10 rounded-full glass flex items-center justify-center text-text-muted hover:text-primary-light hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20"
              >
                <span className="transition-transform duration-300 group-hover:scale-110">
                  <s.icon size={18} />
                </span>
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right: Editorial portrait */}
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 lg:order-2 relative"
        >
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/30">
            <img
              src="/assets/profile.jpg"
              alt="Bikash Talukder"
              className="w-full h-full object-cover saturate-[0.95] contrast-[1.02]"
            />
            {/* Faint bottom vignette so the caption block reads well in both themes */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            />
          </div>

          {/* Editorial caption beneath the image */}
          <figcaption className="mt-5 px-1">
            <div className="font-heading text-sm sm:text-base font-semibold tracking-[0.18em] uppercase text-text">
              Bikash Talukder
            </div>
            <div className="mt-1.5 h-px w-full bg-border" />
            <p className="mt-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-text-muted">
              Full-Stack Developer · AI Systems Builder · Sylhet, BD
            </p>
          </figcaption>
        </motion.figure>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-text-muted flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}
