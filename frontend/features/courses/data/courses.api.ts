/**
 * Data-fetching layer for courses.
 */
import { apiSafe } from '@/lib/api-client';
import { courseFromBackend } from '@/lib/transformers';
import { POPULAR_COURSES } from './courses.data';

export interface BackendCourseResponse {
  data: any[];
  meta?: any;
}

export async function fetchCourses(opts?: { page?: number; limit?: number; category?: string; search?: string }) {
  const params = new URLSearchParams();
  if (opts?.page) params.set('page', String(opts.page));
  if (opts?.limit) params.set('limit', String(opts.limit));
  if (opts?.category && opts.category !== 'All') params.set('category', opts.category);
  if (opts?.search) params.set('search', opts.search);
  const query = params.toString();
  const path = `/courses${query ? `?${query}` : ''}`;

  const result = await apiSafe<BackendCourseResponse | any[]>(path, {
    data: POPULAR_COURSES,
  });
  const rawItems: any[] = Array.isArray(result) ? result : result.data || [];
  if (!rawItems.length) return POPULAR_COURSES;
  return rawItems.map(courseFromBackend);
}

export async function fetchCourseBySlug(slug: string) {
  const cleanSlug = slug.replace(/^\//, '').replace(/^courses\//, '');
  const result = await apiSafe<any>(`/courses/slug/${cleanSlug}`, null as any);
  if (!result) {
    const found = POPULAR_COURSES.find((c) => c.slug.includes(cleanSlug));
    return found || null;
  }
  return courseFromBackend(result);
}
