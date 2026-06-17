import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Trophy, Leaf, Sparkles, Bike, ChevronDown, Ticket, Copy, Check as CheckIcon,
} from 'lucide-react';
import { useDataStore } from '../../store';
import { useLangStore } from '../../store';
import { getCatName } from '../../utils';
import DishCard from '../menu/DishCard';
import DragCarousel from '../common/DragCarousel';
import type { Category, Language } from '../../types';

/* ── Reveal ─────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '', fill = false }: {
  children: React.ReactNode; delay?: number; className?: string; fill?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      style={fill ? { height: '100%', display: 'flex', flexDirection: 'column' } : undefined}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}>
      {children}
    </motion.div>
  );
}

/* ── Section Header ─────────────────────────────── */
function SH({ label, title, center = true }: { label: string; title: string; center?: boolean }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 36 }}>
      <div className="section-tag" style={{ justifyContent: center ? 'center' : 'flex-start', marginBottom: 10 }}>
        <span className="line" />
        <span className="t-label">{label}</span>
        <span className="line" />
      </div>
      <h2 className="t-display t-h2" style={{ color: 'var(--c-text)' }}>{title}</h2>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   HERO
════════════════════════════════════════════════════════ */
export function HeroSection() {
  const { t } = useTranslation();
  return (
    <section style={{ position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1920&q=90&fit=crop"
          alt="Lummy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="eager" fetchPriority="high"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(165deg, rgba(12,24,18,0.9) 0%, rgba(12,24,18,0.55) 50%, rgba(12,24,18,0.82) 100%)' }} />
      </div>

      <div className="wrap" style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingTop: 80, paddingBottom: 80 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
          <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 20 }}>
            <span className="line" style={{ background: 'rgba(184,136,75,0.5)' }} />
            <span className="t-label" style={{ color: 'var(--c-gold)' }}>{t('hero.tagline')}</span>
            <span className="line" style={{ background: 'rgba(184,136,75,0.5)' }} />
          </div>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.22 }}
          className="t-display t-hero"
          style={{ color: '#fff', marginBottom: 24, maxWidth: 800, marginInline: 'auto' }}>
          {t('hero.title').split('\n').map((line, i) => (
            <span key={i} style={{ display: 'block' }}>
              {i === 1 ? <span className="gold-text">{line}</span> : line}
            </span>
          ))}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.38 }}
          style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 520, marginInline: 'auto', marginBottom: 40 }}>
          {t('hero.subtitle')}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/menu" className="btn btn-gold btn-xl">
            {t('hero.cta_menu')} <ArrowRight size={18} />
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)' }}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.7, ease: 'easeInOut' }}>
            <ChevronDown size={24} color="rgba(255,255,255,0.38)" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   PROMO CODES — click a code to reveal what it gives
