"use client";

import React from "react";
import Image from "next/image";
import { X, Clock, BookOpen, Star, CheckCircle, Award, Check, Users, Sparkles } from "lucide-react";
import { Course } from "../types/course.types";

interface CourseDetailModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (courseId: string) => void;
  isEnrolled: boolean;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isOpen,
  onClose,
  onEnroll,
  isEnrolled,
}) => {
  if (!isOpen || !course) return null;

  return (
    <div
      id="course-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/90 sticky top-0 z-20 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              {course.category}
            </span>
            <span className="text-xs text-neutral-400">Level: {course.level}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Header Info */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{course.title}</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">{course.description}</p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-neutral-800/60 border border-neutral-800 rounded-lg p-3 text-center">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 mb-1">
                <Clock className="w-3.5 h-3.5" />
              </span>
              <p className="text-white text-xs font-bold">{course.duration}</p>
              <p className="text-neutral-500 text-[10px]">On-Demand Video</p>
            </div>

            <div className="bg-neutral-800/60 border border-neutral-800 rounded-lg p-3 text-center">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/10 text-blue-400 mb-1">
                <BookOpen className="w-3.5 h-3.5" />
              </span>
              <p className="text-white text-xs font-bold">{course.lessons} Lessons</p>
              <p className="text-neutral-500 text-[10px]">Exercises Included</p>
            </div>

            <div className="bg-neutral-800/60 border border-neutral-800 rounded-lg p-3 text-center">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/10 text-amber-400 mb-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </span>
              <p className="text-white text-xs font-bold">{course.rating.toFixed(1)} / 5.0</p>
              <p className="text-neutral-500 text-[10px]">{course.reviewsCount} Reviews</p>
            </div>

            <div className="bg-neutral-800/60 border border-neutral-800 rounded-lg p-3 text-center">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 mb-1">
                <Users className="w-3.5 h-3.5" />
              </span>
              <p className="text-white text-xs font-bold">{course.studentsCount.toLocaleString()}+</p>
              <p className="text-neutral-500 text-[10px]">Active Students</p>
            </div>
          </div>

          {/* What you will learn */}
          <div className="bg-neutral-800/40 border border-neutral-800 rounded-xl p-5">
            <h4 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              What You Will Build &amp; Master
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum breakdown */}
          <div>
            <h4 className="text-white text-sm font-bold mb-3">Course Curriculum Modules</h4>
            <div className="space-y-2">
              {course.curriculum.map((module, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-neutral-700 text-neutral-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-white text-xs sm:text-sm font-medium">{module.title}</p>
                  </div>
                  <div className="text-right text-xs text-neutral-400 shrink-0">
                    <span>{module.lessons} lessons</span>
                    <span className="mx-2">•</span>
                    <span className="text-neutral-500">{module.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Card */}
          <div className="flex items-center gap-4 p-4 bg-neutral-800/50 border border-neutral-800 rounded-xl">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-800 shrink-0">
              <Image
                src={course.instructor.avatar}
                alt={course.instructor.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-bold">{course.instructor.name}</p>
              <p className="text-emerald-400 text-xs">{course.instructor.role || "Course Instructor"}</p>
              <p className="text-neutral-500 text-xs mt-0.5">Top-rated instructor on Pixer Digital Marketplace</p>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-900/90 backdrop-blur-xs">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-emerald-400 text-2xl font-bold">{course.price}</span>
              {course.originalPrice && (
                <span className="text-neutral-500 text-xs line-through">{course.originalPrice}</span>
              )}
            </div>
            <p className="text-[11px] text-neutral-500">Full lifetime access with future updates</p>
          </div>

          <button
            type="button"
            onClick={() => onEnroll(course.id)}
            disabled={isEnrolled}
            className={`px-8 py-3 rounded-lg text-sm font-bold transition-all cursor-pointer shadow-lg ${
              isEnrolled
                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40 cursor-default"
                : "bg-emerald-500 hover:bg-emerald-400 text-black hover:scale-[1.02]"
            }`}
          >
            {isEnrolled ? "Already Enrolled" : `Enroll Now ${course.price}`}
          </button>
        </div>
      </div>
    </div>
  );
};
