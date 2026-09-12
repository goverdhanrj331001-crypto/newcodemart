"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { PreviewIcon } from "./pixer-icons";

interface ProductGalleryGridProps {
  title: string;
  images: string[];
}

export const ProductGalleryGrid: React.FC<ProductGalleryGridProps> = ({
  title,
  images,
}) => {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const displayImages = images.length > 0 ? images : [
    "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/16.jpg",
    "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/34.jpg",
  ];

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((prev) => ((prev ?? 0) + 1) % displayImages.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((prev) =>
        (prev ?? 0) === 0 ? displayImages.length - 1 : (prev ?? 0) - 1
      );
    }
  };

  return (
    <>
      <div
        id="product-gallery-grid"
        className="grid gap-4 sm:grid-cols-2 lg:gap-6"
      >
        {displayImages.map((src, index) => (
          <div
            key={`gallery-img-${index}`}
            id={`gallery-item-${index}`}
            onClick={() => openLightbox(index)}
            className="group relative aspect-[3/2] w-full overflow-hidden rounded border border-[#333333] bg-[#212121] cursor-pointer shadow-sm transition-all hover:border-[#3e3e3e]"
          >
            <Image
              alt={`${title} preview screenshot ${index + 1}`}
              src={src}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
              className="object-cover transition-transform duration-300 group-hover:scale-103"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181818]/90 text-xs font-medium text-white backdrop-blur-xs border border-[#3e3e3e]">
                <PreviewIcon className="h-3.5 w-3.5 text-[#009f7f]" />
                <span>Enlarge</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && (
        <div
          id="product-gallery-lightbox"
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#262626] border border-[#3e3e3e] text-[#a8a8a8] hover:text-white hover:bg-[#333333] transition-colors cursor-pointer"
            aria-label="Close image viewer"
          >
            <X className="h-5 w-5" />
          </button>

          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#262626]/80 text-white hover:bg-[#333333] transition-colors cursor-pointer border border-[#3e3e3e]"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#262626]/80 text-white hover:bg-[#333333] transition-colors cursor-pointer border border-[#3e3e3e]"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full aspect-[16/10] overflow-hidden rounded border border-[#333333] bg-[#181818] shadow-2xl"
          >
            <Image
              alt={`${title} full size`}
              src={displayImages[activeLightboxIndex]}
              fill
              className="object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#212121]/90 px-3 py-1 rounded-full text-xs text-[#a8a8a8] border border-[#3e3e3e]">
              {activeLightboxIndex + 1} / {displayImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

