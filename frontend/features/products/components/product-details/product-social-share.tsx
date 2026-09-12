"use client";

import React, { useState } from "react";
import { LinkIcon } from "./pixer-icons";

interface ProductSocialShareProps {
  productTitle: string;
  className?: string;
}

export const ProductSocialShare: React.FC<ProductSocialShareProps> = ({
  productTitle,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnTwitter = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`Check out ${productTitle} on Pixer!`);
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
    }
  };

  const shareOnFacebook = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    }
  };

  const shareOnLinkedIn = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
    }
  };

  return (
    <div
      id="product-social-share"
      className={`flex text-[13px] items-center pt-5 border-t border-gray-200 dark:border-[#333333] ${className}`}
    >
      <div className="flex-shrink-0 pr-4 text-gray-500 dark:text-[#a8a8a8] sm:w-36 font-medium">
        Share This Item:
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3 items-center">
        {/* Twitter */}
        <button
          type="button"
          onClick={shareOnTwitter}
          title="Share on X / Twitter"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#3e3e3e] text-gray-600 dark:text-[#a8a8a8] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors cursor-pointer shadow-2xs"
        >
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={shareOnFacebook}
          title="Share on Facebook"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#3e3e3e] text-gray-600 dark:text-[#a8a8a8] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors cursor-pointer shadow-2xs"
        >
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        {/* LinkedIn */}
        <button
          type="button"
          onClick={shareOnLinkedIn}
          title="Share on LinkedIn"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#3e3e3e] text-gray-600 dark:text-[#a8a8a8] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors cursor-pointer shadow-2xs"
        >
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        </button>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopy}
          title="Copy Link"
          className="flex h-8 flex-shrink-0 items-center rounded-full border border-gray-200 dark:border-[#3e3e3e] bg-white dark:bg-transparent px-3 text-gray-600 dark:text-[#a8a8a8] hover:bg-gray-100 dark:hover:bg-[#262626] hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer shadow-2xs"
        >
          <LinkIcon className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-[#e6e6e6]" />
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </button>
      </div>
    </div>
  );
};

