import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';
import './index.css';
import App from './App';

// Apply saved theme BEFORE render to prevent flash of wrong theme
const savedTheme = (() => {
  try {
    const stored = localStorage.getItem('lummy_theme');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.state?.theme ?? 'dark';
    }
  } catch { /* empty */ }
  return 'dark';
})();
document.documentElement.setAttribute('data-theme', savedTheme);

// Apply saved language
const savedLang = localStorage.getItem('lummy_language') || 'ru';
document.documentElement.setAttribute('lang', savedLang === 'ru' ? 'ru' : 'uz');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
