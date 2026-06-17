import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Star, Tag } from 'lucide-react';
import type { Dish } from '../../types';
import { useLangStore } from '../../store';
import { formatPrice, getDishName } from '../../utils';
import DishModal from './DishModal';

export default function DishCard({ dish }: { dish: Dish }) {
  const { t } = useTranslation();
  const { language } = useLangStore();
  const [modalOpen, setModalOpen] = useState(false);
  const name = getDishName(dish, language);
  const isOnSale = !!(dish.oldPrice && dish.oldPrice > dish.price);
  const discountPct = isOnSale ? Math.round((1 - dish.price / dish.oldPrice!) * 100) : 0;

  return (
    <>
      <motion.article
        onClick={() => setModalOpen(true)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          background: 'var(--c-bg-1)',
          border: '1px solid var(--c-border)',
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'border-color var(--t-base), box-shadow var(--t-base)',
        }}
        onHoverStart={e => {
          const card = (e.target as HTMLElement).closest('article') as HTMLElement;
          if (card) { card.style.borderColor = 'var(--c-border-2)'; card.style.boxShadow = 'var(--sh-gold)'; }
        }}
        onHoverEnd={e => {
          const card = (e.target as HTMLElement).closest('article') as HTMLElement;
          if (card) { card.style.borderColor = 'var(--c-border)'; card.style.boxShadow = 'none'; }
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', flexShrink: 0, aspectRatio: '4/3' }}>
          <motion.img
            src={dish.image} alt={name}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="lazy"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)' }} />

          {/* Badges */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {dish.isBestseller && <span className="badge badge-gold">{t('menu.bestseller')}</span>}
            {dish.isNew && <span className="badge badge-green">{t('menu.new')}</span>}
            {isOnSale && (
              <span className="badge badge-red" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Tag size={8} /> -{discountPct}%
              </span>
            )}
          </div>

          {!dish.inStock && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{t('menu.out_of_stock')}</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            {dish.rating && (
              <>
                <Star size={11} fill="var(--c-gold)" color="var(--c-gold)" />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--c-gold)' }}>{dish.rating}</span>
                {dish.reviewCount && (
                  <span style={{ fontSize: 10, color: 'var(--c-text-3)' }}>({dish.reviewCount})</span>
                )}
              </>
            )}
            {dish.weight && (
              <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--c-text-3)' }}>
                {dish.weight} {t('menu.weight')}
              </span>
            )}
          </div>

          <h3 style={{
            fontFamily: 'var(--f-display)',
            fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.3,
            color: 'var(--c-text)', marginBottom: 6,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {name}
          </h3>

          {/* Price + button */}
          <div style={{ marginTop: 'auto', paddingTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: isOnSale ? '#E05252' : 'var(--c-gold)' }}>
                {formatPrice(dish.price)}
              </span>
              <span style={{ fontSize: 10, color: 'var(--c-text-3)' }}>{t('common.currency')}</span>
              {isOnSale && (
                <span style={{ fontSize: 11, color: 'var(--c-text-3)', textDecoration: 'line-through' }}>
                  {formatPrice(dish.oldPrice!)}
                </span>
              )}
            </div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--c-gold)', padding: '4px 10px', borderRadius: 'var(--r-pill)',
              border: '1px solid var(--c-gold-line)', background: 'var(--c-gold-glow)',
              transition: 'all var(--t-fast)', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              Подробнее
            </div>
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {modalOpen && <DishModal dish={dish} onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
