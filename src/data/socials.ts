import {
  FaGithub,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
} from 'react-icons/fa';
import { SiLeetcode, SiCodeforces } from 'react-icons/si';
import type { IconType } from 'react-icons';

/**
 * Single source of truth for Bikash's social handles.
 *
 * Components import this list instead of redeclaring it. Each entry pairs
 * the platform with the routing URL, a display value (used by Contact's
 * copy-to-clipboard tiles), and an accent color used by Contact.
 *
 * If a new network is added, append the entry here — Hero, Footer, and
 * Contact will all pick it up automatically.
 */
export interface SocialLink {
  /** Stable id — also used as React key. */
  id: 'github' | 'linkedin' | 'leetcode' | 'codeforces' | 'whatsapp' | 'email';
  icon: IconType;
  /** Outbound URL (mailto: works for the email entry). */
  href: string;
  /** Tooltip / aria-label. */
  label: string;
  /** Human-readable handle, shown in the Contact tile. */
  handle: string;
  /** Tailwind text-color class for the Contact tile icon. */
  accent: string;
}

export const SOCIALS: readonly SocialLink[] = [
  {
    id: 'github',
    icon: FaGithub,
    href: 'https://github.com/bikash-20',
    label: 'GitHub',
    handle: '@bikash-20',
    accent: 'text-text',
  },
  {
    id: 'linkedin',
    icon: FaLinkedin,
    href: 'https://www.linkedin.com/in/bikash-talukder-6497633b8/',
    label: 'LinkedIn',
    handle: 'in/bikash-talukder-6497633b8',
    accent: 'text-blue-400',
  },
  {
    id: 'leetcode',
    icon: SiLeetcode,
    href: 'https://leetcode.com/bikashtalukder',
    label: 'LeetCode',
    handle: '@bikashtalukder',
    accent: 'text-amber-400',
  },
  {
    id: 'codeforces',
    icon: SiCodeforces,
    href: 'https://codeforces.com/profile/talukder_20',
    label: 'Codeforces',
    handle: '@talukder_20',
    accent: 'text-sky-400',
  },
  {
    id: 'whatsapp',
    icon: FaWhatsapp,
    href: 'https://wa.me/8801926240062',
    label: 'WhatsApp',
    handle: '+880 1926 240062',
    accent: 'text-emerald-400',
  },
  {
    id: 'email',
    icon: FaEnvelope,
    href: 'mailto:bikashtalukder040@gmail.com',
    label: 'Email',
    handle: 'bikashtalukder040@gmail.com',
    accent: 'text-rose-400',
  },
];
