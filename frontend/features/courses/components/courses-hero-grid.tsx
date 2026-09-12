"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { FEATURED_HERO_COURSES } from "../data/courses.data";

interface CoursesHeroGridProps {
  onSelectHeroCourse?: (courseId: string) => void;
}

export const CoursesHeroGrid: React.FC<CoursesHeroGridProps> = ({
  onSelectHeroCourse,
}) => {
  return (
    <div
      id="courses-hero-grid"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mb-8"
    >
      {FEATURED_HERO_COURSES.map((hero) => (
        <div
          key={hero.id}
          id={`hero-card-${hero.id}`}
          onClick={() => onSelectHeroCourse?.(hero.id)}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${hero.gradientClass} p-6 sm:p-7 text-white shadow-sm flex flex-col justify-between min-h-[230px] transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer group`}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          {/* Left Text Content */}
          <div className="relative z-10 max-w-[62%] sm:max-w-[65%]">
            <span
              className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full border mb-3 ${hero.tagColor}`}
            >
              {hero.tag}
            </span>
            <h2 className="text-xl sm:text-[22px] font-bold text-white tracking-tight leading-snug mb-2 group-hover:text-emerald-300 transition-colors">
              {hero.title}
            </h2>
            <p className="text-white/80 text-xs sm:text-[13px] leading-relaxed line-clamp-2 mb-6">
              {hero.subtitle}
            </p>
          </div>

          {/* Bottom Action Button */}
          <div className="relative z-10">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-semibold bg-white text-gray-950 px-4 py-2.5 rounded-lg shadow-sm hover:bg-slate-100 transition-colors group/btn cursor-pointer"
            >
              <span>{hero.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>

          {/* Right Graphic Mockup Matching the Screenshot */}
          <div className="absolute right-3 bottom-4 w-[36%] max-w-[155px] pointer-events-none flex items-center justify-center">
            {hero.graphicType === "nextjs-react" && (
              <div className="relative w-full aspect-square flex items-center justify-center">
                {/* Glowing React atom */}
                <div className="absolute -top-3 right-2 w-10 h-10 text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)] animate-pulse">
                  <svg viewBox="0 0 115.3 100" fill="currentColor">
                    <ellipse cx="57.65" cy="50" rx="14" ry="46" transform="matrix(0.866 -0.5 0.5 0.866 -17.27 36.3)" fill="none" stroke="currentColor" strokeWidth="4.5" />
                    <ellipse cx="57.65" cy="50" rx="14" ry="46" transform="matrix(0.866 0.5 -0.5 0.866 32.73 -20.6)" fill="none" stroke="currentColor" strokeWidth="4.5" />
                    <ellipse cx="57.65" cy="50" rx="46" ry="14" fill="none" stroke="currentColor" strokeWidth="4.5" />
                    <circle cx="57.65" cy="50" r="7.5" fill="currentColor" />
                  </svg>
                </div>
                {/* NEXT.js Badge */}
                <div className="absolute -top-1 left-1 bg-black/90 border border-white/20 rounded px-2 py-0.5 text-[9px] font-bold tracking-wider font-mono shadow-md">
                  NEXT<span className="text-white/60">.JS</span>
                </div>
                {/* Mini Dashboard Window Mockup */}
                <div className="w-full bg-[#0a182c]/95 border border-cyan-400/40 rounded-xl p-2.5 shadow-2xl backdrop-blur-xs transform rotate-1 mt-3">
                  <div className="flex items-center gap-1 mb-2 pb-1.5 border-b border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-full h-2.5 bg-cyan-500/30 rounded" />
                    <div className="w-4/5 h-2 bg-white/20 rounded" />
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <div className="h-6 bg-cyan-600/25 rounded-md" />
                      <div className="h-6 bg-blue-600/25 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {hero.graphicType === "figma-uiux" && (
              <div className="relative w-full aspect-square flex items-center justify-center">
                {/* 3D Figma logo */}
                <div className="absolute -top-3 left-2 w-8 h-12 drop-shadow-[0_4px_12px_rgba(168,85,247,0.6)]">
                  <svg viewBox="0 0 38 57" fill="none">
                    <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
                    <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
                    <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
                    <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
                    <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
                  </svg>
                </div>
                {/* Floating UI cards & preview */}
                <div className="w-full bg-purple-950/90 border border-purple-400/50 rounded-xl p-2.5 shadow-2xl transform -rotate-2 mt-3">
                  <div className="w-full h-11 bg-purple-900/40 rounded-md border border-purple-500/30 p-1.5 mb-1.5 flex flex-col justify-center">
                    <div className="w-3/4 h-2 bg-purple-300/60 rounded mb-1" />
                    <div className="w-1/2 h-1.5 bg-purple-400/40 rounded" />
                  </div>
                  <div className="w-full h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                </div>
              </div>
            )}

            {hero.graphicType === "python-code" && (
              <div className="relative w-full aspect-square flex items-center justify-center">
                {/* Python 3D logo */}
                <div className="absolute -top-4 right-2 w-10 h-10 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]">
                  <svg viewBox="0 0 110 110" fill="none">
                    <path d="M53.8 2C27.5 2 29.1 13.4 29.1 13.4L29.2 25.3H54.4V29H18.3C18.3 29 2 27.2 2 54.3C2 81.4 16.3 80.3 16.3 80.3H26.3V67.8C26.3 67.8 25.7 52.8 40.9 52.8H65.8C65.8 52.8 79.5 53.4 79.5 39.9V14.8C79.5 14.8 82.5 2 53.8 2ZM43.4 10.3C46.8 10.3 49.5 13 49.5 16.4C49.5 19.8 46.8 22.5 43.4 22.5C40 22.5 37.3 19.8 37.3 16.4C37.3 13 40 10.3 43.4 10.3Z" fill="#387EB8" />
                    <path d="M56.2 108C82.5 108 80.9 96.6 80.9 96.6L80.8 84.7H55.6V81H91.7C91.7 81 108 82.8 108 55.7C108 28.6 93.7 29.7 93.7 29.7H83.7V42.2C83.7 42.2 84.3 57.2 69.1 57.2H44.2C44.2 57.2 30.5 56.6 30.5 70.1V95.2C30.5 95.2 27.5 108 56.2 108ZM66.6 99.7C63.2 99.7 60.5 97 60.5 93.6C60.5 90.2 63.2 87.5 66.6 87.5C70 87.5 72.7 90.2 72.7 93.6C72.7 97 70 99.7 66.6 99.7Z" fill="#FFE052" />
                  </svg>
                </div>
                {/* IDE Code window */}
                <div className="w-full bg-[#051119] border border-emerald-500/40 rounded-xl p-2.5 shadow-2xl font-mono text-[8px] text-emerald-300 transform rotate-1 mt-3">
                  <div className="flex items-center gap-1 mb-1.5 pb-1 border-b border-white/10">
                    <span className="text-[7px] text-slate-400 font-sans">main.py</span>
                  </div>
                  <div className="space-y-1 text-[7px] leading-tight">
                    <p className="text-yellow-400">def <span className="text-cyan-300 font-semibold">train_ai</span>():</p>
                    <p className="pl-2.5 text-white">data = load()</p>
                    <p className="pl-2.5 text-emerald-400 font-medium">return True</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

