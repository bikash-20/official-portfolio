/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENROUTER_API_KEY?: string;
  readonly VITE_OPENWEATHER_API_KEY?: string;
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  /** Optional Plausible analytics domain. Leave empty to disable. */
  readonly VITE_ANALYTICS_DOMAIN?: string;
  /** Set to "live" to fetch the real GitHub contribution grid. */
  readonly VITE_GITHUB_CONTRIBUTIONS?: 'live' | string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
