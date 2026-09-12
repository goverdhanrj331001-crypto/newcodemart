export interface ProductAuthor {
  name: string;
  avatar: string;
  slug: string;
  bio?: string;
  totalProducts?: number;
  totalSales?: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  likes?: number;
  helpfulCount?: number;
}

export interface Question {
  id: string;
  userName: string;
  userAvatar?: string;
  date: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  answerDate?: string;
}

export interface ProductSpecification {
  lastUpdate: string;
  published: string;
  layoutType: string;
  highResolution?: boolean;
  compatibleBrowsers?: string[];
  filesIncluded?: string[];
  tags: string[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  image: string;
  gallery?: string[];
  author: ProductAuthor;
  price: string;
  originalPrice?: string;
  category: string;
  isFree?: boolean;
  description?: string;
  fullDescriptionHtml?: string;
  features?: string[];
  rating?: number;
  totalReviews?: number;
  salesCount?: number;
  downloadCount?: number;
  liveDemoUrl?: string;
  specifications?: ProductSpecification;
  reviews?: Review[];
  questions?: Question[];
}

export type CategoryFilterId = string;
