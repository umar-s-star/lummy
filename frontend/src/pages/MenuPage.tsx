import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import DishCard from '../components/menu/DishCard';
import DragCarousel from '../components/common/DragCarousel';
import { useDataStore, useLangStore } from '../store';
import { getCatName, getDishName } from '../utils';

export default function MenuPage() {
  const { t } = useTranslation();
  const { language } = useLangStore();
  const { dishes, categories } = useDataStore();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') || '');

  // Header search navigates here with ?search=... — pick up new queries
  // even if MenuPage is already mounted (route doesn't remount on query change).
  useEffect(() => {
    const q = searchParams.get('search');
    if (q && q !== search) setSearch(q);
  }, [searchParams]);
  const [tag, setTag] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const headerRef = useRef<HTMLDivElement>(null);

  const activeCats = useMemo(
    () => categories.filter(c => c.isActive),
    [categories]
  );

  const filteredDishes = useMemo(() => {
    let list = dishes.filter(d => !d.isHidden);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d => getDishName(d, language).toLowerCase().includes(q));
    }
    if (tag === 'bestseller') list = list.filter(d => d.isBestseller);
    if (tag === 'new') list = list.filter(d => d.isNew);
    if (tag === 'sale') list = list.filter(d => d.oldPrice && d.oldPrice > d.price);
    return list;
  }, [search, tag, dishes, language]);

  // Dishes grouped by category (only cats with dishes after filter)
  const grouped = useMemo(() => {
    return activeCats.map(cat => ({
      cat,
      dishes: filteredDishes.filter(d => d.categoryId === cat.id),
    })).filter(g => g.dishes.length > 0);
  }, [activeCats, filteredDishes]);

  const scrollToCategory = useCallback((catId: string) => {
    const el = sectionRefs.current[catId];
    if (!el) return;
    const headerH = (headerRef.current?.offsetHeight ?? 140) + 16;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  // Track active section with IntersectionObserver
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveSection(e.target.getAttribute('data-cat-id') ?? '');
            break;
          }
        }
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 }
    );
    grouped.forEach(({ cat }) => {
      const el = sectionRefs.current[cat.id];
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [grouped]);

  const tagOpts = [
    { k: '',           l: t('menu.all') },
    { k: 'bestseller', l: t('menu.bestseller') },
    { k: 'new',        l: t('menu.new') },
    { k: 'sale',       l: 'Акция' },
  ];

  const totalCount = filteredDishes.length;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage:
        'repeating-linear-gradient(45deg, rgba(184,136,75,0.05) 0px, rgba(184,136,75,0.05) 1px, transparent 1px, transparent 18px),' +
        'repeating-linear-gradient(-45deg, rgba(184,136,75,0.05) 0px, rgba(184,136,75,0.05) 1px, transparent 1px, transparent 18px)',
    }}>
      {/* Banner with background photo — bleeds behind the transparent header, like the homepage hero */}
      <div style={{ padding: 'calc(var(--nav-h) + clamp(56px,8vw,96px)) 0 clamp(56px,8vw,96px)', position: 'relative', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=85&fit=crop"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,16,11,0.88) 0%, rgba(8,16,11,0.65) 100%)' }} />
        <div className="wrap wrap-sm" style={{ textAlign: 'center', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 12 }}>
              <span className="line" style={{ background: 'rgba(184,136,75,0.4)' }} />
              <span className="t-label" style={{ color: 'var(--c-gold)' }}>Lummy Restaurant</span>
              <span className="line" style={{ background: 'rgba(184,136,75,0.4)' }} />
            </div>
            <h1 className="t-display t-h1" style={{ color: '#fff', marginBottom: 8 }}>
              {t('menu.title')}
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
              {totalCount} {language === 'ru' ? 'позиций' : 'items'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Sticky controls */}
      <div ref={headerRef} style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'var(--c-bg)',
        borderBottom: '1px solid var(--c-border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <div className="wrap" style={{ paddingTop: 12, paddingBottom: 12 }}>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '0 16px', background: 'var(--c-bg-1)',
            border: '1px solid var(--c-border)', borderRadius: 'var(--r-pill)',
            height: 42, marginBottom: 12,
            transition: 'border-color var(--t-fast)',
          }}
            onFocusCapture={e => (e.currentTarget.style.borderColor = 'var(--c-gold)')}
            onBlurCapture={e => (e.currentTarget.style.borderColor = 'var(--c-border)')}
          >
            <Search size={14} style={{ color: 'var(--c-text-3)', flexShrink: 0 }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t('menu.search')}
              style={{ flex: 1, background: 'transparent', outline: 'none', fontSize: 14, color: 'var(--c-text)', border: 'none' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ color: 'var(--c-text-3)', display: 'flex', flexShrink: 0 }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Tag pills */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
            {tagOpts.map(tg => (
              <button key={tg.k} onClick={() => setTag(tg.k)} style={{
                padding: '5px 14px', borderRadius: 'var(--r-pill)',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                background: tag === tg.k ? 'var(--c-gold-glow)' : 'transparent',
                color: tag === tg.k ? 'var(--c-gold)' : 'var(--c-text-3)',
                border: `1px solid ${tag === tg.k ? 'var(--c-gold-line)' : 'var(--c-border)'}`,
                transition: 'all var(--t-fast)',
              }}>
                {tg.l}
              </button>
            ))}
          </div>

          {/* Category carousel — infinite DragCarousel */}
          {(() => {
            const allCats = [{ id: '', icon: '🍽️', image: undefined as string | undefined, name: t('menu.all') }, ...activeCats.map(c => ({ id: c.id, icon: c.icon || '🍽️', image: c.image, name: getCatName(c, language) }))];
            const tripled = [...allCats, ...allCats, ...allCats];
            return (
              <div style={{ position: 'relative' }}>
                <div className="carousel-edge-blur" style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 90, zIndex: 2, pointerEvents: 'none', WebkitMaskImage: 'linear-gradient(to right, black 0%, black 65%, transparent 100%)', maskImage: 'linear-gradient(to right, black 0%, black 65%, transparent 100%)' }} />
                <div className="carousel-edge-blur" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 90, zIndex: 2, pointerEvents: 'none', WebkitMaskImage: 'linear-gradient(to left, black 0%, black 65%, transparent 100%)', maskImage: 'linear-gradient(to left, black 0%, black 65%, transparent 100%)' }} />
                <div className="carousel-edge-fade" style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 90, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(to right, var(--c-bg) 0%, var(--c-bg) 25%, transparent 100%)' }} />
                <div className="carousel-edge-fade" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 90, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(to left, var(--c-bg) 0%, var(--c-bg) 25%, transparent 100%)' }} />
                <DragCarousel speed={0.4} style={{ marginLeft: -4, marginRight: -4 }}>
                  {tripled.map((cat, i) => {
                    const isActive = activeSection === cat.id;
                    return (
                      <div key={`${cat.id}-${i}`} style={{ padding: '2px 4px', flexShrink: 0 }}>
                        <button
                          onClick={() => {
                            if (cat.id === '') window.scrollTo({ top: (headerRef.current?.getBoundingClientRect().bottom ?? 0) + window.scrollY + 24, behavior: 'smooth' });
                            else scrollToCategory(cat.id);
                          }}
                          className="cat-nav-btn"
                          data-active={isActive ? 'true' : undefined}
                        >
                          {cat.image
                            ? <img src={cat.image} alt="" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                            : <span style={{ fontSize: 18, lineHeight: 1 }}>{cat.icon}</span>}
                          <span className="cat-nav-label">{cat.name}</span>
                        </button>
                      </div>
                    );
                  })}
                </DragCarousel>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Content */}
      <div className="wrap" style={{ paddingTop: 28, paddingBottom: 80 }}>
        {grouped.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🍽️</div>
            <p className="t-display" style={{ fontSize: '1.4rem', color: 'var(--c-text)', marginBottom: 12 }}>
              {t('menu.not_found')}
            </p>
            <button className="btn btn-outline btn-md" onClick={() => { setSearch(''); setTag(''); }}>
              {t('common.retry')}
            </button>
          </motion.div>
        ) : (
          grouped.map(({ cat, dishes: catDishes }) => (
            <div
              key={cat.id}
              ref={el => { sectionRefs.current[cat.id] = el; }}
              data-cat-id={cat.id}
              style={{ marginBottom: 48 }}
            >
              {/* Category heading */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--r-sm)',
                  background: 'var(--c-bg-1)', border: '1px solid var(--c-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0, overflow: 'hidden',
                }}>
                  {cat.image
                    ? <img src={cat.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (cat.icon || '🍽️')}
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--c-text)', lineHeight: 1.2 }}>
                    {getCatName(cat, language)}
                  </h2>
                  <p style={{ fontSize: 11, color: 'var(--c-text-3)', marginTop: 2 }}>
                    {catDishes.length} {language === 'ru' ? 'блюд' : 'dishes'}
                  </p>
                </div>
                <div style={{ flex: 1, height: 1, background: 'var(--c-border)', marginLeft: 8 }} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${cat.id}-${tag}-${search}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="dishes-grid-2"
                >
                  {catDishes.map((dish, i) => (
                    <motion.div
                      key={dish.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.3) }}
                      style={{ height: '100%' }}
                    >
                      <DishCard dish={dish} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      <style>{`
        .cat-nav-btn {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 8px 6px;
          background: var(--c-bg-1);
          border: 1px solid var(--c-border);
          border-radius: var(--r-md);
          cursor: pointer;
          transition: all var(--t-fast);
          width: 72px;
          height: 64px;
        }
        .cat-nav-btn:hover {
          border-color: var(--c-gold-line);
          background: var(--c-bg-2);
        }
        .cat-nav-btn[data-active] {
          border-color: var(--c-gold);
          background: var(--c-gold-glow);
          box-shadow: 0 2px 12px rgba(184,136,75,0.18);
        }
        .cat-nav-label {
          font-size: 9px;
          font-weight: 600;
          color: var(--c-text-3);
          text-align: center;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: color var(--t-fast);
        }
        .cat-nav-btn[data-active] .cat-nav-label {
          color: var(--c-gold);
        }
        .carousel-edge-blur, .carousel-edge-fade { display: none; }
        @media (min-width: 1024px) {
          .carousel-edge-blur { display: block; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
          .carousel-edge-fade { display: block; }
        }
      `}</style>
    </div>
  );
}
