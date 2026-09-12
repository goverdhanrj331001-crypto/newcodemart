/**
 * Data-fetching layer for products.
 *
 * Strategy: try the backend API first → if it fails (e.g. backend not started
 * yet, or running in pure-frontend preview), fall back to the original
 * static data arrays so the UI always renders something.
 */

import { apiSafe } from '@/lib/api-client';
import { productFromBackend } from '@/lib/transformers';
import { INITIAL_PRODUCTS, MORE_PRODUCTS } from './products.data';
import { Product } from '../types/product.types';

export interface BackendProductResponse {
  data: any[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

/** Returns merged fallback list (initial + more) for offline mode. */
export const STATIC_PRODUCTS: Product[] = [...INITIAL_PRODUCTS, ...MORE_PRODUCTS];

/**
 * Fetch products list from backend. Falls back to static data on error.
 */
export async function fetchProducts(opts?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  isFree?: boolean;
}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (opts?.page) params.set('page', String(opts.page));
  if (opts?.limit) params.set('limit', String(opts.limit));
  if (opts?.category && opts.category !== 'All') params.set('category', opts.category);
  if (opts?.search) params.set('search', opts.search);
  if (opts?.isFree) params.set('isFree', 'true');

  const query = params.toString();
  const path = `/products${query ? `?${query}` : ''}`;

  const result = await apiSafe<BackendProductResponse | any[]>(path, {
    data: STATIC_PRODUCTS.map(productFromBackend),
    meta: { page: 1, limit: 100, total: STATIC_PRODUCTS.length, totalPages: 1 },
  });

  const rawItems: any[] = Array.isArray(result) ? result : result.data || [];
  return rawItems.map(productFromBackend);
}

/**
 * Fetch a single product by slug. Falls back to static data.
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const cleanSlug = slug.replace(/^\//, '').replace(/^products\//, '');
  const result = await apiSafe<any>(`/products/slug/${cleanSlug}`, null as any);
  if (!result) {
    // Fallback to static
    const found = STATIC_PRODUCTS.find((p) => p.slug.includes(cleanSlug));
    return found || null;
  }
  return productFromBackend(result);
}

/**
 * Fetch featured products. Falls back to top-selling static products.
 */
export async function fetchFeaturedProducts(limit = 8): Promise<Product[]> {
  const result = await apiSafe<any[]>(`/products/featured?limit=${limit}`, STATIC_PRODUCTS.slice(0, limit));
  const items = Array.isArray(result) ? result : [];
  return items.map(productFromBackend);
}
