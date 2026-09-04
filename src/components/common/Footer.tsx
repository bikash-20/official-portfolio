import { FaGithub, FaLinkedin, FaWhatsapp, FaEnvelope, FaCode } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

const socials = [
  { icon: FaGithub, href: 'https://github.com/bikash-20', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/bikash-talukder-6497633b8/', label: 'LinkedIn' },
  { icon: SiLeetcode, href: 'https://leetcode.com/bikashtalukder', label: 'LeetCode' },
  { icon: FaWhatsapp, href: 'https://wa.me/8801926240062', label: 'WhatsApp' },
  { icon: FaEnvelope, href: 'mailto:bikashtalukder040@gmail.com', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-bg-2/50 mt-24">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center font-heading font-bold text-white">
                B
              </div>
              <span className="font-heading font-semibold text-lg">
                Bikash<span className="gradient-text">.</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-text-muted max-w-sm">
              Full-Stack Developer & AI Systems Builder. Building production-grade software and architecting intelligent systems.
            </p>
          </div>

          <div className="flex justify-center">
            <ul className="flex items-center gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-lg glass flex items-center justify-center text-text-muted hover:text-primary-light hover:border-primary/40 transition-all hover:-translate-y-0.5"
                  >
                    <s.icon size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:text-right">
            <p className="text-sm text-text-muted">
              &copy; {new Date().getFullYear()} Bikash Talukder. All rights reserved.
            </p>
            <p className="text-xs text-text-muted mt-2 flex items-center md:justify-end gap-1.5">
              Built with <FaCode className="text-primary" /> React, Vite & Tailwind
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