════════════════════════════════════════════════════════ */
function PromoCodeCard({ promo }: { promo: import('../../types').Promo }) {
  const { language } = useLangStore();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const title = language === 'ru' ? promo.titleRu : (promo.titleUz || promo.titleRu);
  const desc = language === 'ru' ? promo.descriptionRu : (promo.descriptionUz || promo.descriptionRu);

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!promo.code) return;
    navigator.clipboard?.writeText(promo.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <motion.div
      layout
      onClick={() => setOpen(o => !o)}
      style={{
        cursor: 'pointer', borderRadius: 'var(--r-lg)',
        border: `1px solid ${open ? 'var(--c-gold-line)' : 'var(--c-border)'}`,
        background: open ? 'var(--c-gold-glow)' : 'var(--c-bg-1)',
        overflow: 'hidden', transition: 'border-color var(--t-base), background var(--t-base)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
        <div style={{
          width: 38, height: 38, borderRadius: 'var(--r-sm)', flexShrink: 0,
          background: 'var(--c-gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-gold)',
        }}>
          <Ticket size={17} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text)', lineHeight: 1.3 }}>{title}</p>
          {promo.code && (
            <p style={{ fontFamily: 'var(--f-display)', fontSize: 12, fontWeight: 700, color: 'var(--c-gold)', letterSpacing: '0.08em', marginTop: 2 }}>
              {promo.code}
            </p>
          )}
        </div>
        {promo.code && (
          <button onClick={copy} className="btn btn-ghost btn-xs" style={{ gap: 5, flexShrink: 0 }}>
            {copied ? <CheckIcon size={12} /> : <Copy size={12} />}
            {copied ? 'Скопировано' : 'Код'}
          </button>
        )}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ color: 'var(--c-text-3)', flexShrink: 0 }}>
          <ChevronDown size={16} />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--c-border)', marginTop: 2, paddingTop: 12 }}>
              {typeof promo.discount === 'number' && (
                <span className="badge badge-gold" style={{ marginBottom: 8, display: 'inline-flex' }}>-{promo.discount}%</span>
              )}
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--c-text-3)' }}>{desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function PromoCodesSection() {
  const { promos } = useDataStore();
  const active = promos.filter(p => p.isActive && p.code);

  if (active.length === 0) return null;

  return (
    <section style={{ padding: 'clamp(32px,5vw,56px) 0', background: 'var(--c-bg-1)', overflow: 'hidden' }}>
      <div className="wrap">
        <Reveal>
          <div style={{ marginBottom: 20 }}>
            <div className="section-tag" style={{ marginBottom: 10 }}>
              <span className="line" /><span className="t-label">Промокоды</span>
            </div>
            <h2 className="t-display t-h3" style={{ color: 'var(--c-text)' }}>Скидки по промокоду</h2>
          </div>
        </Reveal>
        <div className="dishes-grid-2">
          {active.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06} fill>
              <PromoCodeCard promo={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   PROMOS (Акции) — bold "sale ticket" style: heavy sans
   uppercase headline, diagonal stripe accent, numeral badge.
   (style experiment #1 — same dishes-grid-2 underneath)
════════════════════════════════════════════════════════ */
export function PromosSection() {
  const { dishes } = useDataStore();
  const saleDishes = dishes.filter(d => d.oldPrice && d.oldPrice > d.price && !d.isHidden).slice(0, 4);

  if (saleDishes.length === 0) return null;

  return (
    <section style={{ position: 'relative', padding: 'clamp(40px,6vw,72px) 0', background: 'var(--c-bg)', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(-45deg, rgba(224,82,82,0.05) 0px, rgba(224,82,82,0.05) 2px, transparent 2px, transparent 26px)',
      }} />
      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{
                fontFamily: 'var(--f-body)', fontSize: 'clamp(2.2rem,5vw,3.2rem)', fontWeight: 800,
                color: 'rgba(224,82,82,0.16)', lineHeight: 1, letterSpacing: '-0.04em', flexShrink: 0,
              }}>%</span>
              <div>
                <span style={{
                  display: 'inline-block', fontFamily: 'var(--f-body)', fontSize: 10, fontWeight: 800,
                  letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff',
                  background: '#E05252', padding: '4px 10px', borderRadius: 4, marginBottom: 10,
                }}>Акции</span>
                <h2 style={{
                  fontFamily: 'var(--f-body)', fontWeight: 800, textTransform: 'uppercase',
                  fontSize: 'clamp(1.5rem,3.4vw,2.2rem)', letterSpacing: '-0.01em',
                  color: 'var(--c-text)', lineHeight: 1.05,
                }}>Специальные предложения</h2>
              </div>
            </div>
            <Link to="/menu" className="btn btn-outline btn-sm">Все акции <ArrowRight size={14} /></Link>
          </div>
        </Reveal>
        <div className="dishes-grid-2">
          {saleDishes.map((dish, i) => (
            <Reveal key={dish.id} delay={i * 0.06} fill>
              <DishCard dish={dish} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   BESTSELLERS (Хиты) — "spotlight" style: gold medallion icon,
   warm radial glow behind the heading.
════════════════════════════════════════════════════════ */
export function BestSellersSection() {
  const { t } = useTranslation();
  const { dishes } = useDataStore();
  const bestsellers = dishes.filter(d => d.isBestseller && !d.isHidden).slice(0, 4);

  return (
    <section style={{ position: 'relative', padding: 'clamp(40px,6vw,72px) 0', background: 'var(--c-bg-1)', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(184,136,75,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(184,136,75,0.07) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />
      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
            <div>
              <div className="section-tag" style={{ marginBottom: 10 }}>
                <span className="line" />
                <span className="t-label">{t('sections.bestsellers')}</span>
              </div>
              <h2 className="t-display t-h2" style={{ color: 'var(--c-text)' }}>{t('sections.bestsellers')}</h2>
            </div>
            <Link to="/menu" className="btn btn-outline btn-sm">{t('common.show_more')} <ArrowRight size={14} /></Link>
          </div>
        </Reveal>
        <div className="dishes-grid-2">
          {bestsellers.map((dish, i) => (
            <Reveal key={dish.id} delay={i * 0.06} fill>
              <DishCard dish={dish} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   NEW ITEMS (Новинки) — "fresh drop" style: gold pill badge,
   dotted backdrop texture.
════════════════════════════════════════════════════════ */
export function NewItemsSection() {
  const { t } = useTranslation();
  const { dishes } = useDataStore();
  const newDishes = dishes.filter(d => d.isNew && !d.isHidden).slice(0, 4);

  if (newDishes.length === 0) return null;

  return (
    <section style={{ position: 'relative', padding: 'clamp(40px,6vw,72px) 0', background: 'var(--c-bg)', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.6,
        backgroundImage: 'radial-gradient(rgba(184,136,75,0.14) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }} />
      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <h2 className="t-display t-h2" style={{ color: 'var(--c-text)' }}>Новинки меню</h2>
            </div>
            <Link to="/menu" className="btn btn-outline btn-sm">{t('common.show_more')} <ArrowRight size={14} /></Link>
          </div>
        </Reveal>
        <div className="dishes-grid-2">
          {newDishes.map((dish, i) => (
            <Reveal key={dish.id} delay={i * 0.06} fill>
              <DishCard dish={dish} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   CATEGORIES — Infinite DragCarousel
════════════════════════════════════════════════════════ */
function CatItem({ cat, language }: { cat: Category; language: Language }) {
  return (
    <Link to="/menu" style={{ display: 'block', textDecoration: 'none', flexShrink: 0, padding: '4px 6px' }}>
      <motion.div
        whileHover={{ y: -3, scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.18 }}
        style={{
          background: 'var(--c-bg-2)',
          border: '1px solid var(--c-border)',
          borderRadius: 'var(--r-md)',
          padding: '12px 10px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          cursor: 'pointer', userSelect: 'none',
          width: 80,
        }}
      >
        {cat.image
          ? <img src={cat.image} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
          : <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{cat.icon}</span>}
        <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--c-text-2)', textAlign: 'center', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
          {getCatName(cat, language)}
        </span>
      </motion.div>
    </Link>
  );
}

export function CategoriesSection() {
  const { t } = useTranslation();
  const { language } = useLangStore();
  const { categories } = useDataStore();
  const activeCats = categories.filter(c => c.isActive);
  const items = [...activeCats, ...activeCats, ...activeCats];

  return (
    <section style={{ padding: 'clamp(40px,6vw,72px) 0', background: 'var(--c-bg-1)', overflow: 'hidden' }}>
      <div className="wrap">
        <Reveal><SH label={t('sections.popular')} title={t('sections.popular')} /></Reveal>
      </div>
      <div style={{ position: 'relative' }}>
        {/* Blur layer: full-strength backdrop blur across the whole band so the
            cut-off card at the edge is properly obscured, not just tinted */}
        <div className="carousel-edge-blur" style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 120, zIndex: 2, pointerEvents: 'none', WebkitMaskImage: 'linear-gradient(to right, black 0%, black 65%, transparent 100%)', maskImage: 'linear-gradient(to right, black 0%, black 65%, transparent 100%)' }} />
        <div className="carousel-edge-blur" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 120, zIndex: 2, pointerEvents: 'none', WebkitMaskImage: 'linear-gradient(to left, black 0%, black 65%, transparent 100%)', maskImage: 'linear-gradient(to left, black 0%, black 65%, transparent 100%)' }} />
        {/* Colour fade layer on top: blends the blurred band into the section background */}
        <div className="carousel-edge-fade" style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 120, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(to right, var(--c-bg-1) 0%, var(--c-bg-1) 25%, transparent 100%)' }} />
        <div className="carousel-edge-fade" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 120, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(to left, var(--c-bg-1) 0%, var(--c-bg-1) 25%, transparent 100%)' }} />
        <DragCarousel speed={0.5} style={{ paddingTop: 4, paddingBottom: 4 }}>
          {items.map((cat, i) => (
            <CatItem key={`${cat.id}-${i}`} cat={cat} language={language} />
          ))}
        </DragCarousel>
      </div>
      <style>{`
        .carousel-edge-blur, .carousel-edge-fade { display: none; }
        @media (min-width: 1024px) {
          .carousel-edge-blur { display: block; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
          .carousel-edge-fade { display: block; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   ABOUT — Creative storytelling section
════════════════════════════════════════════════════════ */
export function AboutSection({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const { t } = useTranslation();

  const milestones = [
    { year: '2021', text: 'Открытие первого ресторана в Ташкенте' },
    { year: '2022', text: 'Запуск авторского десертного меню' },
    { year: '2023', text: 'Признание лучшим рестораном года' },
    { year: '2024', text: 'Новый шеф-повар, расширение кухни' },
  ];

  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--c-bg)' }}>
      {/* Background image layer */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80&fit=crop"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.07 }}
        />
      </div>

      <div className="wrap" style={{ position: 'relative', zIndex: 1, padding: 'clamp(56px,8vw,100px) 0' }}>
        {/* Top label — skipped when the page above already shows its own hero title (AboutPage) */}
        {!hideHeader && (
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,72px)' }}>
              <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 12 }}>
                <span className="line" /><span className="t-label">{t('sections.about')}</span><span className="line" />
              </div>
              <h2 className="t-display" style={{
                fontSize: 'clamp(2.4rem,6vw,5rem)',
                lineHeight: 1.05,
                color: 'var(--c-text)',
                letterSpacing: '-0.02em',
              }}>
                {t('about.title')}
              </h2>
              <p style={{
                fontFamily: 'var(--f-accent)', fontSize: 'clamp(1rem,2vw,1.3rem)',
                fontStyle: 'italic', color: 'var(--c-gold)', marginTop: 12,
              }}>
                {t('about.subtitle')}
              </p>
            </div>
          </Reveal>
        )}

        {/* Content grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(28px,5vw,64px)',
          alignItems: 'start',
          paddingInline: 'clamp(0px,2vw,0px)',
        }}>
          {/* Left — text + photo collage */}
          <Reveal>
            <div style={{ position: 'relative' }}>
              {/* Photo stack */}
              <div style={{ position: 'relative', height: 'clamp(320px,40vw,460px)' }}>
                <img
                  src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&q=80&fit=crop"
                  alt=""
                  style={{
                    position: 'absolute', left: 0, top: 0, width: '62%', height: '75%',
                    objectFit: 'cover', borderRadius: 'var(--r-lg)',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.35)',
                    border: '3px solid var(--c-bg)',
                  }}
                />
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80&fit=crop"
                  alt=""
                  style={{
                    position: 'absolute', right: 0, top: '15%', width: '44%', height: '55%',
                    objectFit: 'cover', borderRadius: 'var(--r-lg)',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.35)',
                    border: '3px solid var(--c-bg)',
                  }}
                />
                <img
                  src="https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=400&q=80&fit=crop"
                  alt=""
                  style={{
                    position: 'absolute', left: '10%', bottom: 0, width: '50%', height: '38%',
                    objectFit: 'cover', borderRadius: 'var(--r-lg)',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.35)',
                    border: '3px solid var(--c-bg)',
                  }}
                />
                {/* Gold floating card */}
                <div style={{
                  position: 'absolute', right: 0, bottom: 0,
                  background: 'linear-gradient(135deg, #B8884B, #D9AE74)',
                  borderRadius: 'var(--r-md)', padding: '14px 18px',
                  boxShadow: '0 8px 32px rgba(184,136,75,0.4)',
                }}>
                  <p style={{ fontFamily: 'var(--f-display)', fontSize: '1.6rem', fontWeight: 800, color: '#13200F', lineHeight: 1 }}>3+</p>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#3A2010', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>лет опыта</p>
                </div>
              </div>

              {/* Text below photo */}
              <div style={{ marginTop: 28 }}>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--c-text-3)' }}>
                  {t('about.text1')}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Right — timeline */}
          <Reveal delay={0.15}>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--c-text-3)', marginBottom: 32 }}>
              {t('about.text2')}
            </p>

            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  style={{ display: 'flex', gap: 16, paddingBottom: i < milestones.length - 1 ? 20 : 0 }}
                >
                  {/* Line + dot */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: 'var(--c-gold)',
                      boxShadow: '0 0 12px rgba(184,136,75,0.5)',
                      marginTop: 4, flexShrink: 0,
                    }} />
                    {i < milestones.length - 1 && (
                      <div style={{ width: 1, flex: 1, background: 'var(--c-border)', marginTop: 6 }} />
                    )}
                  </div>
                  {/* Content */}
                  <div style={{ paddingBottom: 4 }}>
                    <p style={{ fontFamily: 'var(--f-display)', fontSize: 11, fontWeight: 700, color: 'var(--c-gold)', letterSpacing: '0.12em', marginBottom: 4 }}>
                      {m.year}
                    </p>
                    <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--c-text-2)' }}>
                      {m.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <Link to="/about" className="btn btn-outline btn-md" style={{ marginTop: 32, display: 'inline-flex' }}>
              {t('common.show_more')} <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   ADVANTAGES — compact 2-col on mobile
════════════════════════════════════════════════════════ */
export function AdvantagesSection() {
  const { t } = useTranslation();
  const items = [
    { icon: <Trophy size={18} />, k: 'quality' },
    { icon: <Leaf size={18} />, k: 'craft' },
    { icon: <Sparkles size={18} />, k: 'atmosphere' },
    { icon: <Bike size={18} />, k: 'delivery' },
  ];
  return (
    <section style={{ padding: 'clamp(40px,6vw,72px) 0', background: 'var(--c-bg)', overflow: 'hidden' }}>
      <div className="wrap">
        <Reveal><SH label={t('sections.advantages')} title={t('sections.advantages')} /></Reveal>
        <div className="adv-grid">
          {items.map((item, i) => (
            <Reveal key={item.k} delay={i * 0.07} fill>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}
                style={{
                  height: '100%',
                  background: 'var(--c-bg-1)', border: '1px solid var(--c-border)',
                  borderRadius: 'var(--r-md)', padding: '16px',
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  transition: 'border-color var(--t-base), box-shadow var(--t-base)',
                }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 'var(--r-sm)', flexShrink: 0,
                  background: 'var(--c-gold-glow)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--c-gold)',
                }}>
                  {item.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontWeight: 600, fontSize: 13, color: 'var(--c-text)', marginBottom: 4, lineHeight: 1.3 }}>
                    {t(`advantages.${item.k}`)}
                  </h3>
                  <p style={{
                    fontSize: 11, lineHeight: 1.55, color: 'var(--c-text-3)',
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {t(`advantages.${item.k}_desc`)}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   FAQ
════════════════════════════════════════════════════════ */
function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '10px 14px' }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
          style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--c-text-3)' }}
        />
      ))}
    </div>
  );
}

export function FAQSection() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const chatInView = useInView(chatRef, { once: true, margin: '-80px' });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!chatInView) return;
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1900);
    const t3 = setTimeout(() => setPhase(3), 3100);
    const t4 = setTimeout(() => setPhase(4), 4700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [chatInView]);

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
  ];

  const timeStr = new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });

  return (
    <section style={{ padding: 'clamp(40px,6vw,72px) 0', background: 'var(--c-bg)', overflow: 'hidden' }}>
      <div className="wrap wrap-sm">
        <Reveal><SH label="FAQ" title={t('sections.faq')} /></Reveal>

        {/* Accordion + chat — one continuous container, messages follow the last question directly */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div style={{ background: 'var(--c-bg-1)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 20px', cursor: 'pointer' }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--c-text)' }}>{faq.q}</span>
                  <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                    style={{ fontSize: '1.4rem', lineHeight: 1, color: 'var(--c-gold)', flexShrink: 0, fontWeight: 300 }}>+</motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 20px 16px', fontSize: 13, lineHeight: 1.7, color: 'var(--c-text-3)', borderTop: '1px solid var(--c-border)', paddingTop: 14 }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}

          {/* Chat — messenger style review, directly continuing the FAQ list */}
          <div ref={chatRef} style={{
          background: 'var(--c-bg-1)',
          borderRadius: 'var(--r-xl)',
          border: '1px solid var(--c-border)',
          padding: 'clamp(16px,4vw,28px)',
          display: 'flex', flexDirection: 'column', gap: 12,
          minHeight: 180,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.025, backgroundImage: 'radial-gradient(var(--c-gold) 1px, transparent 1px)', backgroundSize: '22px 22px', pointerEvents: 'none' }} />

          {/* Client typing */}
          <AnimatePresence>
            {phase >= 1 && phase < 2 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'flex-end', gap: 9, maxWidth: '75%' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--c-bg-2)', border: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>👤</div>
                <div style={{ background: 'var(--c-bg-2)', borderRadius: '16px 16px 16px 4px', border: '1px solid var(--c-border)' }}><TypingDots /></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Client message */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div initial={{ opacity: 0, x: -10, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                style={{ display: 'flex', alignItems: 'flex-end', gap: 9, maxWidth: '75%' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--c-bg-2)', border: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>👤</div>
                <div style={{ background: 'var(--c-bg-2)', borderRadius: '16px 16px 16px 4px', border: '1px solid var(--c-border)', padding: '10px 14px' }}>
                  <p style={{ fontSize: 13, color: 'var(--c-text-2)', lineHeight: 1.5 }}>Нашёл ответы на все свои вопросы! Очень удобно всё расписано 👍</p>
                  <p style={{ fontSize: 9, color: 'var(--c-text-3)', marginTop: 4, textAlign: 'right' }}>{timeStr}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Restaurant typing */}
          <AnimatePresence>
            {phase >= 3 && phase < 4 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'flex-end', gap: 9, maxWidth: '75%', alignSelf: 'flex-end', flexDirection: 'row-reverse' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#1E3528,#0C1812)', border: '1px solid rgba(184,136,75,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'var(--f-display)', fontWeight: 700, color: '#D9AE74', flexShrink: 0 }}>L</div>
                <div style={{ background: 'var(--c-gold-glow)', borderRadius: '16px 16px 4px 16px', border: '1px solid var(--c-gold-line)' }}><TypingDots /></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Restaurant message */}
          <AnimatePresence>
            {phase >= 4 && (
              <motion.div initial={{ opacity: 0, x: 10, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                style={{ display: 'flex', alignItems: 'flex-end', gap: 9, maxWidth: '78%', alignSelf: 'flex-end', flexDirection: 'row-reverse' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#1E3528,#0C1812)', border: '1px solid rgba(184,136,75,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'var(--f-display)', fontWeight: 700, color: '#D9AE74', flexShrink: 0 }}>L</div>
                <div style={{ background: 'var(--c-gold-glow)', borderRadius: '16px 16px 4px 16px', border: '1px solid var(--c-gold-line)', padding: '10px 14px' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--c-gold)', marginBottom: 4, letterSpacing: '0.05em' }}>Lummy Restaurant</p>
                  <p style={{ fontSize: 13, color: 'var(--c-text-2)', lineHeight: 1.5 }}>Спасибо большое! Рады, что вы нашли нужную информацию 😊 Будем рады видеть вас!</p>
                  <p style={{ fontSize: 9, color: 'var(--c-text-3)', marginTop: 4, textAlign: 'right' }}>{timeStr} ✓✓</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
