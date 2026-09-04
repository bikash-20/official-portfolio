import { motion } from 'framer-motion';
import {
  FaGithub,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
  FaDownload,
  FaArrowRight,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import TypingEffect from './TypingEffect';

const socials = [
  { icon: FaGithub, href: 'https://github.com/bikash-20', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/bikash-talukder-6497633b8/', label: 'LinkedIn' },
  { icon: SiLeetcode, href: 'https://leetcode.com/bikashtalukder', label: 'LeetCode' },
  { icon: FaWhatsapp, href: 'https://wa.me/8801926240062', label: 'WhatsApp' },
  { icon: FaEnvelope, href: 'mailto:bikashtalukder040@gmail.com', label: 'Email' },
];

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-base sm:text-lg h-8 sm:h-10 flex items-center justify-center lg:justify-start"
          >
            <TypingEffect />
          </motion.div>

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-lg gradient-bg text-white font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all"
            >
              View Projects
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg glass text-text hover:border-primary/40 transition-all hover:-translate-y-0.5"
            >
              Get in Touch
            </a>
            <a
              href="/assets/resume.pdf"
              download
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-secondary/40 text-secondary-light hover:bg-secondary/10 transition-all hover:-translate-y-0.5"
            >
              <FaDownload /> Download CV
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex items-center justify-center lg:justify-start gap-3"
          >
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 rounded-lg glass flex items-center justify-center text-text-muted hover:text-primary-light hover:border-primary/40 transition-all hover:-translate-y-0.5"
              >
                <s.icon size={18} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right: Profile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="order-1 lg:order-2 flex justify-center"
        >
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full gradient-bg opacity-60 blur-2xl animate-pulse" />
            <div
              className="absolute -inset-2 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #6C63FF, #FF6584, #6C63FF)',
                animation: 'spin 12s linear infinite',
              }}
            />
            <div className="absolute inset-2 rounded-full bg-bg overflow-hidden border-4 border-bg">
              <img
                src="/assets/profile.jpg"
                alt="Bikash Talukder"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full glass-strong text-xs font-medium text-text shadow-lg"
            >
              13+ Projects
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-3 -left-3 px-3 py-1.5 rounded-full glass-strong text-xs font-medium text-text shadow-lg"
            >
              2x Finalist
            </motion.div>
          </div>
        </motion.div>
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
