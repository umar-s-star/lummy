import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  IceCreamCone, CakeSlice, Coffee, Croissant, UtensilsCrossed,
  Salad, CupSoda, Soup, Pizza, Sandwich, Wine, Fish, LayoutGrid,
  type LucideIcon,
} from 'lucide-react';
import type { Language, Dish, Category } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(n: number): string {
  return new Intl.NumberFormat('ru-UZ').format(n);
}

export function getDishName(d: Dish, lang: Language): string {
  if (lang === 'uz') return d.nameUz;
  if (lang === 'uz_cyrl') return d.nameUzCyrl;
  return d.nameRu;
}

export function getDishDesc(d: Dish, lang: Language): string {
  if (lang === 'uz') return d.descriptionUz;
  if (lang === 'uz_cyrl') return d.descriptionUzCyrl;
  return d.descriptionRu;
}

export function getCatName(c: Category, lang: Language): string {
  if (lang === 'uz') return c.nameUz;
  if (lang === 'uz_cyrl') return c.nameUzCyrl;
  return c.nameRu;
}

/** "Все" / "All" pseudo-category used in nav filters — distinct from real categories. */
export const ALL_CATEGORIES_ICON: LucideIcon = LayoutGrid;

const CATEGORY_ICON_RULES: { test: RegExp; Icon: LucideIcon }[] = [
  { test: /десерт|dessert|слад|ice\s*cream|мороженое/i, Icon: IceCreamCone },
  { test: /торт|cake|tort/i, Icon: CakeSlice },
  { test: /кофе|qahva|қаҳва|coffee|эспрессо|espresso/i, Icon: Coffee },
  { test: /чай|choy|чой|\btea\b/i, Icon: Coffee },
  { test: /завтрак|nonushta|нонушта|breakfast/i, Icon: Croissant },
  { test: /салат|salad/i, Icon: Salad },
  { test: /напит|ichimlik|ичимлик|drink|сок|juice|лимонад/i, Icon: CupSoda },
  { test: /суп|soup|shorva|шорва/i, Icon: Soup },
  { test: /пицц|pizza/i, Icon: Pizza },
  { test: /бургер|сэндвич|sandwich|burger/i, Icon: Sandwich },
  { test: /вино|wine|алкогол|alcohol/i, Icon: Wine },
  { test: /рыб|fish|морепродукт|seafood/i, Icon: Fish },
];

/** Maps a category to a premium line-icon based on its slug/name, replacing free-typed emoji on customer-facing UI. */
export function getCategoryIcon(c: Pick<Category, 'slug' | 'nameRu' | 'nameUz' | 'nameUzCyrl'>): LucideIcon {
  const probe = [c.slug, c.nameRu, c.nameUz, c.nameUzCyrl].filter(Boolean).join(' ');
  for (const rule of CATEGORY_ICON_RULES) {
    if (rule.test.test(probe)) return rule.Icon;
  }
  return UtensilsCrossed;
}

export function statusClass(s: string): string {
  return `status-${s}`;
}

export function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
