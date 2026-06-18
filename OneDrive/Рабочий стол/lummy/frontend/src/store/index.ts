import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, Language, Dish, Category, Branch, Promo } from '../types';
import { DISHES, CATEGORIES, BRANCHES, PROMOS } from '../lib/mockData';
import i18n from '../i18n';
import * as api from '../api';

function _toApiDish(d: Dish) {
  return {
    name_ru: d.nameRu, name_uz: d.nameUz || d.nameRu, name_uz_cyrl: d.nameUzCyrl || d.nameRu,
    description_ru: d.descriptionRu || '', description_uz: d.descriptionUz || '', description_uz_cyrl: d.descriptionUzCyrl || '',
    price: d.price, old_price: d.oldPrice ?? null, image: d.image || '',
    weight: d.weight ?? null, calories: d.calories ?? null,
    proteins: d.proteins ?? null, fats: d.fats ?? null, carbs: d.carbs ?? null,
    category_id: d.categoryId, is_bestseller: !!d.isBestseller, is_new: !!d.isNew,
    in_stock: d.inStock !== false, is_hidden: !!d.isHidden,
  };
}
function _toApiCat(c: Category) {
  return { name_ru: c.nameRu, name_uz: c.nameUz || c.nameRu, name_uz_cyrl: c.nameUzCyrl || c.nameRu, slug: c.slug, icon: c.icon || '🍽️', image: c.image ?? null, is_active: c.isActive, sort_order: (c as any).sortOrder ?? 0 };
}
function _toApiBranch(b: Branch) {
  return { name: b.name, address: b.address, phone: b.phone, hours: b.hours, lat: b.lat, lng: b.lng, is_main: !!b.isMain, image: b.image, description: b.description };
}
function _toApiPromo(p: Promo) {
  return {
    title_ru: p.titleRu, title_uz: p.titleUz || p.titleRu,
    description_ru: p.descriptionRu || '', description_uz: p.descriptionUz || '',
    image: p.image || '', code: p.code ?? null, discount: p.discount ?? null,
    is_active: p.isActive, expires_at: p.expiresAt ?? null,
  };
}

// ─── Theme ─────────────────────────────────────────────────
interface ThemeStore {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },
      toggle: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
    }),
    { name: 'lummy_theme' }
  )
);

// ─── Language ───────────────────────────────────────────────
interface LangStore {
  language: Language;
  setLanguage: (l: Language) => void;
}
export const useLangStore = create<LangStore>()(
  persist(
    (set) => ({
      language: 'ru',
      setLanguage: (language) => {
        set({ language });
        i18n.changeLanguage(language);
        localStorage.setItem('lummy_language', language);
      },
    }),
    { name: 'lummy_lang' }
  )
);

// ─── UI ────────────────────────────────────────────────────
interface UIStore {
  mobileMenuOpen: boolean;
  setMobileMenu: (v: boolean) => void;
}
export const useUIStore = create<UIStore>()((set) => ({
  mobileMenuOpen: false,
  setMobileMenu: (v) => set({ mobileMenuOpen: v }),
}));

