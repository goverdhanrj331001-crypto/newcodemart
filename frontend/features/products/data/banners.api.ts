/**
 * Data-fetching layer for marketing banners.
 */
import { apiSafe } from '@/lib/api-client';
import { bannerFromBackend } from '@/lib/transformers';

export async function fetchBanners() {
  const fallback = [
    {
      id: 'BAN-1',
      title: 'WordPress Themes & Creative UI/UX Templates',
      subtitle: 'High performance digital marketplace for themes, templates, scripts & creative assets.',
      type: 'explore_carousel',
      imageUrl: 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/1.png',
      targetUrl: '/explore',
      badgeText: 'Exclusive Digital Assets',
      discountTag: 'Save Up To 50% Off',
      isActive: true,
    },
    {
      id: 'BAN-2',
      title: 'Master Full-Stack Web & Mobile Development',
      subtitle: 'Hands-on video courses taught by industry veterans with full source code download.',
      type: 'courses_top',
      imageUrl: 'https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/3.png',
      targetUrl: '/courses',
      badgeText: 'Developer Academy',
      discountTag: 'Get Certified Today',
      isActive: true,
    },
  ];
  const result = await apiSafe<any[]>(`/banners`, fallback);
  const items = Array.isArray(result) ? result : [];
  if (!items.length) return fallback;
  return items.map(bannerFromBackend);
}
