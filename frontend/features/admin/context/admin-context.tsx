"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/features/products/types/product.types";
import { INITIAL_PRODUCTS, MORE_PRODUCTS } from "@/features/products/data/products.data";
import { POPULAR_COURSES, CourseDetailItem } from "@/features/courses/data/courses.data";
import { CATEGORIES_BY_TECH, CATEGORIES_BY_PROJECT_TYPE } from "@/features/categories/data/categories.data";
import { CategoryItem } from "@/features/categories/types/categories.types";
import {
  AdminUser,
  AdminOrder,
  AdminReview,
  AdminBanner,
  AdminShop,
  AdminSettings,
} from "../types/admin.types";
import {
  INITIAL_ADMIN_USERS,
  INITIAL_ADMIN_ORDERS,
  INITIAL_ADMIN_REVIEWS,
  INITIAL_ADMIN_BANNERS,
  INITIAL_ADMIN_SHOPS,
  INITIAL_ADMIN_SETTINGS,
} from "../data/admin.data";
import { apiSafe } from "@/lib/api-client";
import { productFromBackend, categoryFromBackend, bannerFromBackend } from "@/lib/transformers";
import { fetchCourses } from "@/features/courses/data/courses.api";

interface AdminContextType {
  products: Product[];
  courses: CourseDetailItem[];
  categories: CategoryItem[];
  users: AdminUser[];
  orders: AdminOrder[];
  reviews: AdminReview[];
  banners: AdminBanner[];
  shops: AdminShop[];
  settings: AdminSettings;
  addProduct: (newProd: Partial<Product>) => Product;
  deleteProduct: (id: string) => void;
  addCategory: (newCat: Partial<CategoryItem>) => CategoryItem;
  deleteCategory: (id: string) => void;
  addUser: (newUser: Partial<AdminUser>) => AdminUser;
  deleteUser: (id: string) => void;
  addCourse: (newCourse: Partial<CourseDetailItem>) => CourseDetailItem;
  deleteCourse: (id: string) => void;
  addBanner: (newBanner: Partial<AdminBanner>) => AdminBanner;
  deleteBanner: (id: string) => void;
  toggleBannerStatus: (id: string) => void;
  updateSettings: (newSettings: Partial<AdminSettings>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => [
    ...INITIAL_PRODUCTS,
    ...MORE_PRODUCTS,
  ]);
  const [courses, setCourses] = useState<CourseDetailItem[]>(() => POPULAR_COURSES);
  const [categories, setCategories] = useState<CategoryItem[]>(() => [
    ...CATEGORIES_BY_TECH,
    ...CATEGORIES_BY_PROJECT_TYPE,
  ]);
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ADMIN_ORDERS);
  const [reviews, setReviews] = useState<AdminReview[]>(INITIAL_ADMIN_REVIEWS);
  const [banners, setBanners] = useState<AdminBanner[]>(INITIAL_ADMIN_BANNERS);
  const [shops, setShops] = useState<AdminShop[]>(INITIAL_ADMIN_SHOPS);
  const [settings, setSettings] = useState<AdminSettings>(INITIAL_ADMIN_SETTINGS);

  // ---- Fetch from backend API on mount (with static fallbacks) ----
  useEffect(() => {
    // Products
    apiSafe<any>('/products?limit=100', { data: [] })
      .then((res: any) => {
        const items = Array.isArray(res) ? res : res?.data || [];
        if (items.length) setProducts(items.map(productFromBackend));
      })
      .catch(() => undefined);

    // Categories
    apiSafe<any[]>('/categories', [])
      .then((items) => {
        if (Array.isArray(items) && items.length) {
          setCategories(items.map(categoryFromBackend));
        }
      })
      .catch(() => undefined);

    // Courses
    fetchCourses({ page: 1, limit: 50 })
      .then((items) => {
        if (items && items.length) setCourses(items as CourseDetailItem[]);
      })
      .catch(() => undefined);

    // Banners
    apiSafe<any[]>('/banners', [])
      .then((items) => {
        if (Array.isArray(items) && items.length) {
          setBanners(items.map(bannerFromBackend) as any);
        }
      })
      .catch(() => undefined);

    // Settings
    apiSafe<any>('/settings', null)
      .then((s) => {
        if (s) {
          setSettings({
            siteTitle: s.siteTitle || INITIAL_ADMIN_SETTINGS.siteTitle,
            siteDescription: s.siteDescription || INITIAL_ADMIN_SETTINGS.siteDescription,
            currencySymbol: s.currencySymbol || '$',
            supportEmail: s.supportEmail || '',
            contactNumber: s.contactNumber || '',
            enableVendorRegistration: s.enableVendorRegistration ?? true,
            enableGuestCheckout: s.enableGuestCheckout ?? true,
            popupBannerEnabled: s.popupBannerEnabled ?? true,
          });
        }
      })
      .catch(() => undefined);

    // Users (admin only — will fall back silently if not authenticated)
    apiSafe<any>('/users/admin?limit=50', { data: [] })
      .then((res: any) => {
        const items = Array.isArray(res) ? res : res?.data || [];
        if (items.length) {
          setUsers(items.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            avatar: u.avatar || `https://picsum.photos/seed/${u.id}/100/100`,
            permissions: [u.role] as any,
            walletPoints: u.walletPoints ?? 0,
            status: u.status || 'Active',
            createdAt: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '',
          })));
        }
      })
      .catch(() => undefined);

    // Orders
    apiSafe<any>('/orders/admin?limit=50', { data: [] })
      .then((res: any) => {
        const items = Array.isArray(res) ? res : res?.data || [];
        if (items.length) {
          setOrders(items.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            customerName: o.customerName || '—',
            customerEmail: o.customerEmail || '—',
            itemsCount: o.itemsCount || 0,
            totalAmount: Number(o.finalAmount || o.totalAmount || 0),
            status: o.status,
            date: o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : '',
            paymentMethod: o.paymentMethod || '—',
          })));
        }
      })
      .catch(() => undefined);

    // Reviews
    apiSafe<any>('/reviews/admin?limit=50', { data: [] })
      .then((res: any) => {
        const items = Array.isArray(res) ? res : res?.data || [];
        if (items.length) {
          setReviews(items.map((r: any) => ({
            id: r.id,
            userName: r.userName,
            userAvatar: r.userAvatar || '',
            productTitle: r.product?.title || '—',
            rating: Number(r.rating),
            comment: r.comment,
            date: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : '',
            status: r.status,
          })));
        }
      })
      .catch(() => undefined);

    // Shops
    apiSafe<any>('/shops/admin/list?limit=50', { data: [] })
      .then((res: any) => {
        const items = Array.isArray(res) ? res : res?.data || [];
        if (items.length) {
          setShops(items.map((s: any) => ({
            id: s.id,
            name: s.name,
            logo: s.logo || `https://picsum.photos/seed/${s.id}/100/100`,
            ownerName: s.owner?.name || '—',
            ownerEmail: s.owner?.email || '—',
            productsCount: s.productsCount || 0,
            ordersCount: s.ordersCount || 0,
            revenue: Number(s.revenue || 0),
            status: s.status,
          })));
        }
      })
      .catch(() => undefined);
  }, []);

  const addProduct = (data: Partial<Product>): Product => {
    const id = `prod-${Date.now()}`;
    const slug = data.slug || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `product-${Date.now()}`);
    const createdProduct: Product = {
      id,
      title: data.title || "Untitled Product",
      slug,
      price: data.price || "$29.00",
      originalPrice: data.originalPrice,
      image: data.image || "https://picsum.photos/seed/pixerproduct/800/600",
      gallery: data.gallery || [data.image || "https://picsum.photos/seed/pixerproduct/800/600"],
      category: data.category || "React",
      description: data.description || "High performance digital asset built with modern standards.",
      author: data.author || {
        name: "Pixer Author",
        avatar: "https://picsum.photos/seed/pixerauth/100/100",
        slug: "pixer-author",
      },
    };

    setProducts((prev) => [createdProduct, ...prev]);
    return createdProduct;
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addCategory = (data: Partial<CategoryItem>): CategoryItem => {
    const id = `cat-${Date.now()}`;
    const slug = data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `category-${Date.now()}`);
    const createdCat: CategoryItem = {
      id,
      name: data.name || "New Category",
      slug,
      count: "0 Products",
      productCount: 0,
      type: "tech",
      gradient: "from-emerald-600 to-teal-800",
      description: data.description || "Digital template category.",
      iconName: data.iconName || "LayoutGrid",
      monogram: data.name ? data.name.substring(0, 2).toUpperCase() : "NC",
      filterCategory: data.filterCategory || slug,
    };

    setCategories((prev) => [createdCat, ...prev]);
    return createdCat;
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const addUser = (data: Partial<AdminUser>): AdminUser => {
    const newId = String(Math.floor(300 + Math.random() * 900));
    const createdUser: AdminUser = {
      id: newId,
      name: data.name || "New User",
      email: data.email || "user@pixer.com",
      avatar: data.avatar || `https://picsum.photos/seed/${newId}/100/100`,
      permissions: data.permissions || ["customer"],
      walletPoints: data.walletPoints ?? 100,
      status: data.status || "Active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setUsers((prev) => [createdUser, ...prev]);
    return createdUser;
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const addCourse = (data: Partial<CourseDetailItem>): CourseDetailItem => {
    const id = `course-${Date.now()}`;
    const slug = data.slug || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `course-${Date.now()}`);
    const createdCourse: CourseDetailItem = {
      id,
      title: data.title || "New Video Masterclass",
      slug,
      price: data.price || "$49.00",
      originalPrice: data.originalPrice || "$99.00",
      image: data.image || "https://picsum.photos/seed/pixercourse/800/600",
      category: data.category || "Full-stack",
      level: data.level || "Intermediate",
      durationFormatted: data.durationFormatted || "12.5 Hours",
      ratingScore: 5.0,
      reviewsCountFormatted: "1 Review",
      thumbnailType: "react-next",
      description: data.description || "Master industry concepts with hands-on projects.",
      author: data.author || {
        name: "Jhon Doe",
        avatar: "https://picsum.photos/seed/jhon/100/100",
        slug: "jhon-doe",
        bio: "Senior Lead Architect",
      },
    };

    setCourses((prev) => [createdCourse, ...prev]);
    return createdCourse;
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const addBanner = (data: Partial<AdminBanner>): AdminBanner => {
    const id = `BAN-${Date.now()}`;
    const createdBanner: AdminBanner = {
      id,
      title: data.title || "New Promotional Banner",
      subtitle: data.subtitle || "Exclusive deal for Pixer customers.",
      type: data.type || "explore_carousel",
      imageUrl: data.imageUrl || "https://picsum.photos/seed/pixerbanner/800/400",
      targetUrl: data.targetUrl || "/explore",
      badgeText: data.badgeText || "Special Offer",
      discountTag: data.discountTag || "Special Deal",
      isActive: true,
    };

    setBanners((prev) => [createdBanner, ...prev]);
    return createdBanner;
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleBannerStatus = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const updateSettings = (data: Partial<AdminSettings>) => {
    setSettings((prev) => ({ ...prev, ...data }));
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        courses,
        categories,
        users,
        orders,
        reviews,
        banners,
        shops,
        settings,
        addProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        addUser,
        deleteUser,
        addCourse,
        deleteCourse,
        addBanner,
        deleteBanner,
        toggleBannerStatus,
        updateSettings,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
