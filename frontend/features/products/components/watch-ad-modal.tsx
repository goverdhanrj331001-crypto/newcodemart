"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Play, CheckCircle2, Download, Sparkles } from "lucide-react";
import { Product } from "../types/product.types";

interface WatchAdModalProps {
  product: Product | null;
  onClose: () => void;
  onUnlock?: (product: Product) => void;
}

interface WatchAdDialogProps {
  product: Product;
  onClose: () => void;
  onUnlock?: (product: Product) => void;
}

const WatchAdDialog: React.FC<WatchAdDialogProps> = ({
  product,
  onClose,
  onUnlock,
}) => {
  const [adsRemaining, setAdsRemaining] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          setAdsRemaining((currAds) => {
            const nextAds = currAds - 1;
            if (nextAds <= 0) {
              setIsUnlocked(true);
              if (onUnlock) onUnlock(product);
              return 0;
            }
            return nextAds;
          });
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, product, onUnlock]);

  const handleStartAd = () => {
    setCountdown(5);
    setIsPlaying(true);
  };

  return (
    <div
      id="watch-ad-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="watch-ad-modal-content"
        className="relative w-full max-w-lg bg-[#212121] border border-[#333333] rounded-2xl p-6 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Info Header */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-neutral-800">
          <div className="relative w-14 h-12 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              Free Access via Sponsor Ads
            </span>
            <h3 className="text-sm font-semibold text-white truncate">
              {product.title}
            </h3>
            <p className="text-xs text-neutral-400">
              Normal price: <span className="text-white font-medium">{product.price}</span>
            </p>
          </div>
        </div>

        {/* Unlocked State */}
        {isUnlocked ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Congratulations!</h4>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                You have watched all 4 sponsor ads. You can now download this item for free!
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  alert(`Starting download for ${product.title}...`);
                  onClose();
                }}
                className="inline-flex items-center gap-2 bg-[#009f7f] hover:bg-[#008f72] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-lg shadow-emerald-900/30"
              >
                <Download className="w-4 h-4" />
                <span>Download Free Now</span>
              </button>
            </div>
          </div>
        ) : (
          /* Ad Playing or Ad Start state */
          <div className="space-y-5">
            {/* Progress indicator */}
            <div className="bg-[#181818] p-3.5 rounded-xl border border-neutral-800">
              <div className="flex items-center justify-between text-xs text-neutral-300 mb-2">
                <span>Ads completed:</span>
                <span className="font-semibold text-emerald-400">
                  {4 - adsRemaining} of 4
                </span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${((4 - adsRemaining) / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Video / Ad Simulator Screen */}
            <div className="relative aspect-video rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center overflow-hidden p-6 text-center">
              {isPlaying ? (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sponsor Ad Playing</span>
                  </div>
                  <div className="text-3xl font-black text-white">{countdown}s</div>
                  <p className="text-xs text-neutral-400">
                    Reward unlocks in {countdown} seconds... Please do not close.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div
                    className="w-12 h-12 bg-white/10 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto cursor-pointer transition-colors"
                    onClick={handleStartAd}
                  >
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">
                      Watch Ad {5 - adsRemaining} of 4
                    </h5>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Short 5-second video ad from our platform partners
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-neutral-400">
                {adsRemaining} ad{adsRemaining > 1 ? "s" : ""} remaining to unlock
              </p>
              {!isPlaying && (
                <button
                  type="button"
                  onClick={handleStartAd}
                  className="inline-flex items-center gap-1.5 bg-[#009f7f] hover:bg-[#008f72] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Ad ({adsRemaining})</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const WatchAdModal: React.FC<WatchAdModalProps> = ({
  product,
  onClose,
  onUnlock,
}) => {
  if (!product) return null;

  return (
    <WatchAdDialog
      key={product.id}
      product={product}
      onClose={onClose}
      onUnlock={onUnlock}
    />
  );
};
