import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Globe, ChevronDown, Search, X } from 'lucide-react';
import { useThemeStore, useLangStore } from '../../store';
import type { Language } from '../../types';

const LANGS: { code: Language; label: string; short: string }[] = [
  { code: 'ru',      label: 'Русский',  short: 'RU' },
  { code: 'uz',      label: "O'zbek",   short: 'UZ' },
  { code: 'uz_cyrl', label: 'Ўзбекча', short: 'УЗ' },
];

const NAV = [
  { to: '/',         key: 'nav.home'     },
  { to: '/menu',     key: 'nav.menu'     },
  { to: '/about',    key: 'nav.about'    },
  { to: '/branches', key: 'nav.branches' },
];

export default function Header() {
  const { t } = useTranslation();
  const { theme, toggle } = useThemeStore();
  const { language, setLanguage } = useLangStore();
  const loc = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const langRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const isAdmin = loc.pathname.startsWith('/admin');

  const submitSearch = () => {
    const q = query.trim();
    if (!q) return;
    navigate(`/menu?search=${encodeURIComponent(q)}`);
    setSearchOpen(false);
  };

  useEffect(() => {
    if (searchOpen) mobileSearchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const isActive = (to: string) =>
    to === '/' ? loc.pathname === '/' : loc.pathname.startsWith(to);

  const currentLang = LANGS.find(l => l.code === language) ?? LANGS[0];

  if (isAdmin) return null;

  // Fully transparent at top, frosted pill on scroll
  const expanded = !scrolled;

  // Use actual RGBA so framer-motion can interpolate cleanly (no CSS vars)
  const pillBg = theme === 'dark'
    ? 'rgba(12,24,18,0.32)'
    : 'rgba(226,230,208,0.55)';

  // Only routes with a guaranteed dark photo overlay behind the hero are safe
  // for hardcoded white nav text — everywhere else (solid page background)
  // white-on-white can happen in light theme, so fall back to theme color.
  const hasDarkHero = ['/', '/menu', '/branches', '/about'].includes(loc.pathname);
  const expandedTextShadow = expanded ? '0 1px 4px rgba(0,0,0,0.35)' : 'none';
  const logoColorExpanded = hasDarkHero ? '#fff' : 'var(--c-text)';
  const iconColorExpanded = hasDarkHero ? 'rgba(255,255,255,0.82)' : 'var(--c-text-2)';

  return (
    <>
      {/* justifyContent stays 'center' in both states so the pill always
          shrinks/grows symmetrically around the same center line — never
          flips layout mode, which is what caused the lopsided animation */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 16px',
        pointerEvents: 'none',
      }}>
        <motion.div
          animate={{
            background: expanded ? 'rgba(0,0,0,0)' : pillBg,
            backdropFilter: expanded ? 'blur(0px)' : 'blur(28px) saturate(1.7)',
            WebkitBackdropFilter: expanded ? 'blur(0px)' : 'blur(28px) saturate(1.7)',
            borderRadius: expanded ? '20px' : '100px',
            borderColor: expanded ? 'rgba(255,255,255,0)' : 'rgba(184,136,75,0.14)',
            boxShadow: expanded ? 'none' : '0 2px 24px rgba(0,0,0,0.16)',
            maxWidth: expanded ? 1280 : 880,
            height: expanded ? 72 : 52,
            paddingLeft: expanded ? 28 : 14,
            paddingRight: expanded ? 28 : 8,
          }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{
            pointerEvents: 'auto',
            display: 'flex', alignItems: 'center', gap: 6,
            width: '100%',
            borderWidth: 1, borderStyle: 'solid',
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0, marginRight: 12, textDecoration: 'none' }}>
            <img src="/logo.png" alt="Lummy" style={{
              width: 32, height: 32, borderRadius: '50%',
              objectFit: 'cover', flexShrink: 0,
              boxShadow: '0 2px 10px rgba(184,136,75,0.25)',
            }} />
            <div>
              <div className="logo-wordmark" style={{
                fontSize: '1.5rem', fontWeight: 400,
                lineHeight: 1,
                color: expanded ? logoColorExpanded : 'var(--c-text)',
                textShadow: expandedTextShadow,
                transition: 'color 0.7s ease',
              }}>
                Lummy
              </div>
              <div style={{ fontSize: 7, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--c-gold)', lineHeight: 1, marginTop: 1 }}>
                Restaurant & Desserts
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hdr-nav">
            {NAV.map(({ to, key }) => {
              const active = isActive(to);
              return (
                <Link key={to} to={to} style={{
                  position: 'relative',
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.12em',
                  textTransform: 'uppercase', textDecoration: 'none',
                  color: active ? 'var(--c-gold)' : (expanded ? iconColorExpanded : 'var(--c-text-3)'),
                  textShadow: active ? 'none' : expandedTextShadow,
                  transition: 'color 0.4s',
                  padding: '8px 12px', borderRadius: 'var(--r-pill)',
                }}>
                  {t(key)}
                  {active && (
                    <motion.span layoutId="nav-underline" style={{
                      position: 'absolute', bottom: 4, left: 12, right: 12,
                      height: 1, background: 'var(--c-gold)', borderRadius: 1,
                    }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* On mobile hdr-nav is display:none, so its flex:1 can't push
              these icons to the right edge — this spacer fills that role,
              but only on mobile (nav itself handles it on desktop). */}
          <div className="hdr-spacer" />

          {/* Search — full input on desktop, icon-only on mobile.
              No inline `display` here on purpose: the CSS class below must
              be the only thing controlling visibility per breakpoint —
              an inline display:flex would always beat display:none in CSS.
              When expanded/transparent, drop the filled pill look (it read as
              a disconnected floating box) and blend in with just an
              underline, matching how the nav links have no box either. */}
          <div className="hdr-search-desktop" style={{
            alignItems: 'center', gap: 7,
            padding: expanded ? '0 4px 6px' : '0 12px', height: 38, width: 170,
            borderRadius: expanded ? 0 : 'var(--r-pill)',
            background: expanded ? 'transparent' : 'var(--c-bg-2)',
            border: 'none',
            borderBottom: expanded ? `1px solid ${iconColorExpanded}` : 'none',
            boxShadow: expanded ? 'none' : 'inset 0 0 0 1px var(--c-border)',
            opacity: expanded ? 0.85 : 1,
            transition: 'background 0.4s, border-color 0.4s, opacity 0.4s',
          }}>
            <Search size={13} style={{ color: expanded ? iconColorExpanded : 'var(--c-text-3)', flexShrink: 0, textShadow: expandedTextShadow }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submitSearch(); }}
              placeholder="Поиск блюд..."
              style={{
                flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
                fontSize: 12.5, color: expanded ? logoColorExpanded : 'var(--c-text)',
                textShadow: expandedTextShadow,
              }}
            />
          </div>

          <button onClick={() => setSearchOpen(v => !v)} aria-label="Поиск" className="hdr-search-btn"
            style={{
              alignItems: 'center', justifyContent: 'center',
              padding: 8, borderRadius: 'var(--r-pill)',
              color: expanded ? iconColorExpanded : 'var(--c-text-3)',
              textShadow: expandedTextShadow,
              background: 'transparent', border: 'none', cursor: 'pointer',
              transition: 'color 0.4s', minWidth: 40, minHeight: 40,
            }}>
            <Search size={16} />
          </button>

          {/* Lang */}
          <div ref={langRef} style={{ position: 'relative' }}>
            <button onClick={() => setLangOpen(v => !v)} aria-label="Language"
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '8px 8px', borderRadius: 'var(--r-pill)',
                color: expanded ? iconColorExpanded : 'var(--c-text-3)',
                textShadow: expandedTextShadow,
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.09em',
                transition: 'color 0.4s', minWidth: 40, minHeight: 40,
              }}>
              <Globe size={14} />
              <span className="hdr-lang-short">{currentLang.short}</span>
              <ChevronDown size={9} style={{ transition: 'transform 0.2s', transform: langOpen ? 'rotate(180deg)' : 'none' }} />
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    background: 'var(--c-bg-1)', border: '1px solid var(--c-border)',
                    borderRadius: 'var(--r-md)', overflow: 'hidden',
                    minWidth: 140, zIndex: 200,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  }}>
                  {LANGS.map(l => (
                    <button key={l.code}
                      onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                      style={{
                        width: '100%', textAlign: 'left', padding: '11px 16px',
                        fontSize: 13, background: 'none', border: 'none', cursor: 'pointer',
                        color: l.code === language ? 'var(--c-gold)' : 'var(--c-text-2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-bg-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                      {l.label}
                      {l.code === language && <span style={{ color: 'var(--c-gold)', fontSize: 11 }}>✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme */}
          <button onClick={toggle} aria-label="Toggle theme"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 8, borderRadius: 'var(--r-pill)',
              color: expanded ? iconColorExpanded : 'var(--c-text-3)',
              textShadow: expandedTextShadow,
              background: 'transparent', border: 'none', cursor: 'pointer',
              transition: 'color 0.4s', minWidth: 40, minHeight: 40,
            }}>
            <motion.div key={theme} initial={{ rotate: -20, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </motion.div>
          </button>
        </motion.div>
      </header>

      {langOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setLangOpen(false)} />}

      {/* Mobile search panel */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setSearchOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              style={{ position: 'fixed', top: 86, left: 16, right: 16, zIndex: 99 }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--c-bg-1)', border: '1px solid var(--c-border)',
                borderRadius: 'var(--r-pill)', padding: '10px 16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
              }}>
                <Search size={15} style={{ color: 'var(--c-text-3)', flexShrink: 0 }} />
                <input
                  ref={mobileSearchRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submitSearch(); }}
                  placeholder="Поиск блюд..."
                  style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: 'var(--c-text)' }}
                />
                <button onClick={() => setSearchOpen(false)} style={{ color: 'var(--c-text-3)', display: 'flex', flexShrink: 0 }}>
                  <X size={15} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .hdr-nav {
          display: none; align-items: center; gap: 2px; flex: 1; justify-content: center;
        }
        .hdr-spacer { flex: 1; }
        .hdr-lang-short { display: none; }
        .hdr-search-desktop { display: none; }
        .hdr-search-btn { display: flex; }
        @media (min-width: 768px) {
          .hdr-nav { display: flex !important; }
          .hdr-spacer { display: none; flex: 0; }
          .hdr-lang-short { display: inline !important; }
          .hdr-search-desktop { display: flex !important; }
          .hdr-search-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
