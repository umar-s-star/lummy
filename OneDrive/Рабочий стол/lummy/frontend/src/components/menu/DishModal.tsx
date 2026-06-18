import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Star, Tag, Trophy, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLangStore } from '../../store';
import { formatPrice, getDishName, getDishDesc } from '../../utils';
import type { Dish } from '../../types';

export default function DishModal({ dish, onClose }: { dish: Dish; onClose: () => void }) {
  const { t } = useTranslation();
  const { language } = useLangStore();
  const name = getDishName(dish, language);
  const desc = getDishDesc(dish, language);
  const isOnSale = !!(dish.oldPrice && dish.oldPrice > dish.price);
  const discountPct = isOnSale ? Math.round((1 - dish.price / dish.oldPrice!) * 100) : 0;

  const photos = [dish.image, ...(dish.gallery || [])].filter(Boolean);
  const [photoIdx, setPhotoIdx] = useState(0);

  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 200], [1, 0.4]);
  const scale = useTransform(y, [0, 200], [1, 0.95]);

  const dragStartY = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', fn);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const nextPhoto = () => setPhotoIdx(i => (i + 1) % photos.length);
  const prevPhoto = () => setPhotoIdx(i => (i - 1 + photos.length) % photos.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <motion.div
        style={{ y, opacity, scale }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragStart={(_, info) => { dragStartY.current = info.point.y; }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 500) onClose();
          else y.set(0);
        }}
        onClick={e => e.stopPropagation()}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 35, mass: 0.85 }}
        style={{
          y,
          background: 'var(--c-bg-1)',
          borderTop: '1px solid var(--c-border)',
          borderRadius: '24px 24px 0 0',
          overflow: 'hidden',
          width: '100%',
          maxWidth: 520,
          maxHeight: '92dvh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 6, flexShrink: 0 }}>
          <div style={{ width: 44, height: 4, borderRadius: 4, background: 'var(--c-border-2)' }} />
        </div>

        {/* Scrollable content */}
        <div ref={bodyRef} style={{ overflowY: 'auto', flex: 1, scrollbarWidth: 'none' }}>
          {/* Photo gallery */}
          <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--c-bg-2)' }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={photoIdx}
                src={photos[photoIdx]}
                alt={name}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.28 }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </AnimatePresence>

            {/* Gradient */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />

            {/* Badges */}
            <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {dish.isBestseller && (
                <span className="badge badge-gold" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Trophy size={8} /> {t('menu.bestseller')}
                </span>
              )}
              {dish.isNew && (
                <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Sparkles size={8} /> {t('menu.new')}
                </span>
              )}
              {isOnSale && (
                <span className="badge badge-red" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Tag size={8} /> -{discountPct}%
                </span>
              )}
            </div>

            {/* Photo navigation — only if multiple photos */}
            {photos.length > 1 && (
              <>
                <button onClick={prevPhoto} style={{
                  position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', cursor: 'pointer',
                }}>
                  <ChevronLeft size={16} />
                </button>
                <button onClick={nextPhoto} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', cursor: 'pointer',
                }}>
                  <ChevronRight size={16} />
                </button>

                {/* Dots */}
                <div style={{
                  position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
                  display: 'flex', gap: 5,
                }}>
                  {photos.map((_, i) => (
                    <button key={i} onClick={() => setPhotoIdx(i)} style={{
                      width: i === photoIdx ? 18 : 6, height: 6,
                      borderRadius: 3, border: 'none', cursor: 'pointer',
                      background: i === photoIdx ? 'var(--c-gold)' : 'rgba(255,255,255,0.45)',
                      transition: 'width 0.25s, background 0.25s',
                    }} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: '18px 20px 32px' }}>
            {/* Rating */}
            {dish.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={13}
                    fill={s <= Math.round(dish.rating!) ? 'var(--c-gold)' : 'transparent'}
                    color="var(--c-gold)" />
                ))}
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-gold)', marginLeft: 2 }}>{dish.rating}</span>
                {dish.reviewCount && <span style={{ fontSize: 11, color: 'var(--c-text-3)' }}>({dish.reviewCount})</span>}
              </div>
            )}

            <h2 style={{
              fontFamily: 'var(--f-display)', fontSize: '1.4rem', fontWeight: 600,
              color: 'var(--c-text)', lineHeight: 1.25, marginBottom: 10,
            }}>
              {name}
            </h2>

            {desc && (
              <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--c-text-3)', marginBottom: 18 }}>
                {desc}
              </p>
            )}

            {/* Nutrition */}
            {(dish.weight || dish.calories || dish.proteins || dish.fats || dish.carbs) && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
                gap: 8, marginBottom: 20,
              }}>
                {[
                  { v: dish.weight,   u: t('menu.weight') },
                  { v: dish.calories, u: 'ккал' },
                  { v: dish.proteins, u: 'белки' },
                  { v: dish.fats,     u: 'жиры' },
                  { v: dish.carbs,    u: 'углев.' },
                ].filter(x => x.v).map((x, i) => (
                  <div key={i} style={{
                    padding: '8px 6px', background: 'var(--c-bg-2)',
                    borderRadius: 'var(--r-sm)', border: '1px solid var(--c-border)',
                    textAlign: 'center',
                  }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-text)', lineHeight: 1 }}>{x.v}</p>
                    <p style={{ fontSize: 9, color: 'var(--c-text-3)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{x.u}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Price */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              padding: '16px 18px', background: 'var(--c-bg-2)',
              borderRadius: 'var(--r-lg)', border: '1px solid var(--c-border)',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '1.6rem', fontWeight: 800, lineHeight: 1,
                    color: isOnSale ? '#E05252' : 'var(--c-gold)',
                    fontFamily: 'var(--f-display)',
                  }}>
                    {formatPrice(dish.price)}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--c-text-3)' }}>{t('common.currency')}</span>
                </div>
                {isOnSale && dish.oldPrice && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--c-text-3)', textDecoration: 'line-through' }}>
                      {formatPrice(dish.oldPrice)}
                    </span>
                    <span style={{ fontSize: 11, color: '#E05252', fontWeight: 700 }}>
                      −{formatPrice(dish.oldPrice - dish.price)} сум
                    </span>
                  </div>
                )}
              </div>

              {/* Swipe-down hint */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: 0.5 }}>
                <motion.div animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid var(--c-border-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '5px solid var(--c-text-3)' }} />
                  </div>
                </motion.div>
                <span style={{ fontSize: 8, color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>закрыть</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
