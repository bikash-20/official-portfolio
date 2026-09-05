import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

/* -------------------------------------------------------------------------- */
/*  Analytics — only inject when VITE_ANALYTICS_DOMAIN is set.                */
/*                                                                            */
/*  Plausible is cookie-less and GDPR-friendly by default. We use the        */
/*  official script tag injected from JS rather than templating index.html so */
/*  the static HTML stays free of conditional logic.                          */
/* -------------------------------------------------------------------------- */
const analyticsDomain = import.meta.env.VITE_ANALYTICS_DOMAIN;
if (analyticsDomain) {
  const s = document.createElement('script');
  s.defer = true;
  s.src = 'https://plausible.io/js/script.js';
  s.dataset.domain = analyticsDomain;
  document.head.appendChild(s);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
