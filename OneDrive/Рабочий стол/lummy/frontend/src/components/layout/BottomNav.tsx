import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Home, UtensilsCrossed, Info, MapPin } from 'lucide-react';

// About at end
const NAV = [
  { to: '/',         icon: Home,            key: 'nav.home'     },
  { to: '/menu',     icon: UtensilsCrossed, key: 'nav.menu'     },
  { to: '/branches', icon: MapPin,          key: 'nav.branches' },
  { to: '/about',    icon: Info,            key: 'nav.about'    },
];

export default function BottomNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 60);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  if (isAdmin) return null;

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <div style={{ height: 80 }} className="bottom-nav-spacer" />

      <motion.div
        className="floating-dock-wrap"
        initial={false}
        animate={{ y: visible ? 0 : 100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        style={{ pointerEvents: visible ? 'auto' : 'none' }}
      >
        <nav className="floating-dock">
          {NAV.map(({ to, icon: Icon, key }) => {
            const active = isActive(to);
            return (
              <Link key={to} to={to} className="dock-item">
                <AnimatePresence>
                  {active && (
                    <motion.div
                      layoutId="dock-pill"
                      className="dock-pill"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  animate={{ y: active ? -2 : 0, scale: active ? 1.15 : 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}
                >
                  <Icon size={20} color={active ? 'var(--c-gold)' : 'var(--c-text-2)'} />
                </motion.div>

                <AnimatePresence>
                  {active && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="dock-label"
                    >
                      {t(key)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
      </motion.div>

      <style>{`
        .floating-dock-wrap {
          position: fixed;
          bottom: 16px;
          left: 0; right: 0;
          z-index: 200;
          display: flex;
          justify-content: center;
          padding: 0 16px;
        }
        .floating-dock {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(12,24,18,0.26);
          border: 1px solid rgba(184,136,75,0.12);
          border-radius: var(--r-pill);
          padding: 8px 10px;
          backdrop-filter: blur(28px) saturate(1.6);
          -webkit-backdrop-filter: blur(28px) saturate(1.6);
          box-shadow: 0 4px 24px rgba(0,0,0,0.2);
          padding-bottom: calc(8px + env(safe-area-inset-bottom));
        }
        [data-theme="light"] .floating-dock {
          background: rgba(226,230,208,0.5);
          border-color: rgba(20,39,27,0.13);
        }
        .dock-item {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          gap: 6px; padding: 10px 14px;
          border-radius: var(--r-pill);
          text-decoration: none; overflow: hidden;
        }
        .dock-pill {
          position: absolute; inset: 0;
          border-radius: var(--r-pill);
          background: var(--c-gold-glow);
          border: 1px solid var(--c-gold-line);
          z-index: 0;
        }
        .dock-label {
          position: relative; z-index: 1;
          font-size: 11px; font-weight: 600;
          color: var(--c-gold); white-space: nowrap; overflow: hidden;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        @media (min-width: 768px) {
          .bottom-nav-spacer, .floating-dock-wrap { display: none !important; }
        }
      `}</style>
    </>
  );
}
