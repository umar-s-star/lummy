import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AboutSection, AdvantagesSection } from '../components/sections/HomeSections';

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero banner with background photo — bleeds behind the transparent header, like Menu/Branches */}
      <div style={{
        padding: 'calc(var(--nav-h) + clamp(48px,8vw,80px)) 0 clamp(48px,8vw,80px)',
        position: 'relative', overflow: 'hidden',
      }}>
        <img
          src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1400&q=85&fit=crop"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,16,11,0.88) 0%, rgba(8,16,11,0.65) 100%)' }} />
        <div className="wrap wrap-sm" style={{ textAlign: 'center', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 14 }}>
              <span className="line" style={{ background: 'rgba(184,136,75,0.4)' }} />
              <span className="t-label" style={{ color: 'var(--c-gold)' }}>{t('nav.about')}</span>
              <span className="line" style={{ background: 'rgba(184,136,75,0.4)' }} />
            </div>
            <h1 className="t-display t-h1" style={{ color: '#fff', marginBottom: 12 }}>{t('about.title')}</h1>
            <p style={{ fontFamily: 'var(--f-accent)', fontSize: '1.3rem', fontStyle: 'italic', color: 'var(--c-gold)' }}>{t('about.subtitle')}</p>
          </motion.div>
        </div>
      </div>
      <AboutSection hideHeader />
      <AdvantagesSection />
    </div>
  );
}
