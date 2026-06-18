import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Star, Award, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import DishCard from '../components/menu/DishCard';
import { DISHES } from '../lib/mockData';
import { useLangStore } from '../store';
import { formatPrice, getDishName, getDishDesc } from '../utils';

export default function DishPage() {
  const { id } = useParams<{ id: string }>();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [id]);
  const { t } = useTranslation();
  const { language } = useLangStore();
  const navigate = useNavigate();
  const dish = DISHES.find(d => d.id === id);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<'info' | 'nutrition'>('info');

  if (!dish) return (
    <div className="page-top" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p className="t-display" style={{ fontSize: '1.5rem', color: 'var(--c-text)' }}>Блюдо не найдено</p>
      <Link to="/menu" className="btn btn-gold btn-md">← {t('nav.menu')}</Link>
    </div>
  );

  const images = [dish.image, ...(dish.gallery?.filter(g => g !== dish.image) ?? [])];
  const similar = DISHES.filter(d => d.categoryId === dish.categoryId && d.id !== dish.id).slice(0, 4);
  const name = getDishName(dish, language);
  const desc = getDishDesc(dish, language);

  const TABS = [
    { k: 'info' as const, l: t('menu.composition') },
    { k: 'nutrition' as const, l: t('menu.nutrition') },
  ];

  return (
    <div className="page-top" style={{ minHeight: '100vh' }}>
      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 80 }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          <button onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--c-text-3)', transition: 'color var(--t-fast)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-text-3)')}>
            <ArrowLeft size={14} /> {t('common.back')}
          </button>
          <span style={{ color: 'var(--c-border-2)' }}>/</span>
          <Link to="/menu" style={{ fontSize: 13, color: 'var(--c-text-3)', transition: 'color var(--t-fast)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-text-3)')}>
            {t('nav.menu')}
          </Link>
          <span style={{ color: 'var(--c-border-2)' }}>/</span>
          <span style={{ fontSize: 13, color: 'var(--c-text)' }}>{name}</span>
        </nav>

        {/* Main grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(24px, 5vw, 64px)',
          marginBottom: 64,
        }}>
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 'var(--r-xl)', overflow: 'hidden', background: 'var(--c-bg-1)', marginBottom: 12 }}>
              <AnimatePresence mode="wait">
                <motion.img key={activeImg} src={images[activeImg]} alt={name}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </AnimatePresence>

              {/* Badges */}
              <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 7 }}>
                {dish.isBestseller && <span className="badge badge-gold">{t('menu.bestseller')}</span>}
                {dish.isNew && <span className="badge badge-green">{t('menu.new')}</span>}
              </div>

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  {[
                    { side: 'left', fn: () => setActiveImg(a => (a - 1 + images.length) % images.length), icon: <ChevronLeft size={18} /> },
                    { side: 'right', fn: () => setActiveImg(a => (a + 1) % images.length), icon: <ChevronRight size={18} /> },
                  ].map(btn => (
                    <button key={btn.side} onClick={btn.fn}
                      style={{
                        position: 'absolute', top: '50%', [btn.side]: 12,
                        transform: 'translateY(-50%)',
                        width: 38, height: 38, borderRadius: '50%',
                        background: 'rgba(12,24,18,0.6)', backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', border: '1px solid rgba(255,255,255,0.15)',
                        cursor: 'pointer', transition: 'background var(--t-fast)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(184,136,75,0.8)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(12,24,18,0.6)')}
                    >
                      {btn.icon}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    style={{
                      width: 64, height: 64, borderRadius: 'var(--r-sm)', overflow: 'hidden',
                      flexShrink: 0, border: `2px solid ${activeImg === i ? 'var(--c-gold)' : 'transparent'}`,
                      transition: 'border-color var(--t-fast)', cursor: 'pointer', padding: 0,
                    }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            {dish.isSignature && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                <Award size={13} style={{ color: 'var(--c-gold)' }} />
                <span className="t-label" style={{ color: 'var(--c-gold)' }}>{t('menu.signature')}</span>
              </div>
            )}

            <h1 className="t-display" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.6rem)', color: 'var(--c-text)', lineHeight: 1.12, marginBottom: 18 }}>
              {name}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
              {dish.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Star size={15} fill="var(--c-gold)" color="var(--c-gold)" />
                  <span style={{ fontWeight: 700, color: 'var(--c-gold)' }}>{dish.rating}</span>
                  <span style={{ fontSize: 12, color: 'var(--c-text-3)' }}>({dish.reviewCount})</span>
                </div>
              )}
              {dish.weight && (
                <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 'var(--r-pill)', background: 'var(--c-bg-2)', color: 'var(--c-text-3)' }}>
                  {dish.weight} {t('menu.weight')}
                </span>
              )}
              {dish.calories && (
                <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 'var(--r-pill)', background: 'var(--c-bg-2)', color: 'var(--c-text-3)' }}>
                  {dish.calories} {t('menu.calories')}
                </span>
              )}
            </div>

            <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--c-text-2)', marginBottom: 28 }}>{desc}</p>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 32 }}>
              <span className="t-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--c-gold)', lineHeight: 1 }}>
                {formatPrice(dish.price)}
              </span>
              <span style={{ fontSize: 16, color: 'var(--c-text-3)' }}>{t('common.currency')}</span>
              {dish.oldPrice && (
                <span style={{ fontSize: 18, color: 'var(--c-text-3)', textDecoration: 'line-through' }}>
                  {formatPrice(dish.oldPrice)}
                </span>
              )}
            </div>

            {/* CTA */}
            {/* Contact info */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 20px',
              background: 'var(--c-bg-2)', borderRadius: 'var(--r-md)',
              border: '1px solid var(--c-border)',
              maxWidth: 360,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--c-gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={16} style={{ color: 'var(--c-gold)' }} />
              </div>
              <div>
                <p style={{ fontSize: 11, color: 'var(--c-text-3)', marginBottom: 2 }}>Контакт</p>
                <a href="tel:+998948186868" style={{ fontSize: 15, fontWeight: 600, color: 'var(--c-text)', textDecoration: 'none' }}>
                  +998 94 818 68 68
                </a>
              </div>
            </div>
            {!dish.inStock && (
              <p style={{ marginTop: 10, fontSize: 13, color: 'var(--c-error)' }}>{t('menu.out_of_stock')}</p>
            )}
          </motion.div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--c-border)', marginBottom: 28 }}>
            {TABS.map(t_ => (
              <button key={t_.k} onClick={() => setTab(t_.k)}
                style={{
                  padding: '12px 24px', fontSize: 13, fontWeight: 600,
                  color: tab === t_.k ? 'var(--c-gold)' : 'var(--c-text-3)',
                  borderBottom: `2px solid ${tab === t_.k ? 'var(--c-gold)' : 'transparent'}`,
                  marginBottom: -1, transition: 'all var(--t-fast)', cursor: 'pointer',
                }}>
                {t_.l}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {tab === 'info' && (
                <div style={{ background: 'var(--c-bg-1)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-lg)', padding: '24px 28px' }}>
                  {dish.allergens?.length ? (
                    <div style={{ marginBottom: 18 }}>
                      <p className="t-label" style={{ marginBottom: 10 }}>{t('menu.allergens')}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                        {dish.allergens.map(a => (
                          <span key={a} className="badge" style={{ background: 'rgba(224,82,82,0.1)', color: 'var(--c-error)' }}>{a}</span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--c-text-2)' }}>{desc}</p>
                </div>
              )}
              {tab === 'nutrition' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                  {[
                    { l: t('menu.calories'), v: dish.calories, u: 'ккал' },
                    { l: t('menu.proteins'), v: dish.proteins, u: 'г' },
                    { l: t('menu.fats'),    v: dish.fats,     u: 'г' },
                    { l: t('menu.carbs'),   v: dish.carbs,    u: 'г' },
                  ].map(item => (
                    <div key={item.l} style={{
                      background: 'var(--c-bg-1)', border: '1px solid var(--c-border)',
                      borderRadius: 'var(--r-lg)', padding: '22px 16px', textAlign: 'center',
                    }}>
                      <p className="t-display gold-text" style={{ fontSize: '1.9rem', fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>
                        {item.v ?? '—'}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--c-text-3)', marginBottom: 6 }}>{item.u}</p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-text-2)' }}>{item.l}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div>
            <h2 className="t-display" style={{ fontSize: '1.8rem', color: 'var(--c-text)', marginBottom: 28 }}>
              {t('menu.similar')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18 }}>
              {similar.map(d => <DishCard key={d.id} dish={d} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
