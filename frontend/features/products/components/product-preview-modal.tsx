"use client";

import React from "react";
import Image from "next/image";
import { Product } from "../types/product.types";

interface ProductPreviewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  return (
    <div
      id="product-preview-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="product-preview-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-neutral-800 border border-zinc-700 rounded-lg max-w-4xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700/80 bg-neutral-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
              <Image
                src={product.author.avatar}
                alt={product.author.name}
                fill
                sizes="32px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="truncate">
              <h3 className="text-white font-semibold text-base truncate">
                {product.title}
              </h3>
              <p className="text-zinc-400 text-xs">
                By {product.author.name} • {product.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-bold text-lg bg-zinc-900 px-3 py-1 rounded-full border border-zinc-700">
              {product.price}
            </span>
            <button
              id="preview-modal-close-btn"
              type="button"
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
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
        </div>

        {/* Preview image */}
        <div className="relative aspect-video w-full bg-neutral-900 flex items-center justify-center overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="100vw"
            className="object-contain"
            priority
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-t border-zinc-700/80">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>⭐️ {product.rating || 4.9} rating</span>
            <span>•</span>
            <span>{product.salesCount || 100}+ downloads</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="preview-modal-close-action"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            >
              Close
            </button>
            <button
              id="preview-modal-add-cart-btn"
              type="button"
              onClick={() => {
                onAddToCart?.(product);
                onClose();
              }}
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded transition-colors"
            >
              {product.price === "Free" ? "Download Free" : `Get for ${product.price}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
