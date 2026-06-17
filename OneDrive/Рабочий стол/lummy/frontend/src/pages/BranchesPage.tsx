import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Clock, Navigation, Coffee, ChefHat, Star } from 'lucide-react';
import { useDataStore } from '../store';
import type { Branch } from '../types';

/* ── Yandex Maps ─────────────────────────────────────── */
declare global { interface Window { ymaps: any; ymapsReady: boolean; } }

function loadYmaps(): Promise<void> {
  return new Promise(resolve => {
    if (window.ymaps && window.ymapsReady) { resolve(); return; }
    if (document.querySelector('script[src*="api-maps.yandex.ru"]')) {
      const t = setInterval(() => {
        if (window.ymaps) { window.ymaps.ready(() => { window.ymapsReady = true; resolve(); }); clearInterval(t); }
      }, 100);
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
    s.async = true;
    s.onload = () => window.ymaps.ready(() => { window.ymapsReady = true; resolve(); });
    document.head.appendChild(s);
  });
}

function markerSvg(): string {
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="52" height="65" viewBox="0 0 52 65">
    <filter id="s"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.5)"/></filter>
    <g filter="url(#s)">
      <path d="M26 4C14.95 4 6 12.95 6 24c0 15 20 37 20 37s20-22 20-37C46 12.95 37.05 4 26 4z" fill="#B8884B" stroke="#D9AE74" stroke-width="2.5"/>
      <circle cx="26" cy="24" r="9" fill="#13200F"/>
      <text x="26" y="29" text-anchor="middle" font-size="11" font-family="serif" font-weight="bold" fill="#B8884B">L</text>
    </g>
  </svg>`)}`;
}

function YMap({ branch }: { branch: Branch }) {
  const mapEl = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        await loadYmaps();
        if (dead || !mapEl.current) return;
        const map = new window.ymaps.Map(mapEl.current, {
          center: [branch.lat, branch.lng],
          zoom: 15,
          controls: ['zoomControl'],
        }, { suppressMapOpenBlock: true });
        const pm = new window.ymaps.Placemark(
          [branch.lat, branch.lng],
          { hintContent: branch.name },
          { iconLayout: 'default#image', iconImageHref: markerSvg(), iconImageSize: [52, 65], iconImageOffset: [-26, -65] }
        );
        map.geoObjects.add(pm);
        setLoading(false);
      } catch {
        if (!dead) { setError(true); setLoading(false); }
      }
    })();
    return () => { dead = true; };
  }, [branch]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--c-bg-2)', zIndex: 2 }}>
          <div style={{ width: 32, height: 32, border: '3px solid var(--c-border)', borderTopColor: 'var(--c-gold)', borderRadius: '50%' }} className="spin" />
          <p style={{ fontSize: 12, color: 'var(--c-text-3)' }}>Загружаем карту…</p>
        </div>
      )}
      {error && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--c-bg-2)', zIndex: 2 }}>
          <MapPin size={26} style={{ color: 'var(--c-text-3)' }} />
          <p style={{ fontSize: 12, color: 'var(--c-text-3)' }}>Карта недоступна</p>
        </div>
      )}
      <div ref={mapEl} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────── */
