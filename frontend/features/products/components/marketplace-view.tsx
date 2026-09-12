"use client";

import React, { useState } from "react";
import { Header } from "@/features/navigation/components/header";
import { Sidebar } from "@/features/navigation/components/sidebar";
import { MobileBottomNav } from "@/features/navigation/components/mobile-bottom-nav";
import { CartDrawer } from "@/features/navigation/components/cart-drawer";
import { SearchModal } from "@/features/navigation/components/search-modal";
import { SellerModal } from "@/features/navigation/components/seller-modal";
import { UserAccountModal } from "@/features/navigation/components/user-account-modal";
import { ContactView } from "@/features/contact/components/contact-view";
import { CoursesView } from "@/features/courses/components/courses-view";
import { CourseDetailsView } from "@/features/courses/components/course-details-view";
import { CourseDetailItem, POPULAR_COURSES } from "@/features/courses/data/courses.data";
import { getCleanSlug } from "../utils/product.utils";
import { SocialView } from "@/features/social/components/social-view";
import { CategoriesView } from "@/features/categories/components/categories-view";
import { CategoryFilterBar } from "./category-filter-bar";
import { ExploreBannerCarousel } from "./explore-banner-carousel";
import { ProductGrid } from "./product-grid";
import { ProductPreviewModal } from "./product-preview-modal";
import { ProductDetailModal } from "./product-detail-modal";
import { WatchAdModal } from "./watch-ad-modal";
import { Product } from "../types/product.types";
import { useProductCatalog } from "../hooks/use-product-catalog";

