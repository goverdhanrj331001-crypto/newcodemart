/**
 * Transformers that convert backend (snake/camel case + numeric prices)
 * to frontend shape (string prices like "$39.00", slugs prefixed with "/products/").
 *
 * These are needed because the original UI components expect the exact same
 * shape as the hardcoded static data arrays.
 */

import type { Product, Review, Question, ProductAuthor } from '../features/products/types/product.types';
import type { CourseDetailItem } from '../features/courses/data/courses.data';
import type { CategoryItem } from '../features/categories/types/categories.types';

function formatPrice(value: number | string | null | undefined, isFree?: boolean): string {
  if (isFree) return 'Free';
  if (value === null || value === undefined) return '$0.00';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);
  return `$${num.toFixed(2)}`;
}

function authorFromBackend(author: any): ProductAuthor {
  if (!author) {
    return { name: 'Unknown', avatar: 'https://picsum.photos/seed/unknown/100/100', slug: '/authors/unknown' };
  }
  return {
    name: author.name || 'Unknown',
    avatar: author.avatar || `https://picsum.photos/seed/${encodeURIComponent(author.name || 'unknown')}/100/100`,
    slug: `/authors/${(author.name || 'unknown').toLowerCase().replace(/\s+/g, '-')}`,
    bio: author.bio,
    totalProducts: author.totalProducts,
    totalSales: author.totalSales,
  };
}

function reviewFromBackend(r: any): Review {
  return {
    id: r.id,
    userName: r.userName,
    userAvatar: r.userAvatar,
    rating: Number(r.rating),
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
    comment: r.comment,
    likes: r.likes ?? 0,
    helpfulCount: r.helpfulCount ?? 0,
  };
}

function questionFromBackend(q: any): Question {
  return {
    id: q.id,
    userName: q.userName,
    userAvatar: q.userAvatar,
    date: q.createdAt ? new Date(q.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
    question: q.question,
    answer: q.answer ?? undefined,
    answeredBy: q.answeredBy ?? undefined,
    answerDate: q.answerDate ? new Date(q.answerDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : undefined,
  };
}

export function productFromBackend(p: any): Product {
  const spec = p.specifications || {};
  return {
    id: p.id,
    title: p.title,
    slug: `/products/${p.slug || p.id}`,
    image: p.image,
    gallery: p.gallery || [p.image],
    author: authorFromBackend(p.author),
    price: formatPrice(p.price, p.isFree),
    originalPrice: p.originalPrice ? formatPrice(p.originalPrice) : undefined,
    category: p.category || 'General',
    isFree: p.isFree ?? false,
    description: p.description,
    fullDescriptionHtml: p.fullDescriptionHtml,
    features: p.features || [],
    rating: typeof p.rating === 'string' ? parseFloat(p.rating) : p.rating ?? 0,
    totalReviews: p.totalReviews ?? 0,
    salesCount: p.salesCount ?? 0,
    downloadCount: p.downloadCount ?? 0,
    liveDemoUrl: p.liveDemoUrl,
    specifications: {
      lastUpdate: spec.lastUpdate || '',
      published: spec.published || '',
      layoutType: spec.layoutType || '',
      highResolution: spec.highResolution,
      compatibleBrowsers: spec.compatibleBrowsers,
      filesIncluded: spec.filesIncluded,
      tags: spec.tags || [],
    },
    reviews: (p.reviews || []).map(reviewFromBackend),
    questions: (p.questions || []).map(questionFromBackend),
  };
}

export function courseFromBackend(c: any): CourseDetailItem {
  const author = authorFromBackend(c.instructor);
  return {
    id: c.id,
    title: c.title,
    slug: `/courses/${c.slug || c.id}`,
    image: c.image,
    gallery: [c.image],
    author,
    price: formatPrice(c.price, c.isFree),
    originalPrice: c.originalPrice ? formatPrice(c.originalPrice) : undefined,
    category: c.category,
    isFree: c.isFree,
    description: c.description,
    features: c.features || [],
    rating: typeof c.rating === 'string' ? parseFloat(c.rating) : c.rating ?? 0,
    totalReviews: c.reviewsCount ?? 0,
    salesCount: c.studentsCount ?? 0,
    specifications: {
      lastUpdate: '',
      published: '',
      layoutType: '',
      tags: [],
    },
    ratingScore: typeof c.rating === 'string' ? parseFloat(c.rating) : c.rating ?? 0,
    reviewsCountFormatted: `${c.reviewsCount ?? 0} reviews`,
    durationFormatted: c.duration || '',
    level: c.level || 'All Levels',
    badgeTag: c.badge || undefined,
    thumbnailType: 'react-next',
    curriculum: c.curriculum || [],
  } as unknown as CourseDetailItem;
}

export function categoryFromBackend(c: any): CategoryItem {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    count: c.count || '0 Products',
    productCount: c.productCount || 0,
    type: (c.type as 'tech' | 'project_type') || 'tech',
    gradient: c.gradient || 'from-[#10b981] via-[#059669] to-[#047857]',
    monogram: c.monogram || c.name.charAt(0).toUpperCase(),
    iconName: c.iconName,
    filterCategory: c.filterCategory || c.name,
    description: c.description || '',
  };
}

export function bannerFromBackend(b: any) {
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle || '',
    type: b.type,
    imageUrl: b.imageUrl,
    targetUrl: b.targetUrl || '/',
    badgeText: b.badgeText,
    discountTag: b.discountTag,
    isActive: b.isActive,
  };
}