export default function BranchesPage() {
  const { t } = useTranslation();
  const { branches } = useDataStore();
  const branch = branches.find(b => b.isMain) ?? branches[0];

  if (!branch) {
    return (
      <div className="page-top" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--c-text-3)' }}>Нет филиалов</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--c-bg)',
      backgroundImage: 'radial-gradient(rgba(184,136,75,0.1) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      backgroundPosition: '0 0',
    }}>

      {/* Hero banner with background photo — bleeds behind the transparent header */}
      <div style={{
        padding: 'calc(var(--nav-h) + clamp(56px,8vw,96px)) 0 clamp(56px,8vw,96px)',
        position: 'relative', overflow: 'hidden',
      }}>
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=85&fit=crop"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,16,11,0.88) 0%, rgba(8,16,11,0.65) 100%)' }} />
        <div className="wrap wrap-sm" style={{ position: 'relative', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 10 }}>
              <span className="line" style={{ background: 'rgba(184,136,75,0.4)' }} />
              <span className="t-label" style={{ color: 'var(--c-gold)' }}>Lummy</span>
              <span className="line" style={{ background: 'rgba(184,136,75,0.4)' }} />
            </div>
            <h1 className="t-display t-h1" style={{ color: '#fff', marginBottom: 8 }}>
              {t('branches.title')}
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
              Ташкент · Seoul Mun
            </p>
          </motion.div>
        </div>
      </div>

      {/* Map section */}
      <div className="wrap" style={{ paddingTop: 28, paddingBottom: 0 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            position: 'relative',
            borderRadius: 'var(--r-xl)',
            overflow: 'hidden',
            border: '1px solid var(--c-border)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.4)',
            height: 'clamp(300px, 42vh, 460px)',
          }}
        >
          <YMap branch={branch} />

          {/* Top overlay */}
          <div style={{ position: 'absolute', top: 14, left: 14, right: 14, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <div className="map-pill" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 'var(--r-pill)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1E3528,#0C1812)', border: '1px solid rgba(184,136,75,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'serif', fontSize: 11, fontWeight: 700, color: '#D9AE74' }}>L</span>
              </div>
              <div>
                <p className="map-title" style={{ fontFamily: 'var(--f-display)', fontSize: 14, fontWeight: 600, lineHeight: 1 }}>{branch.name}</p>
                <p style={{ fontSize: 10, color: 'var(--c-gold)', opacity: 0.9, marginTop: 2 }}>Lummy Restaurant</p>
              </div>
            </div>
            <div className="map-pill" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 14px', borderRadius: 'var(--r-pill)' }}>
              <Clock size={13} color="var(--c-gold)" />
              <span className="map-title" style={{ fontSize: 13, fontWeight: 600 }}>{branch.hours}</span>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4CAF7D', boxShadow: '0 0 6px #4CAF7D', flexShrink: 0 }} />
            </div>
          </div>

          {/* Bottom overlay */}
          <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, zIndex: 10 }}>
            <div className="map-box" style={{ padding: '12px 14px', borderRadius: 'var(--r-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
                <MapPin size={13} color="var(--c-gold)" style={{ flexShrink: 0, marginTop: 1 }} />
                <p className="map-addr">{branch.address}</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <a href={`tel:${branch.phone.replace(/\s/g, '')}`} className="btn-call">
                  <Phone size={13} /> Позвонить
                </a>
                <a href={`https://maps.yandex.ru/?ll=${branch.lng},${branch.lat}&z=16&pt=${branch.lng},${branch.lat}`}
                  target="_blank" rel="noopener noreferrer" className="btn-route">
                  <Navigation size={13} /> Маршрут
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Creative info section below map */}
      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Quote banner */}
          <div style={{
            position: 'relative', overflow: 'hidden',
            borderRadius: 'var(--r-xl)',
            marginBottom: 20,
            padding: 'clamp(22px,4vw,36px) clamp(20px,5vw,48px)',
            background: 'var(--c-bg-1)',
            border: '1px solid var(--c-border)',
          }}>
            <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 120, opacity: 0.04, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>✦</div>
            <p style={{
              fontFamily: 'var(--f-accent)', fontSize: 'clamp(1rem,2.5vw,1.4rem)',
              fontStyle: 'italic', color: 'var(--c-text-2)', lineHeight: 1.6, position: 'relative',
            }}>
              «Мы создаём не просто ресторан — мы создаём место, куда хочется возвращаться снова и снова»
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#1E3528,#0C1812)', border: '1px solid rgba(184,136,75,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--f-display)', fontSize: 11, fontWeight: 700, color: '#D9AE74' }}>L</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-gold)' }}>Команда Lummy</span>
            </div>
          </div>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {[
              { icon: <Clock size={18} color="var(--c-gold)" />, label: 'Часы работы', value: branch.hours, sub: 'Без выходных' },
              { icon: <Phone size={18} color="var(--c-gold)" />, label: 'Телефон', value: branch.phone, href: `tel:${branch.phone.replace(/\s/g, '')}`, sub: 'Звоните в любое время' },
              { icon: <MapPin size={18} color="var(--c-gold)" />, label: 'Адрес', value: branch.address, sub: 'Seoul Mun, Ташкент' },
              { icon: <Coffee size={18} color="var(--c-gold)" />, label: 'Атмосфера', value: 'Уютно & стильно', sub: 'Для всей семьи' },
              { icon: <ChefHat size={18} color="var(--c-gold)" />, label: 'Кухня', value: 'Авторские блюда', sub: 'Свежие ингредиенты' },
              { icon: <Star size={18} color="var(--c-gold)" />, label: 'Рейтинг', value: '4.9 / 5.0', sub: 'По отзывам гостей' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: 'clamp(14px,3vw,18px)',
                background: 'var(--c-bg-1)', border: '1px solid var(--c-border)',
                borderRadius: 'var(--r-md)',
              }}>
                <div style={{ marginBottom: 10 }}>{item.icon}</div>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{item.label}</p>
                {item.href
                  ? <a href={item.href} style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-gold)', display: 'block', lineHeight: 1.3, marginBottom: 3 }}>{item.value}</a>
                  : <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text)', lineHeight: 1.3, marginBottom: 3 }}>{item.value}</p>
                }
                <p style={{ fontSize: 10, color: 'var(--c-text-3)', lineHeight: 1.3 }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .map-pill {
          background: rgba(12,24,18,0.8);
          border: 1px solid rgba(184,136,75,0.2);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .map-box {
          background: rgba(12,24,18,0.88);
          border: 1px solid rgba(184,136,75,0.18);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .map-title { color: #EDE6D6; }
        .map-addr  { font-size: 12px; color: rgba(240,232,220,0.8); line-height: 1.4; }
        [data-theme="light"] .map-pill { background: rgba(255,255,255,0.9); border: 1px solid rgba(20,39,27,0.1); }
        [data-theme="light"] .map-box  { background: rgba(255,255,255,0.93); border: 1px solid rgba(20,39,27,0.08); }
        [data-theme="light"] .map-title { color: var(--c-text); }
        [data-theme="light"] .map-addr  { color: var(--c-text-2); }
        .btn-call {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
          height: 42px; border-radius: var(--r-pill);
          background: linear-gradient(135deg,#B8884B,#D9AE74);
          color: #13200F; font-weight: 700; font-size: 12px;
          letter-spacing: 0.06em; text-transform: uppercase;
          text-decoration: none; transition: opacity 0.2s;
        }
        .btn-call:hover { opacity: 0.88; }
        .btn-route {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
          height: 42px; border-radius: var(--r-pill);
          background: transparent; border: 1px solid rgba(184,136,75,0.35);
          color: #B8884B; font-weight: 700; font-size: 12px;
          letter-spacing: 0.06em; text-transform: uppercase;
          text-decoration: none; transition: all 0.2s;
        }
        .btn-route:hover { background: rgba(184,136,75,0.1); border-color: rgba(184,136,75,0.6); }
        [data-theme="light"] .btn-route { border-color: rgba(138,100,50,0.4); color: var(--c-gold); }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.9s linear infinite; }
      `}</style>
    </div>
  );
}