interface MarketplaceViewProps {
  initialNav?: string;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  initialNav = "explore",
}) => {
  const [activeNav, setActiveNav] = useState(initialNav);
  const [selectedCourse, setSelectedCourse] = useState<CourseDetailItem | null>(null);
  const [watchAdProduct, setWatchAdProduct] = useState<Product | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const {
    products,
    allProducts,
    selectedCategory,
    selectedAuthor,
    cartItems,
    previewProduct,
    detailProduct,
    isSearchModalOpen,
    isCartOpen,
    isSellerModalOpen,
    isUserModalOpen,
    isMobileSidebarOpen,
    hasMore,
    isLoadingMore,
    handleSelectCategory,
    handleSelectAuthor,
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
  } = useProductCatalog();

  return (
    <div className="text-[13px] box-border h-full leading-[19.5px]">
      <div className="bg-[#f7f8fa] dark:bg-neutral-900 text-gray-900 dark:text-zinc-200 box-border flex flex-col min-h-[1000px] w-full min-h-screen transition-colors duration-200">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => {
            setIsSidebarCollapsed((prev) => !prev);
            setIsMobileSidebarOpen((prev) => !prev);
          }}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSellerModal={() => setIsSellerModalOpen(true)}
          onOpenUserModal={() => setIsUserModalOpen(true)}
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        />

        {/* Content row with fixed Sidebar and Main Content */}
        <div className="box-border flex basis-[0%] grow min-h-[auto] min-w-[auto]">
          {/* Navigation Sidebar */}
          <Sidebar
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            activeItem={activeNav}
            onSelectItem={(id) => {
              setActiveNav(id);
              if (id === "explore") {
                handleSelectCategory("All");
                if (typeof window !== "undefined") {
                  window.history.pushState(null, "", "/explore");
                }
              } else if (id === "home") {
                handleSelectCategory("All");
                if (typeof window !== "undefined") {
                  window.history.pushState(null, "", "/");
                }
              } else if (id === "popular-products") {
                handleSelectCategory("React");
                if (typeof window !== "undefined") {
                  window.history.pushState(null, "", "/explore");
                }
              } else if (id === "categories") {
                if (typeof window !== "undefined") {
                  window.history.pushState(null, "", "/categories");
                }
              } else if (id === "courses") {
                setSelectedCourse(null);
                if (typeof window !== "undefined") {
                  window.history.pushState(null, "", "/courses");
                }
              } else if (id === "contact-us") {
                if (typeof window !== "undefined") {
                  window.history.pushState(null, "", "/contact-us");
                }
              } else if (id === "social") {
                if (typeof window !== "undefined") {
                  window.history.pushState(null, "", "/social");
                }
              } else if (id === "profile") {
                setIsUserModalOpen(true);
              }
            }}
          />

          {/* Main Content Area */}
          <main
            className={`box-border flex flex-col min-h-[auto] min-w-[auto] w-full pb-20 md:pb-0 transition-all duration-300 ${
              isSidebarCollapsed ? "pl-0 md:pl-[72px]" : "pl-0 md:pl-60"
            }`}
          >
            {activeNav === "categories" ? (
              <CategoriesView
                onSelectCategory={(catName) => {
                  handleSelectCategory(catName);
                  setActiveNav("explore");
                  if (typeof window !== "undefined") {
                    window.history.pushState(null, "", "/explore");
                  }
                }}
              />
            ) : activeNav === "courses" ? (
              selectedCourse ? (
                <CourseDetailsView
                  course={selectedCourse}
                  onBack={() => {
                    setSelectedCourse(null);
                    if (typeof window !== "undefined") {
                      window.history.pushState(null, "", "/courses");
                    }
                  }}
                  onSelectRelatedCourse={(rel) => {
                    setSelectedCourse(rel);
                    const clean = getCleanSlug(rel.slug);
                    if (typeof window !== "undefined") {
                      window.history.pushState(null, "", `/courses/${clean}`);
                    }
                  }}
                  onAddToCart={(c) => {
                    handleAddToCart(c);
                    setIsCartOpen(true);
                  }}
                />
              ) : (
                <CoursesView
                  onPreview={(prod) => {
                    const found =
                      POPULAR_COURSES.find((item) => item.id === prod.id) ||
                      (prod as CourseDetailItem);
                    setSelectedCourse(found);
                    const clean = getCleanSlug(prod.slug);
                    if (typeof window !== "undefined") {
                      window.history.pushState(null, "", `/courses/${clean}`);
                    }
                  }}
                  onDetails={(prod) => {
                    const found =
                      POPULAR_COURSES.find((item) => item.id === prod.id) ||
                      (prod as CourseDetailItem);
                    setSelectedCourse(found);
                    const clean = getCleanSlug(prod.slug);
                    if (typeof window !== "undefined") {
                      window.history.pushState(null, "", `/courses/${clean}`);
                    }
                  }}
                  onAddToCart={(prod) => {
                    handleAddToCart(prod);
                    setIsCartOpen(true);
                  }}
                  onWatchAd={(prod) => setWatchAdProduct(prod)}
                />
              )
            ) : activeNav === "social" ? (
              <SocialView />
            ) : activeNav === "contact-us" ? (
              <ContactView />
            ) : (
              <>
                {/* Active Author Banner if author is selected */}
                {selectedAuthor && (
                  <div className="bg-zinc-800/90 border-b border-zinc-700 px-6 py-3 flex items-center justify-between">
                    <span className="text-white text-xs">
                      Showing products created by <strong className="text-emerald-400">{selectedAuthor}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelectAuthor(selectedAuthor)}
                      className="text-xs text-zinc-400 hover:text-white px-2 py-1 bg-zinc-700 rounded transition-colors"
                    >
                      Clear author filter
                    </button>
                  </div>
                )}

                {/* Promotional Banner Carousel for Explore page matching user screenshot */}
                {activeNav === "explore" && <ExploreBannerCarousel />}

                {/* Category Filter Horizontal Pill Bar */}
                <CategoryFilterBar
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleSelectCategory}
                />

                {/* Products Grid with Cards & Load More */}
                <ProductGrid
                  products={products}
                  onPreview={(prod) => setPreviewProduct(prod)}
                  onDetails={(prod) => setDetailProduct(prod)}
                  onAuthorClick={(authorName) => handleSelectAuthor(authorName)}
                  onAddToCart={(prod) => {
                    handleAddToCart(prod);
                    setIsCartOpen(true);
                  }}
                  onWatchAd={(prod) => setWatchAdProduct(prod)}
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                  isLoadingMore={isLoadingMore}
                />
              </>
            )}
          </main>
        </div>
      </div>

      {/* Modals & Drawers */}
      <ProductPreviewModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <WatchAdModal
        product={watchAdProduct}
        onClose={() => setWatchAdProduct(null)}
        onUnlock={(prod) => {
          handleAddToCart(prod);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        products={allProducts}
        onSelectProduct={(prod) => {
          if (prod.id.startsWith("course-")) {
            const found =
              POPULAR_COURSES.find((c) => c.id === prod.id) ||
              (prod as CourseDetailItem);
            setSelectedCourse(found);
            setActiveNav("courses");
            const clean = getCleanSlug(prod.slug);
            if (typeof window !== "undefined") {
              window.history.pushState(null, "", `/courses/${clean}`);
            }
          } else {
            setDetailProduct(prod);
          }
        }}
      />

      <SellerModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
      />

      <UserAccountModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeNav={activeNav}
        onSelectNav={(id) => {
          setActiveNav(id);
          if (id === "explore" || id === "home") {
            handleSelectCategory("All");
            if (typeof window !== "undefined") {
              window.history.pushState(null, "", "/explore");
            }
          } else if (id === "categories") {
            if (typeof window !== "undefined") {
              window.history.pushState(null, "", "/categories");
            }
          } else if (id === "courses") {
            setSelectedCourse(null);
            if (typeof window !== "undefined") {
              window.history.pushState(null, "", "/courses");
            }
          }
        }}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenUserModal={() => setIsUserModalOpen(true)}
      />
    </div>
  );
};
