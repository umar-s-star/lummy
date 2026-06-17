import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Tag, UtensilsCrossed,
  MapPin, Settings, Plus, Edit2, Trash2,
  Eye, EyeOff, Search, X, Check, AlertTriangle,
  ChevronLeft, ChevronRight, ToggleLeft, ToggleRight,
  BarChart2, ArrowUp, Phone, Clock, Star,
  ShieldCheck, LogOut, RefreshCw, ImageIcon, Ticket
} from 'lucide-react';
import { useDataStore } from '../store';
import { CATEGORIES as C0 } from '../lib/mockData';
import { formatPrice, sleep } from '../utils';
import type { Dish, Category, Branch, Promo } from '../types';
import toast from 'react-hot-toast';

/* ══════════════════════════════════════════════════════
   MODAL PRIMITIVES
══════════════════════════════════════════════════════ */
function Modal({ open, title, onClose, children, width = 540 }: {
  open: boolean; title: string; onClose: () => void;
  children: React.ReactNode; width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, overflowY: 'auto',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: width,
              background: 'var(--c-bg-1)', border: '1px solid var(--c-border)',
              borderRadius: 'var(--r-xl)', overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7)', margin: 'auto',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 22px', borderBottom: '1px solid var(--c-border)',
              background: 'var(--c-bg-2)',
            }}>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--c-text)' }}>{title}</h2>
              <button onClick={onClose}
                style={{ display: 'flex', padding: 6, borderRadius: 'var(--r-sm)', color: 'var(--c-text-3)', transition: 'all var(--t-fast)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-bg-3)'; e.currentTarget.style.color = 'var(--c-text)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--c-text-3)'; }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '22px' }}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ConfirmModal({ open, title, msg, onConfirm, onCancel }: {
  open: boolean; title: string; msg: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            style={{ width: '100%', maxWidth: 360, background: 'var(--c-bg-1)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-xl)', padding: '28px 24px', textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', background: 'rgba(224,82,82,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <AlertTriangle size={22} color="var(--c-error)" />
            </div>
            <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--c-text)', marginBottom: 8 }}>{title}</h3>
            <p style={{ fontSize: 13, color: 'var(--c-text-3)', marginBottom: 24, lineHeight: 1.6 }}>{msg}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onCancel} className="btn btn-ghost btn-md" style={{ flex: 1 }}>Отмена</button>
              <button onClick={onConfirm} className="btn btn-md" style={{ flex: 1, background: 'var(--c-error)', color: '#fff', border: 'none' }}>Удалить</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label className="field-label">{label}{required && <span style={{ color: 'var(--c-gold)', marginLeft: 2 }}>*</span>}</label>
      {children}
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px',
      background: 'var(--c-bg-2)', border: '1px solid var(--c-border)',
      borderRadius: 'var(--r-pill)', height: 40,
    }}
      onFocusCapture={e => (e.currentTarget.style.borderColor = 'var(--c-gold)')}
      onBlurCapture={e => (e.currentTarget.style.borderColor = 'var(--c-border)')}
    >
      <Search size={14} style={{ color: 'var(--c-text-3)', flexShrink: 0 }} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? 'Поиск...'}
        style={{ flex: 1, background: 'transparent', outline: 'none', fontSize: 13, color: 'var(--c-text)', border: 'none' }} />
      {value && <button onClick={() => onChange('')} style={{ color: 'var(--c-text-3)', display: 'flex', flexShrink: 0 }}><X size={13} /></button>}
    </div>
  );
}

function Spin() {
  return <div style={{ width: 16, height: 16, border: '2px solid transparent', borderTopColor: 'currentColor', borderRadius: '50%' }} className="spin" />;
}

function Empty({ icon, text, action }: { icon: string; text: string; action?: React.ReactNode }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px' }}>
      <div style={{ fontSize: 44, marginBottom: 14, opacity: 0.35 }}>{icon}</div>
      <p style={{ fontSize: 14, color: 'var(--c-text-3)', marginBottom: action ? 18 : 0 }}>{text}</p>
      {action}
    </div>
  );
}

