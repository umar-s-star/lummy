import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
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

export function statusClass(s: string): string {
  return `status-${s}`;
}

export function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
