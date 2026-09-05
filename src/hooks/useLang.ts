import { useEffect, useState } from 'react';

/* -------------------------------------------------------------------------- */
/*  Locale hint                                                                */
/*                                                                             */
/*  Read `?lang=bn` from the URL on first mount, then persist to              */
/*  localStorage so subsequent visits remember. No full i18n — we just want   */
/*  one Bangla welcome line in the Hero. Add more locales here when needed.   */
/* -------------------------------------------------------------------------- */

export type Locale = 'en' | 'bn';

const STORAGE_KEY = 'bt-lang';
const SUPPORTED: readonly Locale[] = ['en', 'bn'];

function isLocale(v: string | null): v is Locale {
  return v !== null && (SUPPORTED as readonly string[]).includes(v);
}

function readInitial(): Locale {
  if (typeof window === 'undefined') return 'en';
  const hinted = new URLSearchParams(window.location.search).get('lang');
  if (isLocale(hinted)) return hinted;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isLocale(stored)) return stored;
  return 'en';
}

/** Greeting shown under the hero tagline when locale === 'bn'. */
export const WELCOME: Record<Locale, string> = {
  en: '',
  bn: 'স্বাগতম — সিলেট থেকে আমার পোর্টফোলিও দেখুন।',
};

export function useLang(): { locale: Locale; setLocale: (l: Locale) => void } {
  const [locale, setLocale] = useState<Locale>(readInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* storage unavailable — silent */
    }
    // Reflect on <html lang> so screen readers / search engines pick it up.
    document.documentElement.lang = locale === 'bn' ? 'bn' : 'en';
  }, [locale]);

  return { locale, setLocale };
}