// ─── Data Store (Admin ↔ Frontend connection) ───────────────
interface DataStore {
  dishes: Dish[];
  categories: Category[];
  branches: Branch[];
  promos: Promo[];
  backendOnline: boolean;
  setDishes: (d: Dish[]) => void;
  addDish: (d: Dish) => void;
  updateDish: (d: Dish) => void;
  deleteDish: (id: string) => void;
  setCategories: (c: Category[]) => void;
  addCategory: (c: Category) => void;
  updateCategory: (c: Category) => void;
  deleteCategory: (id: string) => void;
  setBranches: (b: Branch[]) => void;
  addBranch: (b: Branch) => void;
  updateBranch: (b: Branch) => void;
  deleteBranch: (id: string) => void;
  setPromos: (p: Promo[]) => void;
  addPromo: (p: Promo) => void;
  updatePromo: (p: Promo) => void;
  deletePromo: (id: string) => void;
  syncFromBackend: () => Promise<void>;
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      dishes: DISHES,
      categories: CATEGORIES,
      branches: BRANCHES,
      promos: PROMOS,
      backendOnline: false,
      setDishes: (dishes) => set({ dishes }),
      addDish: (d) => {
        set((s) => ({ dishes: [...s.dishes, d] }));
        if (get().backendOnline) api.createDish(_toApiDish(d)).catch(() => {});
      },
      updateDish: (d) => {
        set((s) => ({ dishes: s.dishes.map((x) => (x.id === d.id ? d : x)) }));
        if (get().backendOnline) api.updateDish(d.id, _toApiDish(d)).catch(() => {});
      },
      deleteDish: (id) => {
        set((s) => ({ dishes: s.dishes.filter((x) => x.id !== id) }));
        if (get().backendOnline) api.deleteDish(id).catch(() => {});
      },
      setCategories: (categories) => set({ categories }),
      addCategory: (c) => {
        set((s) => ({ categories: [...s.categories, c] }));
        if (get().backendOnline) api.createCategory(_toApiCat(c)).catch(() => {});
      },
      updateCategory: (c) => {
        set((s) => ({ categories: s.categories.map((x) => (x.id === c.id ? c : x)) }));
        if (get().backendOnline) api.updateCategory(c.id, _toApiCat(c)).catch(() => {});
      },
      deleteCategory: (id) => {
        set((s) => ({ categories: s.categories.filter((x) => x.id !== id) }));
        if (get().backendOnline) api.deleteCategory(id).catch(() => {});
      },
      setBranches: (branches) => set({ branches }),
      addBranch: (b) => {
        set((s) => ({ branches: [...s.branches, b] }));
        if (get().backendOnline) api.createBranch(_toApiBranch(b)).catch(() => {});
      },
      updateBranch: (b) => {
        set((s) => ({ branches: s.branches.map((x) => (x.id === b.id ? b : x)) }));
        if (get().backendOnline) api.updateBranch(b.id, _toApiBranch(b)).catch(() => {});
      },
      deleteBranch: (id) => {
        set((s) => ({ branches: s.branches.filter((x) => x.id !== id) }));
        if (get().backendOnline) api.deleteBranch(id).catch(() => {});
      },
      setPromos: (promos) => set({ promos }),
      addPromo: (p) => {
        set((s) => ({ promos: [...s.promos, p] }));
        if (get().backendOnline) api.createPromo(_toApiPromo(p)).catch(() => {});
      },
      updatePromo: (p) => {
        set((s) => ({ promos: s.promos.map((x) => (x.id === p.id ? p : x)) }));
        if (get().backendOnline) api.updatePromo(p.id, _toApiPromo(p)).catch(() => {});
      },
      deletePromo: (id) => {
        set((s) => ({ promos: s.promos.filter((x) => x.id !== id) }));
        if (get().backendOnline) api.deletePromo(id).catch(() => {});
      },
      syncFromBackend: async () => {
        try {
          await api.checkHealth();
          const [dishes, categories, branches, promos] = await Promise.all([
            api.getDishes(),
            api.getCategories(),
            api.getBranches(),
            api.getPromos(true),
          ]);
          // Map backend snake_case fields to frontend camelCase
          const mapDish = (d: any) => ({
            ...d,
            oldPrice: d.old_price,
            isBestseller: !!d.is_bestseller,
            isNew: !!d.is_new,
            inStock: !!d.in_stock,
            isHidden: !!d.is_hidden,
            categoryId: d.category_id,
          });
          const mapCategory = (c: any) => ({
            ...c,
            nameRu: c.name_ru,
            nameUz: c.name_uz,
            nameUzCyrl: c.name_uz_cyrl,
            isActive: !!c.is_active,
            sortOrder: c.sort_order,
          });
          const mapBranch = (b: any) => ({
            ...b,
            isMain: !!b.is_main,
          });
          const mapPromo = (p: any) => ({
            ...p,
            titleRu: p.title_ru,
            titleUz: p.title_uz,
            descriptionRu: p.description_ru,
            descriptionUz: p.description_uz,
            isActive: !!p.is_active,
            expiresAt: p.expires_at,
          });
          set({
            dishes: dishes.map(mapDish),
            categories: categories.map(mapCategory),
            branches: branches.map(mapBranch),
            promos: promos.map(mapPromo),
            backendOnline: true,
          });
        } catch {
          // Backend offline — keep localStorage data, that's fine
          set({ backendOnline: false });
        }
      },
    }),
    { name: 'lummy_data' }
  )
);
