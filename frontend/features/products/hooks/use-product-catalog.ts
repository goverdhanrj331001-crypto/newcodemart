"use client";

import { useState, useMemo, useEffect } from "react";
import { INITIAL_PRODUCTS, MORE_PRODUCTS } from "../data/products.data";
import { Product } from "../types/product.types";
import { CartItem } from "@/features/navigation/types/navigation.types";
import { fetchProducts } from "../data/products.api";

export function useProductCatalog() {
  const [allProducts, setAllProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Modals state
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Load more state
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch products from backend API on mount (with static fallback)
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchProducts({ page: 1, limit: 50 })
      .then((items) => {
        if (cancelled) return;
        if (items && items.length > 0) {
          setAllProducts(items);
        }
      })
      .catch(() => {
        // Silent fallback — already initialised with INITIAL_PRODUCTS
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter products by selectedCategory, searchQuery, author
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== "All") {
        if (selectedCategory === "Free" && !product.isFree && product.price !== "Free") {
          return false;
        }
        if (selectedCategory !== "Free" && product.category !== selectedCategory) {
          return false;
        }
      }

      // Author filter
      if (selectedAuthor && product.author.name !== selectedAuthor) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesAuthor = product.author.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat && !matchesAuthor) {
          return false;
        }
      }

      return true;
    });
  }, [allProducts, selectedCategory, selectedAuthor, searchQuery]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedAuthor(null); // reset author filter on category change
  };

  const handleSelectAuthor = (authorName: string) => {
    if (selectedAuthor === authorName) {
      setSelectedAuthor(null);
    } else {
      setSelectedAuthor(authorName);
      setSelectedCategory("All");
    }
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Try fetching more from backend; fall back to static MORE_PRODUCTS
    fetchProducts({ page: 2, limit: 50 })
      .then((items) => {
        setAllProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newOnes = items.filter((p) => !existingIds.has(p.id));
          // If backend returned nothing new, fall back to static MORE_PRODUCTS
          if (newOnes.length === 0) {
            const staticNew = MORE_PRODUCTS.filter((p) => !existingIds.has(p.id));
            return [...prev, ...staticNew];
          }
          return [...prev, ...newOnes];
        });
      })
      .catch(() => {
        // Fallback to static
        setAllProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newOnes = MORE_PRODUCTS.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newOnes];
        });
      })
      .finally(() => {
        setHasLoadedMore(true);
        setIsLoadingMore(false);
      });
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          author: product.author.name,
          quantity: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout with your digital items!");
  };

  return {
    products: filteredProducts,
    allProducts,
    selectedCategory,
    selectedAuthor,
    searchQuery,
    cartItems,
    previewProduct,
    detailProduct,
    isSearchModalOpen,
    isCartOpen,
    isSellerModalOpen,
    isUserModalOpen,
    isMobileSidebarOpen,
    hasMore: !hasLoadedMore,
    isLoadingMore,
    isLoading,
    handleSelectCategory,
    handleSelectAuthor,
    setSearchQuery,
    handleLoadMore,
    handleAddToCart,
    handleRemoveFromCart,
    handleCheckout,
    setPreviewProduct,
    setDetailProduct,
    setIsSearchModalOpen,
    setIsCartOpen,
    setIsSellerModalOpen,
    setIsUserModalOpen,
    setIsMobileSidebarOpen,
  };
}
