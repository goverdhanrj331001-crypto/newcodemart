"use client";

import React from "react";
import Image from "next/image";
import { Product } from "../types/product.types";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;
  // Courses must NEVER be shown as a pop-up modal per user directive
  if (product.id.startsWith("course-")) return null;

  const isCourse = false;
  const courseItem = product as Record<string, any>;
  const cleanSlug = product.slug.replace(/^\/?(products|courses)\//, "").replace(/^\/+/, "");
  const detailsUrl = isCourse ? `/courses/${cleanSlug}` : `/products/${cleanSlug}`;

  return (
    <div
      id="product-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="product-detail-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-neutral-800 border border-zinc-700 rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8"
      >
        {/* Banner image */}
        <div className="relative aspect-[16/9] w-full bg-neutral-900">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
          <button
            id="detail-modal-close-btn"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-full">
                {product.category}
              </span>
              {courseItem.durationFormatted && (
                <span className="text-[11px] font-medium text-neutral-400 bg-neutral-900 border border-zinc-700/70 px-2 py-0.5 rounded-md">
                  ⏱ {courseItem.durationFormatted}
                </span>
              )}
              {courseItem.level && (
                <span className="text-[11px] font-medium text-neutral-400 bg-neutral-900 border border-zinc-700/70 px-2 py-0.5 rounded-md">
                  {courseItem.level}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {product.price}
              </span>
              {product.originalPrice && (
                <del className="text-sm text-neutral-500 line-through">
                  {product.originalPrice}
                </del>
              )}
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">
            {product.title}
          </h2>

          <p className="text-neutral-300 text-sm leading-relaxed mb-6">
            {product.description ||
              "High quality digital asset crafted by industry professionals. Includes complete source files, documentation, and lifetime updates."}
          </p>

          {/* Features list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-400 mb-6">
            {(product.features && product.features.length > 0
              ? product.features.slice(0, 4)
              : [
                  "Commercial license included",
                  "100% responsive design",
                  "Clean documented code",
                  "6 months author support",
                ]
            ).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              id="detail-modal-add-cart-btn"
              type="button"
              onClick={() => {
                onAddToCart?.(product);
                onClose();
              }}
              className="w-full sm:flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center text-sm cursor-pointer shadow-lg shadow-emerald-950"
            >
              {product.price === "Free"
                ? isCourse
                  ? "Enroll Now (Free)"
                  : "Download Now (Free)"
                : isCourse
                ? `Enroll Course (${product.price})`
                : `Add to Cart (${product.price})`}
            </button>
            <a
              id="detail-modal-view-page-btn"
              href={detailsUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm text-center"
            >
              <span>Full Details Page</span>
              <span>→</span>
            </a>
            <button
              id="detail-modal-cancel-btn"
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-neutral-300 font-medium py-3 px-4 rounded-lg transition-colors text-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
