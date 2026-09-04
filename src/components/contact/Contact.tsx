import { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  FaEnvelope,
  FaWhatsapp,
  FaLinkedin,
  FaGithub,
  FaDownload,
  FaCheck,
  FaCopy,
} from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import SectionHeading from '@/components/common/SectionHeading';
import { copyToClipboard } from '@/utils/helpers';

const contacts = [
  { icon: FaEnvelope, label: 'Email', value: 'bikashtalukder040@gmail.com', href: 'mailto:bikashtalukder040@gmail.com', color: 'text-rose-400' },
  { icon: FaWhatsapp, label: 'WhatsApp', value: '+880 1926 240062', href: 'https://wa.me/8801926240062', color: 'text-emerald-400' },
  { icon: FaLinkedin, label: 'LinkedIn', value: 'in/bikash-talukder-6497633b8', href: 'https://www.linkedin.com/in/bikash-talukder-6497633b8/', color: 'text-blue-400' },
  { icon: FaGithub, label: 'GitHub', value: '@bikash-20', href: 'https://github.com/bikash-20', color: 'text-text' },
  { icon: SiLeetcode, label: 'LeetCode', value: '@bikashtalukder', href: 'https://leetcode.com/bikashtalukder', color: 'text-amber-400' },
];

export default function Contact() {
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleCopy = async (value: string, label: string) => {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      // Graceful no-op — fall back to mailto
      window.location.href = `mailto:bikashtalukder040@gmail.com?subject=Portfolio%20Contact%20-%20${encodeURIComponent(
        form.name
      )}&body=${encodeURIComponent(form.message + '\n\n— ' + form.email)}`;
      return;
    }

    setStatus('sending');
    try {
      await emailjs.send(
        serviceId,
        templateId,
        { from_name: form.name, reply_to: form.email, message: form.message },
        { publicKey }
      );
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-24">
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Let's Connect"
          title="Get in Touch"
          subtitle="Open to full-time roles, internships, freelance AI engineering, and interesting collaborations."
        />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Contact tiles */}
          <div>
            <h3 className="font-heading font-semibold text-xl mb-5">Direct Channels</h3>
            <ul className="space-y-3">
              {contacts.map((c) => (
                <motion.li
                  key={c.label}
                  whileHover={{ x: 4 }}
                  className="glass rounded-xl border border-border hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3 p-4">
                    <div className={`w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-lg ${c.color}`}>
                      <c.icon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-text-muted">{c.label}</div>
                      <a
                        href={c.href}
                        target={c.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="text-sm font-mono truncate block hover:text-primary-light"
                      >
                        {c.value}
                      </a>
                    </div>
                    <button
                      onClick={() => handleCopy(c.value, c.label)}
                      className="p-2 rounded-lg hover:bg-surface text-text-muted hover:text-text transition-colors shrink-0"
                      title="Copy"
                      aria-label={`Copy ${c.label}`}
                    >
                      {copied === c.label ? (
                        <FaCheck className="text-success" />
                      ) : (
                        <FaCopy />
                      )}
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>

            <a
              href="/assets/resume.pdf"
              download
              className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-lg gradient-bg text-white font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all"
            >
              <FaDownload /> Download Full Résumé
            </a>
          </div>

          {/* Right: Form */}
          <div>
            <h3 className="font-heading font-semibold text-xl mb-5">Send a Message</h3>
            <form onSubmit={handleSubmit} className="glass rounded-2xl border border-border p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs uppercase tracking-wider text-text-muted mb-1.5">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-lg bg-bg-2 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-wider text-text-muted mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-bg-2 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors text-sm"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs uppercase tracking-wider text-text-muted mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about your project, role, or idea…"
                  className="w-full px-4 py-2.5 rounded-lg bg-bg-2 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-3 rounded-lg gradient-bg text-white font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'sending'
                  ? 'Sending…'
                  : status === 'sent'
                  ? 'Message Sent'
                  : status === 'error'
                  ? 'Failed — try email directly'
                  : 'Send Message'}
              </button>

              <p className="text-xs text-text-muted text-center">
                Or email me directly at{' '}
                <a href="mailto:bikashtalukder040@gmail.com" className="text-primary-light hover:underline">
                  bikashtalukder040@gmail.com
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
