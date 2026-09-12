"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageSquarePlus, X, Check } from "lucide-react";
import { Review } from "../../types/product.types";
import { StarIcon, LikeIcon } from "./pixer-icons";

interface ProductReviewsSectionProps {
  productId: string;
  rating?: number;
  totalReviews?: number;
  reviews?: Review[];
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  rating = 4.9,
  totalReviews = 14,
  reviews = [],
}) => {
  const [reviewList, setReviewList] = useState<Review[]>(
    reviews.length > 0
      ? reviews
      : [
          {
            id: "rev-default-1",
            userName: "Alexandre Moreau",
            userAvatar: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/109.jpg",
            rating: 5,
            date: "August 24, 2026",
            comment:
              "Outstanding code quality and ultra-fast page speed! We launched our client e-commerce store in just 3 days using this asset. The author answered my support ticket in less than 2 hours.",
            helpfulCount: 12,
          },
          {
            id: "rev-default-2",
            userName: "Sarah Jenkins",
            userAvatar: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/157.jpg",
            rating: 5,
            date: "July 12, 2026",
            comment:
              "The best digital product we have bought this year. Clean typography, responsive layouts, and very easy to customize with extensive documentation.",
            helpfulCount: 8,
          },
        ]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      userName: newName.trim(),
      rating: newRating,
      date: "Just now",
      comment: newComment.trim(),
      helpfulCount: 0,
    };

    setReviewList([newRev, ...reviewList]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
      setNewName("");
      setNewComment("");
    }, 1500);
  };

  const handleHelpful = (id: string) => {
    setReviewList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
    );
  };

  return (
    <div id="product-reviews-section" className="space-y-6 pt-6 border-t border-[#333333]">
      {/* Header with Title & Write Review Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base md:text-lg font-medium text-white">Ratings & Reviews</h3>
          <p className="text-[13px] text-[#a8a8a8]">Real feedback from verified marketplace buyers</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded border border-[#3e3e3e] bg-[#262626] hover:bg-[#333333] text-white px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer"
        >
          <MessageSquarePlus className="h-3.5 w-3.5 text-[#009f7f]" />
          <span>Write a review</span>
        </button>
      </div>

      {/* Ratings Summary Card */}
      <div className="rounded border border-[#333333] bg-[#212121] p-5 flex flex-col md:flex-row items-center gap-6">
        {/* Score box */}
        <div className="flex flex-col items-center justify-center text-center md:border-r md:border-[#333333] md:pr-8 shrink-0">
          <div className="text-4xl font-bold text-white mb-1">{rating.toFixed(1)}</div>
          <div className="flex items-center gap-1 text-amber-400 mb-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className={`h-4 w-4 ${s <= Math.round(rating) ? "text-amber-400" : "text-[#444444]"}`}>
                <StarIcon className="h-4 w-4" />
              </span>
            ))}
          </div>
          <div className="text-xs text-[#a8a8a8]">{totalReviews} verified ratings</div>
        </div>

        {/* Progress bars */}
        <div className="flex-1 w-full space-y-2 text-xs text-[#a8a8a8]">
          {[
            { star: 5, pct: "92%" },
            { star: 4, pct: "8%" },
            { star: 3, pct: "0%" },
            { star: 2, pct: "0%" },
            { star: 1, pct: "0%" },
          ].map((bar) => (
            <div key={bar.star} className="flex items-center gap-3">
              <span className="w-10 shrink-0 flex items-center gap-1">
                {bar.star} <StarIcon className="h-3 w-3 text-amber-400" />
              </span>
              <div className="h-2 flex-1 rounded-full bg-[#262626] overflow-hidden">
                <div
                  className="h-full bg-[#009f7f] rounded-full"
                  style={{ width: bar.pct }}
                />
              </div>
              <span className="w-8 text-right text-[#737373]">{bar.pct}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviewList.map((rev) => (
          <div
            key={rev.id}
            className="rounded border border-[#333333] bg-[#212121] p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-[#262626] border border-[#3e3e3e] flex items-center justify-center text-xs font-semibold text-white">
                  {rev.userAvatar ? (
                    <Image
                      alt={rev.userName}
                      src={rev.userAvatar}
                      fill
                      sizes="32px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    rev.userName.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-white">{rev.userName}</span>
                    <span className="text-[10px] text-[#009f7f] bg-[#009f7f]/10 px-1.5 py-0.5 rounded border border-[#009f7f]/20">
                      Verified Buyer
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#737373] mt-0.5">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={`h-3 w-3 ${s <= rev.rating ? "text-amber-400" : "text-[#444444]"}`}>
                          <StarIcon className="h-3 w-3" />
                        </span>
                      ))}
                    </div>
                    <span>•</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleHelpful(rev.id)}
                  className="flex items-center gap-1.5 text-xs text-[#a8a8a8] hover:text-white transition-colors cursor-pointer bg-[#262626] hover:bg-[#333333] border border-[#3e3e3e] px-2.5 py-1 rounded"
                >
                  <LikeIcon className="h-3.5 w-3.5 text-[#737373]" />
                  <span>{rev.helpfulCount || 0}</span>
                </button>
              </div>
            </div>

            <p className="text-[13px] text-[#a8a8a8] leading-relaxed pl-10">
              {rev.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded border border-[#333333] bg-[#212121] p-6 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#737373] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-semibold text-white mb-1">Write a Review</h3>
            <p className="text-xs text-[#a8a8a8] mb-4">Share your experience with other creators.</p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#009f7f]/20 text-[#009f7f]">
                  <Check className="h-6 w-6" />
                </div>
                <div className="text-sm font-medium text-white">Thank you!</div>
                <div className="text-xs text-[#a8a8a8]">Your review was submitted successfully.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#a8a8a8] mb-1">Rating</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewRating(num)}
                        className="cursor-pointer p-1"
                      >
                        <span className={num <= newRating ? "text-amber-400" : "text-[#444444]"}>
                          <StarIcon className="h-6 w-6" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#a8a8a8] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full rounded border border-[#3e3e3e] bg-[#181818] px-3 py-2 text-xs text-white placeholder-[#737373] focus:border-[#009f7f] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#a8a8a8] mb-1">Your Review</label>
                  <textarea
                    rows={4}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Describe the quality, ease of installation, and features..."
                    className="w-full rounded border border-[#3e3e3e] bg-[#181818] px-3 py-2 text-xs text-white placeholder-[#737373] focus:border-[#009f7f] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded border border-[#3e3e3e] px-4 py-2 text-xs font-medium text-[#a8a8a8] hover:bg-[#262626] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-[#009f7f] hover:bg-[#018066] px-4 py-2 text-xs font-medium text-white transition-colors cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

