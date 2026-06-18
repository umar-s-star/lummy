import { useTranslation } from 'react-i18next';
import { Phone, MapPin, Mail, Clock } from 'lucide-react';

const S: React.CSSProperties = { color: 'var(--c-gold)', flexShrink: 0 };

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer style={{ background: 'var(--c-bg-1)', borderTop: '1px solid var(--c-border)' }}>
      <div className="wrap footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <img src="/logo.png" alt="Lummy" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <div>
              <div className="logo-wordmark" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--c-text)' }}>Lummy</div>
              <div style={{ fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--c-gold)', marginTop: 1 }}>Restaurant & Desserts</div>
            </div>
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--c-text-3)', marginBottom: 14, maxWidth: 240 }}>
            {t('footer.tagline')}
          </p>
          <div style={{ display: 'flex', gap: 7 }}>
            {[
              { href: 'https://instagram.com', title: 'Instagram', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.01" fill="currentColor" strokeWidth="2"/></svg> },
              { href: 'https://t.me', title: 'Telegram', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 5L2 12.5l7 1M21 5l-2.5 15L9 13.5M21 5L9 13.5m0 0v5l3.5-3"/></svg> },
            ].map(s => (
              <a key={s.href} href={s.href} target="_blank" rel="noreferrer" title={s.title}
                style={{ width: 30, height: 30, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--c-bg-2)', border: '1px solid var(--c-border)', color: 'var(--c-text-3)', transition: 'all var(--t-fast)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-gold)'; e.currentTarget.style.color = 'var(--c-gold)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.color = 'var(--c-text-3)'; }}>
                {s.svg}
              </a>
            ))}
          </div>
        </div>

        {/* Contacts */}
        <div className="footer-col">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--c-gold)', marginBottom: 14 }}>{t('nav.contacts')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: <MapPin size={12} />, text: 'Seoul Mun, Ташкент' },
              { icon: <Phone size={12} />, text: '+998 94 818 68 68', href: 'tel:+998948186868' },
              { icon: <Mail size={12} />, text: 'hello@lummy.uz', href: 'mailto:hello@lummy.uz' },
              { icon: <Clock size={12} />, text: '09:00 – 23:00' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ ...S, marginTop: 1 }}>{item.icon}</span>
                {item.href
                  ? <a href={item.href} style={{ fontSize: 12, color: 'var(--c-text-3)', transition: 'color var(--t-fast)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-gold)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-text-3)')}>
                      {item.text}
                    </a>
                  : <span style={{ fontSize: 12, color: 'var(--c-text-3)' }}>{item.text}</span>
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <p style={{ fontSize: 11, color: 'var(--c-text-3)' }}>
          © {new Date().getFullYear()} Lummy Restaurant & Desserts. {t('footer.rights')}.
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          {[t('footer.privacy'), t('footer.terms')].map(label => (
            <a key={label} href="#" style={{ fontSize: 11, color: 'var(--c-text-3)', transition: 'color var(--t-fast)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-text-3)')}>
              {label}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .footer-inner {
          padding-top: 36px; padding-bottom: 28px;
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 40px;
        }
        .footer-bottom {
          padding-top: 14px; padding-bottom: 20px;
          border-top: 1px solid var(--c-border);
          display: flex; flex-wrap: wrap;
          align-items: center; justify-content: space-between; gap: 8px;
        }
        @media (max-width: 640px) {
          .footer-inner {
            grid-template-columns: 1fr;
            gap: 20px; padding-top: 22px; padding-bottom: 16px;
          }
          .footer-brand { grid-column: 1 / -1; }
        }
      `}</style>
    </footer>
  );
}
