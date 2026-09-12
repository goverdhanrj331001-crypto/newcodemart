/**
 * Data-fetching layer for categories.
 */
import { apiSafe } from '@/lib/api-client';
import { categoryFromBackend } from '@/lib/transformers';
import { CATEGORIES_BY_TECH, CATEGORIES_BY_PROJECT_TYPE } from './categories.data';

export const STATIC_CATEGORIES = [...CATEGORIES_BY_TECH, ...CATEGORIES_BY_PROJECT_TYPE];

export async function fetchCategories() {
  const result = await apiSafe<any[]>(`/categories`, STATIC_CATEGORIES);
  const items = Array.isArray(result) ? result : [];
  if (!items.length) return STATIC_CATEGORIES;
  return items.map(categoryFromBackend);
}
