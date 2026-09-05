import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import PalettePicker from './PalettePicker';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Interests', href: '#interests' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      const sections = links.map((l) => l.href.slice(1));
      let current = 'home';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="#home" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center font-heading font-bold text-white text-lg shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
            B
          </div>
          <span className="font-heading font-semibold text-text hidden sm:block">
            Bikash<span className="gradient-text">.</span>
          </span>
        </a>

        <ul className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  active === link.href.slice(1)
                    ? 'text-primary-light'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {link.label}
                {active === link.href.slice(1) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-linear-to-r from-primary to-secondary rounded-full"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/bikash-20"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors"
            aria-label="GitHub"
          >
            <FaGithub size={20} />
          </a>
          {/* Desktop-only: the mobile drawer below mounts its own. */}
          <div className="hidden lg:block">
            <PalettePicker />
          </div>
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors"
            aria-label="Menu"
          >
            {open ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            id="mobile-navigation"
            className="lg:hidden overflow-hidden glass-strong"
          >
            <ul className="px-4 py-3 space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      active === link.href.slice(1)
                        ? 'text-primary-light bg-primary/10'
                        : 'text-text-muted hover:text-text hover:bg-surface'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-2 border-t border-border mt-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs text-text-muted">Theme</span>
                  <PalettePicker />
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
