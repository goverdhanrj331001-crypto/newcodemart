"use client";

import React, { useRef, useState } from "react";
import { ChevronRight, ChevronLeft, GraduationCap, Play, Sparkles, Award } from "lucide-react";
import Image from "next/image";

export const CoursesBannerCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 20);
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 560, behavior: "smooth" });
    }
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -560, behavior: "smooth" });
    }
  };

  return (
    <div id="courses-hero-banners" className="relative w-full px-4 pt-4 pb-2 md:px-7 md:pt-6">
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {/* Banner 1: Full-Stack & Next.js Masterclass (Teal/Emerald) */}
        <div className="relative shrink-0 w-[90vw] sm:w-[500px] lg:w-[580px] xl:w-[620px] h-[210px] md:h-[240px] rounded-lg overflow-hidden bg-gradient-to-r from-emerald-900 to-teal-950 p-6 md:p-8 flex items-center justify-between snap-start shadow-md border border-emerald-800/40">
          {/* Left Text Content */}
          <div className="z-10 max-w-[58%] flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-emerald-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Pro Academy Courses
            </span>
            <h2 className="text-white text-lg sm:text-2xl md:text-[25px] font-bold leading-tight tracking-tight">
              Master Full-Stack Next.js 15 &amp; Modern APIs.
            </h2>
            <p className="text-emerald-200/80 text-xs sm:text-sm mt-2 leading-relaxed">
              Step-by-step video courses with real code repositories, source templates, and Discord mentorship.
            </p>
          </div>

          {/* Right Floating Badge Graphic */}
          <div className="relative w-[38%] h-full flex items-center justify-end">
            <div className="relative w-36 md:w-44 h-36 md:h-44 bg-emerald-500/10 rounded-2xl border border-emerald-400/20 p-4 flex flex-col items-center justify-center text-center shadow-xl backdrop-blur-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-black mb-3 shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <p className="text-white text-xs font-bold">120+ Lessons</p>
              <p className="text-emerald-300/80 text-[10px] mt-0.5">Certificate Included</p>
              <div className="mt-2 inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                <Award className="w-3 h-3" />
                4.9/5 Rating
              </div>
            </div>
          </div>
        </div>

        {/* Banner 2: Flutter, Mobile & AI Agents (Indigo/Violet) */}
        <div className="relative shrink-0 w-[90vw] sm:w-[500px] lg:w-[580px] xl:w-[620px] h-[210px] md:h-[240px] rounded-lg overflow-hidden bg-gradient-to-r from-indigo-950 to-purple-900 p-6 md:p-8 flex items-center justify-between snap-start shadow-md border border-indigo-800/40">
          <div className="z-10 max-w-[58%] flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-indigo-400 mb-2">
              <Play className="w-3.5 h-3.5 fill-indigo-400" />
              Interactive Curriculum
            </span>
            <h2 className="text-white text-lg sm:text-2xl md:text-[25px] font-bold leading-tight tracking-tight">
              Flutter 3.x, React Native &amp; Autonomous AI.
            </h2>
            <p className="text-indigo-200/80 text-xs sm:text-sm mt-2 leading-relaxed">
              Build cross-platform iOS/Android apps and LLM agents from scratch with industry leaders.
            </p>
          </div>

          <div className="relative w-[38%] h-full flex items-center justify-end">
            <div className="relative w-36 md:w-44 h-36 md:h-44 bg-indigo-500/10 rounded-2xl border border-indigo-400/20 p-4 flex flex-col items-center justify-center text-center shadow-xl backdrop-blur-xs">
              <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white mb-3 shadow-lg">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
              <p className="text-white text-xs font-bold">HD Video &amp; Code</p>
              <p className="text-indigo-300/80 text-[10px] mt-0.5">Lifetime Access</p>
              <div className="mt-2 inline-flex items-center gap-1 bg-indigo-950/80 text-indigo-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30">
                <Sparkles className="w-3 h-3" />
                Updated 2026
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        type="button"
        onClick={handleScrollRight}
        aria-label="Next banner"
        className="absolute right-6 md:right-9 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer z-20"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {canScrollLeft && (
        <button
          type="button"
          onClick={handleScrollLeft}
          aria-label="Previous banner"
          className="absolute left-6 md:left-9 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer z-20"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
