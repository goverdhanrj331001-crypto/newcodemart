"use client";

import React from "react";
import { Product } from "../types/product.types";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  onPreview?: (product: Product) => void;
  onDetails?: (product: Product) => void;
  onAuthorClick?: (authorName: string) => void;
  onAddToCart?: (product: Product) => void;
  onWatchAd?: (product: Product) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onPreview,
  onDetails,
  onAuthorClick,
  onAddToCart,
  onWatchAd,
  onLoadMore,
  hasMore = true,
  isLoadingMore = false,
}) => {
  if (products.length === 0) {
    return (
      <div
        id="products-empty-state"
        className="flex flex-col items-center justify-center py-20 px-4 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-white text-lg font-medium mb-1">No products found</h3>
        <p className="text-neutral-500 text-sm max-w-md">
          We couldn&apos;t find any digital products matching your current filter. Try selecting another category or clear your search query.
        </p>
      </div>
    );
  }

  return (
    <div
      id="product-feed-section"
      className="box-border min-h-[auto] min-w-[auto] w-full pt-5 pb-9 px-4 md:pt-6 md:pb-12 md:px-7"
    >
      {/* Responsive Cards Grid: Mobile 1 col, Tablet 2 cols, Laptop/Desktop 3 cols */}
      <div
        id="product-cards-grid"
        className="box-border gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 md:gap-5"
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPreview={onPreview}
            onDetails={onDetails}
            onAuthorClick={onAuthorClick}
            onAddToCart={onAddToCart}
            onWatchAd={onWatchAd}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div
          id="product-load-more-container"
          className="content-center box-border grid justify-center mt-8 md:mt-10"
        >
          <button
            id="product-load-more-btn"
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="text-white font-semibold items-center bg-emerald-500 gap-x-2 flex h-auto justify-center min-h-[46px] min-w-[auto] text-center px-6 py-3 rounded md:h-12 md:px-8 hover:bg-emerald-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoadingMore ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              "Load more"
            )}
          </button>
        </div>
      )}
    </div>
  );
};
