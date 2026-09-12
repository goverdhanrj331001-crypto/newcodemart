"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Play, Clock, BookOpen, Star, CheckCircle, Award, Volume2 } from "lucide-react";
import { Course } from "../types/course.types";

interface CoursePreviewModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (courseId: string) => void;
  isEnrolled: boolean;
}

export const CoursePreviewModal: React.FC<CoursePreviewModalProps> = ({
  course,
  isOpen,
  onClose,
  onEnroll,
  isEnrolled,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen || !course) return null;

  return (
    <div
      id="course-preview-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Video Player Preview Area */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className={`object-cover opacity-70 transition-transform duration-500 ${isPlaying ? "scale-105 filter brightness-50" : ""}`}
            referrerPolicy="no-referrer"
          />

          {!isPlaying ? (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="relative z-10 w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 cursor-pointer"
            >
              <Play className="w-7 h-7 fill-black ml-1" />
            </button>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 bg-black/80 rounded-xl max-w-sm border border-neutral-800">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Playing Sample Lesson Preview
              </div>
              <p className="text-neutral-300 text-xs mb-4">
                Module 1: Architecture &amp; Fundamentals Setup (3:45)
              </p>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mb-3">
                <div className="bg-emerald-500 h-full w-2/3 animate-pulse" />
              </div>
              <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="text-xs text-neutral-400 hover:text-white px-3 py-1 bg-neutral-800 rounded transition-colors"
              >
                Pause Trailer
              </button>
            </div>
          )}

          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
            <span className="bg-black/80 backdrop-blur-xs text-emerald-400 text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald-500/20">
              Free Sample Video
            </span>
            <span className="bg-black/80 backdrop-blur-xs text-neutral-300 text-[11px] px-2 py-0.5 rounded">
              HD 1080p
            </span>
          </div>
        </div>

        {/* Modal Content Info */}
        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                <span className="text-emerald-400 font-semibold">{course.category}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {course.duration}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {course.lessons} Lessons
                </span>
              </div>
              <h3 className="text-white text-lg md:text-xl font-bold">{course.title}</h3>
            </div>

            <div className="text-right shrink-0">
              <span className="text-emerald-400 text-xl font-bold">{course.price}</span>
              {course.originalPrice && (
                <p className="text-neutral-500 text-xs line-through">{course.originalPrice}</p>
              )}
            </div>
          </div>

          <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-4">
            {course.description}
          </p>

          {/* Instructor & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-800 shrink-0">
                <Image
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">{course.instructor.name}</p>
                <p className="text-neutral-500 text-[11px]">{course.instructor.role || "Course Instructor"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEnroll(course.id)}
                disabled={isEnrolled}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  isEnrolled
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40 cursor-default"
                    : "bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                }`}
              >
                {isEnrolled ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Enrolled in Course
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-black" />
                    Enroll Now {course.price}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