function Pagination({ page, total, per, set }: { page: number; total: number; per: number; set: (p: number) => void }) {
  const pages = Math.ceil(total / per);
  if (pages <= 1) return null;
  const from = (page - 1) * per + 1;
  const to = Math.min(page * per, total);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 10 }}>
      <span style={{ fontSize: 12, color: 'var(--c-text-3)' }}>{from}–{to} из {total}</span>
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={() => set(page - 1)} disabled={page === 1}
          style={{ width: 32, height: 32, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--c-bg-2)', border: '1px solid var(--c-border)', color: 'var(--c-text-3)', cursor: 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => set(p)}
            style={{ width: 32, height: 32, borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all var(--t-fast)', background: p === page ? 'var(--c-gold)' : 'var(--c-bg-2)', color: p === page ? '#13200F' : 'var(--c-text-3)', border: `1px solid ${p === page ? 'var(--c-gold)' : 'var(--c-border)'}` }}>
            {p}
          </button>
        ))}
        <button onClick={() => set(page + 1)} disabled={page === pages}
          style={{ width: 32, height: 32, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--c-bg-2)', border: '1px solid var(--c-border)', color: 'var(--c-text-3)', cursor: 'pointer', opacity: page === pages ? 0.4 : 1 }}>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

function SH({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.3rem,3vw,1.8rem)', fontWeight: 600, color: 'var(--c-text)', lineHeight: 1.15 }}>{title}</h1>
        {sub && <p style={{ fontSize: 12, color: 'var(--c-text-3)', marginTop: 3 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function TableCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--c-bg-1)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   IMAGE COMPRESSION — always downscale/re-encode large photos
   so admin uploads never bloat storage with full-res originals.
══════════════════════════════════════════════════════ */
function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(reader.result as string); return; }
        ctx.drawImage(img, 0, 0, width, height);
        const isPng = file.type === 'image/png';
        resolve(canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function ImageUpload({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Выберите изображение'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Файл слишком большой (макс 5 МБ)'); return; }
    try {
      onChange(await compressImage(file));
    } catch {
      toast.error('Не удалось обработать изображение');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Preview */}
      {value && (
        <div style={{ position: 'relative', width: '100%', height: 140, borderRadius: 'var(--r-md)', overflow: 'hidden', border: '1px solid var(--c-border)' }}>
          <img src={value} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button
            onClick={() => onChange('')}
            style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Upload area */}
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          border: '2px dashed var(--c-border)', borderRadius: 'var(--r-md)',
          padding: '16px 12px', textAlign: 'center', cursor: 'pointer',
          transition: 'border-color var(--t-fast), background var(--t-fast)',
          background: 'var(--c-bg-2)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-gold-line)'; e.currentTarget.style.background = 'var(--c-bg-3)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.background = 'var(--c-bg-2)'; }}
      >
        <ImageIcon size={20} style={{ color: 'var(--c-text-3)', marginBottom: 6 }} />
        <p style={{ fontSize: 12, color: 'var(--c-text-3)' }}>Нажмите для загрузки фото</p>
        <p style={{ fontSize: 10, color: 'var(--c-text-3)', marginTop: 3 }}>PNG, JPG, WEBP — макс 5 МБ</p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />

      {/* Or URL */}
      <p style={{ fontSize: 11, color: 'var(--c-text-3)', textAlign: 'center' }}>или введите URL</p>
      <input
        className="field-input"
        value={value.startsWith('data:') ? '' : value}
        onChange={e => onChange(e.target.value)}
        placeholder="https://images.unsplash.com/..."
        style={{ fontSize: 12 }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   GALLERY UPLOAD (multiple images)
══════════════════════════════════════════════════════ */
function GalleryUpload({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    files.forEach(async file => {
      if (!file.type.startsWith('image/')) { toast.error('Выберите изображение'); return; }
      if (file.size > 5 * 1024 * 1024) { toast.error('Файл слишком большой (макс 5 МБ)'); return; }
      try {
        const compressed = await compressImage(file);
        onChange([...value, compressed]);
      } catch {
        toast.error('Не удалось обработать изображение');
      }
    });
    e.target.value = '';
  };

  const removeAt = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {value.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 8 }}>
          {value.map((src, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--r-sm)', overflow: 'hidden', border: '1px solid var(--c-border)' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                onClick={() => removeAt(i)}
                style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          border: '2px dashed var(--c-border)', borderRadius: 'var(--r-md)',
          padding: '12px', textAlign: 'center', cursor: 'pointer',
          transition: 'border-color var(--t-fast), background var(--t-fast)',
          background: 'var(--c-bg-2)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-gold-line)'; e.currentTarget.style.background = 'var(--c-bg-3)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.background = 'var(--c-bg-2)'; }}
      >
        <ImageIcon size={16} style={{ color: 'var(--c-text-3)', marginBottom: 4 }} />
        <p style={{ fontSize: 11, color: 'var(--c-text-3)' }}>Добавить фото в галерею</p>
        <p style={{ fontSize: 9, color: 'var(--c-text-3)', marginTop: 2 }}>PNG, JPG, WEBP — до 5 МБ каждое</p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════ */
function Dashboard() {
  const { dishes, categories, branches } = useDataStore();
  const stats = [
    { icon: <UtensilsCrossed size={20} />, label: 'Блюд в меню',  value: `${dishes.length}`,     delta: '', up: true },
    { icon: <MapPin size={20} />,          label: 'Филиалов',     value: `${branches.length}`,   delta: '', up: true },
    { icon: <BarChart2 size={20} />,       label: 'Категорий',    value: `${categories.length}`, delta: '', up: true },
    { icon: <Star size={20} />,            label: 'Акций',        value: `${dishes.filter(d=>d.oldPrice&&d.oldPrice>d.price).length}`, delta: '', up: true },
  ];
  return (
    <div>
      <SH title="Дашборд"
        sub={new Date().toLocaleDateString('ru-RU', { weekday:'long', day:'numeric', month:'long' })}
        action={<button className="btn btn-ghost btn-sm" style={{ gap:6 }}><RefreshCw size={13}/>Обновить</button>}
      />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12, marginBottom:28 }}>
        {stats.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
            style={{ background:'var(--c-bg-1)', border:'1px solid var(--c-border)', borderRadius:'var(--r-lg)', padding:'20px 18px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ width:40, height:40, borderRadius:'var(--r-sm)', background:'var(--c-gold-glow)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-gold)' }}>
                {s.icon}
              </div>
              {s.delta && (
                <span style={{ fontSize:11, fontWeight:700, display:'flex', alignItems:'center', gap:2, color:'#4CAF7D' }}>
                  <ArrowUp size={10}/>{s.delta}
                </span>
              )}
            </div>
            <p style={{ fontFamily:'var(--f-display)', fontSize:'1.5rem', fontWeight:700, color:'var(--c-text)', lineHeight:1, marginBottom:3 }}>{s.value}</p>
            <p style={{ fontSize:11, color:'var(--c-text-3)' }}>{s.label}</p>
          </motion.div>
        ))}
      </div>
      <div style={{ background:'var(--c-bg-1)', border:'1px solid var(--c-border)', borderRadius:'var(--r-lg)', padding:'22px' }}>
        <p style={{ fontSize:13, fontWeight:600, color:'var(--c-text)', marginBottom:14 }}>Быстрые действия</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {[
            { label:'Добавить блюдо', icon:<UtensilsCrossed size={13}/> },
            { label:'Новая категория', icon:<Tag size={13}/> },
            { label:'Настройки сайта', icon:<Settings size={13}/> },
          ].map(item => (
            <div key={item.label} className="btn btn-ghost btn-sm" style={{ gap:7, cursor:'pointer', userSelect:'none' }}>
              {item.icon} {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   CATEGORIES
══════════════════════════════════════════════════════ */
function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useDataStore();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ open: boolean; data: Partial<Category> }>({ open: false, data: {} });
  const [confirm, setConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [saving, setSaving] = useState(false);

  const filtered = categories.filter(c => c.nameRu.toLowerCase().includes(search.toLowerCase()));
  const isEdit = !!modal.data.id;

  const openAdd = () => setModal({ open: true, data: { nameRu: '', nameUz: '', nameUzCyrl: '', slug: '', icon: '', isActive: true, order: categories.length + 1 } });
  const openEdit = (c: Category) => setModal({ open: true, data: { ...c } });
  const upd = (k: keyof Category, v: unknown) => setModal(m => ({ ...m, data: { ...m.data, [k]: v } }));

  const save = async () => {
    if (!modal.data.nameRu?.trim()) { toast.error('Введите название'); return; }
    setSaving(true); await sleep(500);
    if (isEdit) {
      updateCategory({ ...modal.data } as Category);
      toast.success('Категория обновлена');
    } else {
      const nc: Category = {
        id: Date.now().toString(),
        nameRu: modal.data.nameRu!, nameUz: modal.data.nameUz || modal.data.nameRu!,
        nameUzCyrl: modal.data.nameUzCyrl || modal.data.nameRu!,
        slug: modal.data.nameRu!.toLowerCase().replace(/\s+/g,'-'),
        icon: modal.data.icon || '🍽️', image: modal.data.image, isActive: true, order: categories.length + 1,
      };
      addCategory(nc); toast.success('Категория добавлена');
    }
    setSaving(false); setModal({ open: false, data: {} });
  };

  return (
    <div>
      <SH title="Категории" sub={`${categories.length} категорий`}
        action={<button onClick={openAdd} className="btn btn-gold btn-sm"><Plus size={14} />Добавить</button>} />
      <div style={{ marginBottom: 14 }}><SearchBar value={search} onChange={setSearch} placeholder="Поиск категорий..." /></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? <Empty icon="📂" text="Категории не найдены" /> :
          filtered.map(c => (
            <motion.div key={c.id} layout
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                background: 'var(--c-bg-1)', border: '1px solid var(--c-border)',
                borderRadius: 'var(--r-md)', opacity: c.isActive ? 1 : 0.5,
              }}>
              {c.image
                ? <img src={c.image} alt="" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                : <span style={{ fontSize: '1.5rem', flexShrink: 0, width: 30, textAlign: 'center' }}>{c.icon}</span>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--c-text)' }}>{c.nameRu}</p>
                <p style={{ fontSize: 11, color: 'var(--c-text-3)' }}>{c.slug}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button onClick={() => { updateCategory({ ...c, isActive: !c.isActive }); toast.success('Обновлено'); }}
                  style={{ color: c.isActive ? 'var(--c-gold)' : 'var(--c-text-3)', display: 'flex', transition: 'color var(--t-fast)' }}>
                  {c.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                </button>
                <button onClick={() => openEdit(c)} className="btn btn-ghost btn-xs"><Edit2 size={12} /></button>
                <button onClick={() => setConfirm({ open: true, id: c.id })} className="btn btn-danger btn-xs"><Trash2 size={12} /></button>
              </div>
            </motion.div>
          ))
        }
      </div>

      <Modal open={modal.open} title={isEdit ? 'Редактировать' : 'Новая категория'} onClose={() => setModal({ open: false, data: {} })}>
        <Field label="Название (RU)" required><input className="field-input" value={modal.data.nameRu||''} onChange={e => upd('nameRu', e.target.value)} placeholder="Название..." /></Field>
        <Field label="Название (UZ Lotin)"><input className="field-input" value={modal.data.nameUz||''} onChange={e => upd('nameUz', e.target.value)} /></Field>
        <Field label="Название (UZ Кирилл)"><input className="field-input" value={modal.data.nameUzCyrl||''} onChange={e => upd('nameUzCyrl', e.target.value)} /></Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Эмодзи"><input className="field-input" value={modal.data.icon||''} onChange={e => upd('icon', e.target.value)} placeholder="🍰" /></Field>
          <Field label="Порядок"><input type="number" className="field-input" value={modal.data.order||1} onChange={e => upd('order', +e.target.value)} /></Field>
        </div>
        <Field label="Фото категории (вместо эмодзи)">
          <ImageUpload value={modal.data.image || ''} onChange={v => upd('image', v)} />
        </Field>
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button onClick={() => setModal({ open: false, data: {} })} className="btn btn-ghost btn-md" style={{ flex: 1 }}>Отмена</button>
          <button onClick={save} disabled={saving} className="btn btn-gold btn-md" style={{ flex: 1 }}>
            {saving ? <Spin /> : <><Check size={15} />Сохранить</>}
          </button>
        </div>
      </Modal>
      <ConfirmModal open={confirm.open} title="Удалить категорию?" msg="Это действие нельзя отменить." onConfirm={async () => { await sleep(300); deleteCategory(confirm.id); setConfirm({ open: false, id: '' }); toast.success('Удалено'); }} onCancel={() => setConfirm({ open: false, id: '' })} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   DISHES
══════════════════════════════════════════════════════ */
function Dishes() {
  const { dishes, categories, addDish, updateDish, deleteDish } = useDataStore();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{ open: boolean; data: Partial<Dish> & { isOnSale?: boolean } }>({ open: false, data: {} });
  const [confirm, setConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [saving, setSaving] = useState(false);
  const PER = 8;

  const filtered = dishes
    .filter(d => d.nameRu.toLowerCase().includes(search.toLowerCase()))
    .filter(d => catFilter ? d.categoryId === catFilter : true);
  const paged = filtered.slice((page - 1) * PER, page * PER);
  const isEdit = !!modal.data.id;

  const upd = useCallback((k: string, v: unknown) => setModal(m => ({ ...m, data: { ...m.data, [k]: v } })), []);

  const isOnSale = !!modal.data.isOnSale;
  const discount = (isOnSale && modal.data.oldPrice && modal.data.price && modal.data.oldPrice > modal.data.price)
    ? Math.round((1 - modal.data.price / modal.data.oldPrice) * 100)
    : 0;

  const save = async () => {
    if (!modal.data.nameRu?.trim()) { toast.error('Введите название'); return; }
    if (!modal.data.price || modal.data.price <= 0) { toast.error('Введите цену'); return; }
    setSaving(true); await sleep(600);
    const base: Partial<Dish> = {
      nameRu: modal.data.nameRu!, nameUz: modal.data.nameUz || modal.data.nameRu!, nameUzCyrl: modal.data.nameUzCyrl || modal.data.nameRu!,
      descriptionRu: modal.data.descriptionRu || '', descriptionUz: modal.data.descriptionUz || '', descriptionUzCyrl: modal.data.descriptionUzCyrl || '',
      price: modal.data.price, oldPrice: isOnSale ? modal.data.oldPrice : undefined,
      image: modal.data.image || 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80',
      gallery: modal.data.gallery || [],
      categoryId: modal.data.categoryId || (categories[0]?.id ?? C0[0].id),
      weight: modal.data.weight, inStock: true,
      isBestseller: modal.data.isBestseller, isNew: modal.data.isNew,
    };
    if (isEdit) {
      updateDish({ ...modal.data as Dish, ...base });
      toast.success('Блюдо обновлено');
    } else {
      addDish({ id: Date.now().toString(), ...base } as Dish);
      toast.success('Блюдо добавлено');
    }
    setSaving(false); setModal({ open: false, data: {} });
  };

  const openAdd = () => setModal({ open: true, data: { nameRu:'', price:0, categoryId: categories[0]?.id ?? C0[0].id, isOnSale: false } });
  const openEdit = (d: Dish) => setModal({ open: true, data: { ...d, isOnSale: !!(d.oldPrice && d.oldPrice > d.price) } });

  return (
    <div>
      <SH title="Блюда" sub={`${dishes.length} позиций`}
        action={<button onClick={openAdd} className="btn btn-gold btn-sm"><Plus size={14} />Добавить</button>} />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        <div style={{ flex: '1 1 200px' }}><SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Поиск блюд..." /></div>
        <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}
          className="field-input" style={{ flex: '0 0 auto', width: 'auto', minWidth: 160, height: 40, padding: '0 12px', borderRadius: 'var(--r-pill)' }}>
          <option value="">Все категории</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.nameRu}</option>)}
        </select>
      </div>

      <TableCard>
        {paged.length === 0
          ? <Empty icon="🍽️" text="Блюда не найдены" action={<button className="btn btn-gold btn-sm" onClick={openAdd}><Plus size={14}/>Добавить</button>} />
          : (
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead><tr>
                  <th>Блюдо</th>
                  <th>Цена</th>
                  <th className="hidden-sm">Категория</th>
                  <th className="hidden-md">Теги</th>
                  <th style={{ textAlign: 'right' }}>Действия</th>
                </tr></thead>
                <tbody>
                  {paged.map(d => {
                    const isOnSaleItem = !!(d.oldPrice && d.oldPrice > d.price);
                    const discPct = isOnSaleItem ? Math.round((1 - d.price / d.oldPrice!) * 100) : 0;
                    return (
                      <tr key={d.id} style={{ opacity: d.isHidden ? 0.45 : 1 }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                            <img src={d.image} alt={d.nameRu} style={{ width: 42, height: 42, borderRadius: 'var(--r-sm)', objectFit: 'cover', flexShrink: 0 }} />
                            <div>
                              <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--c-text)' }}>{d.nameRu}</p>
                              {d.rating && <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                                <Star size={9} fill="var(--c-gold)" color="var(--c-gold)" />
                                <span style={{ fontSize: 10, color: 'var(--c-gold)' }}>{d.rating}</span>
                              </div>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <p style={{ fontWeight: 700, fontSize: 13, color: isOnSaleItem ? '#E05252' : 'var(--c-gold)', whiteSpace: 'nowrap' }}>{formatPrice(d.price)} сум</p>
                          {isOnSaleItem && <p style={{ fontSize: 10, color: '#E05252' }}>-{discPct}%</p>}
                          {isOnSaleItem && <p style={{ fontSize: 10, color: 'var(--c-text-3)', textDecoration: 'line-through' }}>{formatPrice(d.oldPrice!)}</p>}
                        </td>
                        <td className="hidden-sm">
                          <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 'var(--r-pill)', background: 'var(--c-bg-2)', color: 'var(--c-text-3)', whiteSpace: 'nowrap' }}>
                            {categories.find(c => c.id === d.categoryId)?.nameRu}
                          </span>
                        </td>
                        <td className="hidden-md">
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'nowrap' }}>
                            {d.isBestseller && <span className="badge" style={{ background: 'rgba(184,136,75,0.15)', color: 'var(--c-gold)', fontSize: 9 }}>Хит</span>}
                            {d.isNew && <span className="badge badge-green" style={{ fontSize: 9 }}>New</span>}
                            {isOnSaleItem && <span className="badge badge-red" style={{ fontSize: 9 }}>Акция</span>}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                            <button onClick={() => { updateDish({ ...d, isHidden: !d.isHidden }); toast.success('Обновлено'); }} className="btn btn-ghost btn-xs" title={d.isHidden ? 'Показать' : 'Скрыть'}>
                              {d.isHidden ? <Eye size={12} /> : <EyeOff size={12} />}
                            </button>
                            <button onClick={() => openEdit(d)} className="btn btn-ghost btn-xs"><Edit2 size={12} /></button>
                            <button onClick={() => setConfirm({ open: true, id: d.id })} className="btn btn-danger btn-xs"><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        }
      </TableCard>
      <Pagination page={page} total={filtered.length} per={PER} set={setPage} />

      <Modal open={modal.open} title={isEdit ? 'Редактировать блюдо' : 'Новое блюдо'} onClose={() => setModal({ open: false, data: {} })} width={620}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 14px' }}>
          <Field label="Название (RU)" required><input className="field-input" value={modal.data.nameRu||''} onChange={e => upd('nameRu', e.target.value)} /></Field>
          <Field label="Название (UZ)"><input className="field-input" value={modal.data.nameUz||''} onChange={e => upd('nameUz', e.target.value)} /></Field>
        </div>
        <Field label="Описание (RU)"><textarea className="field-input" rows={2} value={modal.data.descriptionRu||''} onChange={e => upd('descriptionRu', e.target.value)} style={{ minHeight: 64 }} /></Field>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0 12px' }}>
          <Field label="Цена (сум)" required>
            <input type="number" className="field-input" value={modal.data.price||''} onChange={e => upd('price', +e.target.value)} />
          </Field>
          <Field label="Категория">
            <select className="field-input" value={modal.data.categoryId||''} onChange={e => upd('categoryId', e.target.value)}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nameRu}</option>)}
            </select>
          </Field>
          <Field label="Вес (г)">
            <input type="number" className="field-input" value={modal.data.weight||''} onChange={e => upd('weight', +e.target.value)} />
          </Field>
        </div>

        {/* Акция toggle */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: isOnSale ? 12 : 0 }}>
            <input type="checkbox" checked={isOnSale} onChange={e => { upd('isOnSale', e.target.checked); if (!e.target.checked) upd('oldPrice', undefined); }}
              style={{ accentColor: '#E05252', width: 15, height: 15 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: isOnSale ? '#E05252' : 'var(--c-text-2)' }}>Акция (скидка)</span>
          </label>

          {isOnSale && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Старая цена (до скидки)">
                  <input type="number" className="field-input" value={modal.data.oldPrice||''} onChange={e => upd('oldPrice', +e.target.value)} placeholder="Напр. 100000" />
                </Field>
                <Field label="Размер скидки">
                  <div style={{
                    height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: discount > 0 ? 'rgba(224,82,82,0.1)' : 'var(--c-bg-2)',
                    border: `1px solid ${discount > 0 ? 'rgba(224,82,82,0.3)' : 'var(--c-border)'}`,
                    borderRadius: 'var(--r-sm)',
                    fontSize: discount > 0 ? '1.2rem' : 13,
                    fontWeight: 800,
                    color: discount > 0 ? '#E05252' : 'var(--c-text-3)',
                  }}>
                    {discount > 0 ? `-${discount}%` : 'Введите цены'}
                  </div>
                </Field>
              </div>
            </motion.div>
          )}
        </div>

        {/* Photo upload */}
        <Field label="Главное фото (превью)">
          <ImageUpload value={modal.data.image||''} onChange={v => upd('image', v)} />
        </Field>

        {/* Gallery */}
        <Field label="Галерея (дополнительные фото)">
          <GalleryUpload value={modal.data.gallery||[]} onChange={v => upd('gallery', v)} />
        </Field>

        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px', marginBottom: 18, padding: '14px 16px', background: 'var(--c-bg-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--c-border)' }}>
          <p style={{ width: '100%', fontSize: 11, fontWeight: 700, color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Теги</p>
          {([['isBestseller','🏆 Хит'], ['isNew','✨ Новинка']] as [keyof Dish, string][]).map(([k, l]) => (
            <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
              <input type="checkbox" checked={!!(modal.data as Record<string, unknown>)[k]} onChange={e => upd(k, e.target.checked)}
                style={{ accentColor: 'var(--c-gold)', width: 15, height: 15 }} />
              <span style={{ fontSize: 13, color: 'var(--c-text-2)' }}>{l}</span>
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setModal({ open: false, data: {} })} className="btn btn-ghost btn-md" style={{ flex: 1 }}>Отмена</button>
          <button onClick={save} disabled={saving} className="btn btn-gold btn-md" style={{ flex: 1 }}>
            {saving ? <Spin /> : <><Check size={15} />Сохранить</>}
          </button>
        </div>
      </Modal>
      <ConfirmModal open={confirm.open} title="Удалить блюдо?" msg="Блюдо будет удалено из меню." onConfirm={async () => { await sleep(300); deleteDish(confirm.id); setConfirm({ open: false, id: '' }); toast.success('Удалено'); }} onCancel={() => setConfirm({ open: false, id: '' })} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   BRANCHES ADMIN
══════════════════════════════════════════════════════ */
function BranchesAdmin() {
  const { branches, addBranch, updateBranch, deleteBranch } = useDataStore();
  const [modal, setModal] = useState<{ open: boolean; data: Partial<Branch> }>({ open: false, data: {} });
  const [confirm, setConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [saving, setSaving] = useState(false);
  const isEdit = !!modal.data.id;
  const upd = (k: keyof Branch, v: unknown) => setModal(m => ({ ...m, data: { ...m.data, [k]: v } }));

  const save = async () => {
    if (!modal.data.name?.trim()) { toast.error('Введите название'); return; }
    setSaving(true); await sleep(500);
    if (isEdit) { updateBranch(modal.data as Branch); toast.success('Обновлено'); }
    else { addBranch({ id: Date.now().toString(), name: modal.data.name!, address: modal.data.address||'', phone: modal.data.phone||'', hours: modal.data.hours||'', lat: modal.data.lat||41.2995, lng: modal.data.lng||69.2401 }); toast.success('Добавлено'); }
    setSaving(false); setModal({ open: false, data: {} });
  };

  return (
    <div>
      <SH title="Филиалы" sub={`${branches.length} филиала`}
        action={<button onClick={() => setModal({ open: true, data: { name:'', address:'', phone:'', hours:'', lat:41.2995, lng:69.2401 } })} className="btn btn-gold btn-sm"><Plus size={14}/>Добавить</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {branches.map(b => (
          <motion.div key={b.id} layout style={{ background:'var(--c-bg-1)', border:'1px solid var(--c-border)', borderRadius:'var(--r-xl)', overflow:'hidden' }}>
            {b.image && <img src={b.image} alt={b.name} style={{ width:'100%', height:150, objectFit:'cover', display:'block' }}/>}
            <div style={{ padding:'18px 20px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:12 }}>
                <h3 style={{ fontFamily:'var(--f-display)', fontSize:'1rem', fontWeight:600, color:'var(--c-text)', lineHeight:1.2 }}>{b.name}</h3>
                {b.isMain && <span className="badge badge-gold">Главный</span>}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:14 }}>
                {([[<MapPin size={11}/>,b.address],[<Clock size={11}/>,b.hours],[<Phone size={11}/>,b.phone]] as [React.ReactNode, string][]).map(([icon, text], i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:7 }}>
                    <span style={{ color:'var(--c-gold)', flexShrink:0 }}>{icon}</span>
                    <span style={{ fontSize:12, color:'var(--c-text-3)' }}>{text}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => setModal({ open:true, data:{...b} })} className="btn btn-outline btn-sm" style={{ flex:1 }}><Edit2 size={12}/>Редактировать</button>
                <button onClick={() => setConfirm({ open:true, id:b.id })} className="btn btn-danger btn-xs" style={{ padding:'0 12px' }}><Trash2 size={12}/></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal open={modal.open} title={isEdit?'Редактировать':'Новый филиал'} onClose={() => setModal({ open:false, data:{} })}>
        <Field label="Название" required><input className="field-input" value={modal.data.name||''} onChange={e=>upd('name',e.target.value)}/></Field>
        <Field label="Адрес"><input className="field-input" value={modal.data.address||''} onChange={e=>upd('address',e.target.value)}/></Field>
        <Field label="Телефон"><input className="field-input" value={modal.data.phone||''} onChange={e=>upd('phone',e.target.value)}/></Field>
        <Field label="Режим работы"><input className="field-input" value={modal.data.hours||''} onChange={e=>upd('hours',e.target.value)} placeholder="09:00 – 23:00"/></Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Широта (lat)"><input type="number" step="0.0001" className="field-input" value={modal.data.lat||''} onChange={e=>upd('lat',+e.target.value)}/></Field>
          <Field label="Долгота (lng)"><input type="number" step="0.0001" className="field-input" value={modal.data.lng||''} onChange={e=>upd('lng',+e.target.value)}/></Field>
        </div>
        <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', marginBottom:18 }}>
          <input type="checkbox" checked={!!modal.data.isMain} onChange={e=>upd('isMain',e.target.checked)} style={{ accentColor:'var(--c-gold)', width:15, height:15 }}/>
          <span style={{ fontSize:13, color:'var(--c-text-2)' }}>Главный филиал</span>
        </label>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={()=>setModal({open:false,data:{}})} className="btn btn-ghost btn-md" style={{flex:1}}>Отмена</button>
          <button onClick={save} disabled={saving} className="btn btn-gold btn-md" style={{flex:1}}>{saving?<Spin/>:<><Check size={15}/>Сохранить</>}</button>
        </div>
      </Modal>
      <ConfirmModal open={confirm.open} title="Удалить филиал?" msg="Филиал будет удалён." onConfirm={async()=>{await sleep(300);deleteBranch(confirm.id);setConfirm({open:false,id:''});toast.success('Удалено');}} onCancel={()=>setConfirm({open:false,id:''})}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PROMOS ADMIN
══════════════════════════════════════════════════════ */
function PromosAdmin() {
  const { promos, addPromo, updatePromo, deletePromo } = useDataStore();
  const [modal, setModal] = useState<{ open: boolean; data: Partial<Promo> }>({ open: false, data: {} });
  const [confirm, setConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [saving, setSaving] = useState(false);
  const isEdit = !!modal.data.id;
  const upd = (k: keyof Promo, v: unknown) => setModal(m => ({ ...m, data: { ...m.data, [k]: v } }));

  const openAdd = () => setModal({ open: true, data: { titleRu: '', titleUz: '', descriptionRu: '', descriptionUz: '', code: '', discount: undefined, image: '', isActive: true } });
  const openEdit = (p: Promo) => setModal({ open: true, data: { ...p } });

  const save = async () => {
    if (!modal.data.titleRu?.trim()) { toast.error('Введите название'); return; }
    setSaving(true); await sleep(400);
    if (isEdit) {
      updatePromo({ ...modal.data } as Promo);
      toast.success('Промо обновлено');
    } else {
      addPromo({
        id: Date.now().toString(),
        titleRu: modal.data.titleRu!, titleUz: modal.data.titleUz || modal.data.titleRu!,
        descriptionRu: modal.data.descriptionRu || '', descriptionUz: modal.data.descriptionUz || '',
        image: modal.data.image || '', code: modal.data.code || undefined,
        discount: modal.data.discount, isActive: modal.data.isActive ?? true,
        expiresAt: modal.data.expiresAt,
      });
      toast.success('Промо добавлено');
    }
    setSaving(false); setModal({ open: false, data: {} });
  };

  return (
    <div>
      <SH title="Промокоды" sub={`${promos.length} промо`}
        action={<button onClick={openAdd} className="btn btn-gold btn-sm"><Plus size={14} />Добавить</button>} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {promos.length === 0 ? <Empty icon="🎫" text="Промокодов пока нет" action={<button className="btn btn-gold btn-sm" onClick={openAdd}><Plus size={14}/>Добавить</button>} /> :
          promos.map(p => (
            <motion.div key={p.id} layout
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                background: 'var(--c-bg-1)', border: '1px solid var(--c-border)',
                borderRadius: 'var(--r-md)', opacity: p.isActive ? 1 : 0.5,
              }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--c-text)' }}>{p.titleRu}</p>
                <p style={{ fontSize: 11, color: 'var(--c-gold)', fontWeight: 700, marginTop: 2 }}>
                  {p.code || '—'} {typeof p.discount === 'number' ? `· -${p.discount}%` : ''}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button onClick={() => { updatePromo({ ...p, isActive: !p.isActive }); toast.success('Обновлено'); }}
                  style={{ color: p.isActive ? 'var(--c-gold)' : 'var(--c-text-3)', display: 'flex', transition: 'color var(--t-fast)' }}>
                  {p.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                </button>
                <button onClick={() => openEdit(p)} className="btn btn-ghost btn-xs"><Edit2 size={12} /></button>
                <button onClick={() => setConfirm({ open: true, id: p.id })} className="btn btn-danger btn-xs"><Trash2 size={12} /></button>
              </div>
            </motion.div>
          ))
        }
      </div>

      <Modal open={modal.open} title={isEdit ? 'Редактировать промо' : 'Новый промокод'} onClose={() => setModal({ open: false, data: {} })}>
        <Field label="Название (RU)" required><input className="field-input" value={modal.data.titleRu||''} onChange={e => upd('titleRu', e.target.value)} placeholder="Скидка 20% на завтраки" /></Field>
        <Field label="Название (UZ)"><input className="field-input" value={modal.data.titleUz||''} onChange={e => upd('titleUz', e.target.value)} /></Field>
        <Field label="Описание (RU) — что даёт промокод"><textarea className="field-input" rows={2} value={modal.data.descriptionRu||''} onChange={e => upd('descriptionRu', e.target.value)} style={{ minHeight: 64 }} /></Field>
        <Field label="Описание (UZ)"><textarea className="field-input" rows={2} value={modal.data.descriptionUz||''} onChange={e => upd('descriptionUz', e.target.value)} style={{ minHeight: 64 }} /></Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Код" required><input className="field-input" value={modal.data.code||''} onChange={e => upd('code', e.target.value.toUpperCase())} placeholder="MORNING20" style={{ fontFamily: 'var(--f-display)', fontWeight: 700 }} /></Field>
          <Field label="Скидка, %"><input type="number" className="field-input" value={modal.data.discount ?? ''} onChange={e => upd('discount', e.target.value ? +e.target.value : undefined)} placeholder="20" /></Field>
        </div>
        <Field label="Изображение (необязательно)">
          <ImageUpload value={modal.data.image || ''} onChange={v => upd('image', v)} />
        </Field>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 18 }}>
          <input type="checkbox" checked={modal.data.isActive ?? true} onChange={e => upd('isActive', e.target.checked)} style={{ accentColor: 'var(--c-gold)', width: 15, height: 15 }} />
          <span style={{ fontSize: 13, color: 'var(--c-text-2)' }}>Активен (показывается на сайте)</span>
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setModal({ open: false, data: {} })} className="btn btn-ghost btn-md" style={{ flex: 1 }}>Отмена</button>
          <button onClick={save} disabled={saving} className="btn btn-gold btn-md" style={{ flex: 1 }}>
            {saving ? <Spin /> : <><Check size={15} />Сохранить</>}
          </button>
        </div>
      </Modal>
      <ConfirmModal open={confirm.open} title="Удалить промокод?" msg="Промокод будет удалён." onConfirm={async () => { await sleep(300); deletePromo(confirm.id); setConfirm({ open: false, id: '' }); toast.success('Удалено'); }} onCancel={() => setConfirm({ open: false, id: '' })} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SETTINGS
══════════════════════════════════════════════════════ */
function SettingsTab() {
  const [cfg, setCfg] = useState({ siteName:'Lummy', phone:'+998 94 818 68 68', email:'hello@lummy.uz', instagram:'@lummy.uz' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const save = async () => { setSaving(true); await sleep(700); setSaving(false); setSaved(true); toast.success('Сохранено'); setTimeout(()=>setSaved(false),3000); };
  return (
    <div>
      <SH title="Настройки" sub="Конфигурация сайта" />
      <div style={{ maxWidth:500, background:'var(--c-bg-1)', border:'1px solid var(--c-border)', borderRadius:'var(--r-xl)', padding:'24px' }}>
        <Field label="Название сайта"><input className="field-input" value={cfg.siteName} onChange={e=>setCfg(c=>({...c,siteName:e.target.value}))}/></Field>
        <Field label="Телефон"><input className="field-input" value={cfg.phone} onChange={e=>setCfg(c=>({...c,phone:e.target.value}))}/></Field>
        <Field label="Email"><input className="field-input" value={cfg.email} onChange={e=>setCfg(c=>({...c,email:e.target.value}))}/></Field>
        <Field label="Instagram"><input className="field-input" value={cfg.instagram} onChange={e=>setCfg(c=>({...c,instagram:e.target.value}))}/></Field>
        <button onClick={save} disabled={saving} className="btn btn-gold btn-md" style={{ width:'100%', marginTop:6 }}>
          {saving?<><Spin/>Сохраняем...</>:saved?<><Check size={15}/>Сохранено</>:<><ShieldCheck size={15}/>Сохранить</>}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ADMIN SHELL
══════════════════════════════════════════════════════ */
type ATab = 'dashboard'|'categories'|'dishes'|'branches'|'promos'|'settings';

const ADMIN_NAV: { key: ATab; label: string; icon: React.ReactNode }[] = [
  { key:'dashboard',  label:'Дашборд',    icon:<LayoutDashboard size={16}/> },
  { key:'categories', label:'Категории',  icon:<Tag size={16}/> },
  { key:'dishes',     label:'Блюда',      icon:<UtensilsCrossed size={16}/> },
  { key:'branches',   label:'Филиалы',    icon:<MapPin size={16}/> },
  { key:'promos',     label:'Промокоды',  icon:<Ticket size={16}/> },
  { key:'settings',   label:'Настройки',  icon:<Settings size={16}/> },
];

export default function AdminPage() {
  const [tab, setTab] = useState<ATab>('dashboard');

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      {/* Sidebar (desktop) */}
      <aside style={{
        width: 210, flexShrink: 0,
        background: 'var(--c-bg-1)', borderRight: '1px solid var(--c-border)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }} className="hidden md:flex">
        {/* Logo */}
        <div style={{ padding:'18px 16px 12px', borderBottom:'1px solid var(--c-border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <img src="/logo.png" alt="Lummy" style={{ width:28, height:28, borderRadius:'50%', objectFit:'cover' }} />
            <div>
              <p className="logo-wordmark" style={{ fontSize:'1.2rem', fontWeight:400, color:'var(--c-gold)', lineHeight:1 }}>Lummy</p>
              <p style={{ fontSize:9, color:'var(--c-text-3)', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:1 }}>Admin Panel</p>
            </div>
          </div>
        </div>
        <div style={{ padding:'12px 12px 8px', flex:1 }}>
          <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--c-text-3)', marginBottom:8, paddingLeft:4 }}>Управление</p>
          <nav style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {ADMIN_NAV.map(item => (
              <button key={item.key} onClick={()=>setTab(item.key)}
                className={`sidebar-link ${tab===item.key?'active':''}`}>
                {item.icon}
                <span style={{ flex:1 }}>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div style={{ padding:'12px 12px 20px', borderTop:'1px solid var(--c-border)' }}>
          <a href="/" className="sidebar-link"><LogOut size={14}/>На сайт</a>
        </div>
      </aside>

      {/* Mobile bottom nav (admin) */}
      <nav style={{ display:'none', position:'fixed', bottom:0, left:0, right:0, zIndex:90, background:'var(--c-bg-1)', borderTop:'1px solid var(--c-border)', overflowX:'auto' }} className="admin-mobile-nav no-scrollbar">
        {ADMIN_NAV.map(item=>(
          <button key={item.key} onClick={()=>setTab(item.key)}
            style={{ flex:'1 0 auto', minWidth:52, display:'flex', flexDirection:'column', alignItems:'center', gap:2, padding:'10px 6px', border:'none', background:'transparent', cursor:'pointer', color: tab===item.key?'var(--c-gold)':'var(--c-text-3)', transition:'color var(--t-fast)' }}>
            {item.icon}
            <span style={{ fontSize:8, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase' }}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ flex:1, minWidth:0, padding:'clamp(16px,3vw,28px)', paddingBottom:'80px' }} className="md:pb-6">
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0 }} transition={{ duration:0.15 }}>
            {tab==='dashboard'  && <Dashboard/>}
            {tab==='categories' && <Categories/>}
            {tab==='dishes'     && <Dishes/>}
            {tab==='branches'   && <BranchesAdmin/>}
            {tab==='promos'     && <PromosAdmin/>}
            {tab==='settings'   && <SettingsTab/>}
          </motion.div>
        </AnimatePresence>
      </main>

      <style>{`
        @media (max-width: 767px) {
          .admin-mobile-nav { display: flex !important; }
        }
        .hidden { display: none; }
        @media (min-width: 768px) {
          .hidden.md\\:flex { display: flex !important; }
          .admin-mobile-nav { display: none !important; }
          main.md\\:pb-6 { padding-bottom: 24px !important; }
        }
        .hidden-sm { display: none; }
        .hidden-md { display: none; }
        @media (min-width: 640px) { .hidden-sm { display: table-cell !important; } }
        @media (min-width: 900px) { .hidden-md { display: table-cell !important; } }
      `}</style>
    </div>
  );
}
