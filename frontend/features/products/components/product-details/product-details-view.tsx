"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Product } from "../../types/product.types";
import { Header } from "@/features/navigation/components/header";
import { Sidebar } from "@/features/navigation/components/sidebar";
import { CartDrawer } from "@/features/navigation/components/cart-drawer";
import { SearchModal } from "@/features/navigation/components/search-modal";
import { SellerModal } from "@/features/navigation/components/seller-modal";
import { UserAccountModal } from "@/features/navigation/components/user-account-modal";
import { WatchAdModal } from "../watch-ad-modal";
import { ProductBackNav } from "./product-back-nav";
import { ProductGalleryGrid } from "./product-gallery-grid";
import { ProductDetailsPaper } from "./product-details-paper";
import { ProductInformationCard } from "./product-information-card";
import { ProductSocialShare } from "./product-social-share";
import { ProductRelatedGrid } from "./product-related-grid";
import { useProductCatalog } from "../../hooks/use-product-catalog";
import { getRelatedProducts, getProductUrl } from "../../utils/product.utils";

interface ProductDetailsViewProps {
  product: Product;
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ product }) => {
  const router = useRouter();
  const isCourse = product.id.startsWith("course-");
  const [activeNav, setActiveNav] = useState(isCourse ? "courses" : "explore");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [watchAdProduct, setWatchAdProduct] = useState<Product | null>(null);

  const {
    cartItems,
    isSearchModalOpen,
    isCartOpen,
    isSellerModalOpen,
    isUserModalOpen,
    isMobileSidebarOpen,
    allProducts,
    handleAddToCart,
    handleRemoveFromCart,
    handleCheckout,
    setIsSearchModalOpen,
    setIsCartOpen,
    setIsSellerModalOpen,
    setIsUserModalOpen,
    setIsMobileSidebarOpen,
  } = useProductCatalog();

  const relatedProducts = getRelatedProducts(product, 4, allProducts);
  const galleryImages = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  return (
    <div className="text-[13px] box-border min-h-screen leading-[19.5px] bg-[#f7f8fa] dark:bg-neutral-900 text-gray-800 dark:text-zinc-300 transition-colors duration-200">
      {/* Top Sticky Header */}
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
              router.push("/explore");
            } else if (id === "home") {
              router.push("/");
            } else if (id === "categories") {
              router.push("/categories");
            } else if (id === "courses") {
              router.push("/courses");
            } else if (id === "contact-us") {
              router.push("/contact-us");
            } else if (id === "social") {
              router.push("/social");
            } else if (id === "popular-products") {
              router.push("/explore");
            }
          }}
        />

        {/* Main Content Area */}
        <main
          className={`box-border flex flex-col w-full min-h-screen pb-28 transition-all duration-300 ${
            isSidebarCollapsed ? "pl-0 md:pl-[72px]" : "pl-0 md:pl-60"
          }`}
        >
          <div className="box-border min-h-[auto] min-w-[auto] w-full px-4 pt-4 pb-12 md:px-7 md:pt-6">
            {/* Back to Catalog Button */}
            <ProductBackNav
              href={isCourse ? "/courses" : "/"}
              label={isCourse ? "Back to Courses" : "Back to Marketplace"}
            />

            {/* Gallery Grid (3/2 aspect ratio screenshots with lightbox) */}
            <div className="mb-6 lg:mb-8">
              <ProductGalleryGrid title={product.title} images={galleryImages} />
            </div>

            {/* Mobile / Tablet Details Paper (Shown above description on smaller viewports) */}
            <div className="block lg:hidden mb-8">
              <ProductDetailsPaper
                product={product}
                onAddToCart={handleAddToCart}
                onWatchAd={(p) => setWatchAdProduct(p)}
                className="bg-white dark:bg-[#212121] p-4 rounded-xl border border-gray-200 dark:border-[#333333] shadow-sm"
              />
            </div>

            {/* Content Layout: Left main column + Right specs sidebar */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              {/* Left Main Column: Description, Features, Social Share (No instructor / reviews) */}
              <div className="flex-1 min-w-0 space-y-8">
                {/* Description Box */}
                <div className="space-y-4">
                  <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                    Overview & Details
                  </h2>
                  <div className="text-sm md:text-base leading-relaxed text-gray-600 dark:text-[#a8a8a8]">
                    <p>{product.description}</p>
                  </div>
                </div>

                {/* Key Features List */}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-[#333333]">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                      Key Highlights & Features
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {product.features.map((feat, idx) => (
                        <li
                          key={`feat-${idx}`}
                          className="flex items-start gap-2.5 text-xs md:text-sm text-gray-600 dark:text-[#a8a8a8]"
                        >
                          <CheckCircle2 className="h-4 w-4 text-[#009f7f] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Social Share component */}
                <ProductSocialShare productTitle={product.title} />
              </div>

              {/* Right Column: Information Specs */}
              <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0">
                <ProductInformationCard
                  specifications={product.specifications}
                  category={product.category}
                />
              </div>
            </div>

            {/* Related Products Grid */}
            <ProductRelatedGrid products={relatedProducts} />
          </div>
        </main>
      </div>

      {/* Sticky Bottom Bar for Desktop (exact Pixer single product bar) */}
      <div
        className={`fixed bottom-0 right-0 z-30 hidden h-[90px] w-full border-t border-gray-200 dark:border-[#333333] bg-white/95 dark:bg-[#212121]/95 backdrop-blur-md px-7 py-4 shadow-xl lg:flex items-center justify-between transition-all duration-300 ${
          isSidebarCollapsed ? "pl-[calc(4.5rem+1.75rem)]" : "pl-[calc(15rem+1.75rem)]"
        }`}
      >
        <ProductDetailsPaper
          product={product}
          onAddToCart={handleAddToCart}
          onWatchAd={(p) => setWatchAdProduct(p)}
          isStickyBar
        />
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Watch Ad Modal */}
      <WatchAdModal
        product={watchAdProduct}
        onClose={() => setWatchAdProduct(null)}
        onUnlock={(unlockedProd) => {
          handleAddToCart(unlockedProd);
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        products={allProducts}
        onSelectProduct={(selected) => {
          setIsSearchModalOpen(false);
          router.push(getProductUrl(selected.slug));
        }}
      />

      {/* Seller Application Modal */}
      <SellerModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
      />

      {/* User Account / Profile Modal */}
      <UserAccountModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      />
    </div>
  );
};
