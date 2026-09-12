"use client";

import React from "react";
import Image from "next/image";
import { CartItem } from "../types/navigation.types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      if (item.price === "Free") return sum;
      const num = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
      return sum + num * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        id="cart-drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white dark:bg-neutral-900 border-l border-gray-200 dark:border-zinc-800 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-neutral-800/80">
            <div className="flex items-center gap-2">
              <img
                src="https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/icon-5.svg"
                alt="Cart"
                className="w-5 h-5"
              />
              <h2 className="text-gray-900 dark:text-white font-semibold text-lg">Your Cart</h2>
              <span className="text-xs bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300 px-2 py-0.5 rounded-full font-medium">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              id="cart-drawer-close-btn"
              type="button"
              onClick={onClose}
              className="text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white p-1 rounded-md transition-colors cursor-pointer"
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

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100 dark:divide-zinc-800/60 no-scrollbar">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-gray-400 dark:text-zinc-500">
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 dark:text-zinc-500 text-xs max-w-xs mb-6">
                  Browse through our catalog of digital themes, templates, and assets to add products to your cart.
                </p>
                <button
                  id="cart-empty-shop-btn"
                  type="button"
                  onClick={onClose}
                  className="bg-[#009f7f] hover:bg-[#008f72] text-white text-xs font-semibold px-5 py-2.5 rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex items-center gap-4">
                  <div className="relative w-16 h-12 rounded overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0 border border-gray-200 dark:border-zinc-700">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 dark:text-white text-sm font-semibold truncate">
                      {item.title}
                    </h4>
                    <p className="text-gray-500 dark:text-zinc-500 text-xs">By {item.author}</p>
                    <div className="text-[#009f7f] dark:text-emerald-400 text-xs font-bold mt-1">
                      {item.price}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 p-1 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 dark:border-zinc-800 p-6 bg-gray-50 dark:bg-neutral-900 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-neutral-400 font-medium">Subtotal</span>
                <span className="text-gray-900 dark:text-white font-bold text-lg">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-500 dark:text-zinc-500 text-xs">
                Taxes and licensing calculated at checkout. Instant digital file download.
              </p>
              <button
                id="cart-checkout-btn"
                type="button"
                onClick={onCheckout}
                className="w-full bg-[#009f7f] hover:bg-[#008f72] text-white font-semibold py-3 px-4 rounded-md transition-colors text-center text-sm shadow-md cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
