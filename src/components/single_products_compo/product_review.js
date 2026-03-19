"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

/* ─────────────────────────────────────────────
   Utility: render filled / half / empty stars
───────────────────────────────────────────── */
function StarRating({ rating = 5 }) {
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill={filled ? "#d4a373" : half ? "url(#half)" : "none"}
            stroke="#d4a373"
            strokeWidth={1.5}
          >
            {half && (
              <defs>
                <linearGradient id="half">
                  <stop offset="50%" stopColor="#d4a373" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function ReviewCarousel({ reviews = [] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("next"); // "next" | "prev"
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);

  const total = reviews.length;

  const goTo = useCallback(
    (index, dir = "next") => {
      if (animating || total === 0) return;
      setDirection(dir);
      setAnimating(true);
      setVisible(false);

      setTimeout(() => {
        setCurrent((index + total) % total);
        setVisible(true);
        setTimeout(() => setAnimating(false), 500);
      }, 350);
    },
    [animating, total]
  );

  const next = useCallback(() => goTo(current + 1, "next"), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, "prev"), [current, goTo]);

  // Auto-advance every 6 s
  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(next, 6000);
    return () => clearInterval(timerRef.current);
  }, [next, total]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 6000);
  };

  if (total === 0) {
    return (
      <div className="text-center py-16 text-gray-400 italic tracking-wide text-sm">
        No reviews yet — be the first to share your experience.
      </div>
    );
  }

  const review = reviews[current];

  // Slide-in transforms
  const enterTranslate =
    direction === "next" ? "translateX(40px)" : "translateX(-40px)";

  return (
    <>
      {/* ── Google Font import (Cormorant Garamond) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

        .review-card-enter {
          opacity: 0;
          transform: ${enterTranslate} scale(0.98);
        }
        .review-card-visible {
          opacity: 1;
          transform: translateX(0) scale(1);
          transition: opacity 0.5s cubic-bezier(0.4,0,0.2,1),
                      transform 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .review-card-exit {
          opacity: 0;
          transform: ${direction === "next" ? "translateX(-40px)" : "translateX(40px)"} scale(0.98);
          transition: opacity 0.32s ease, transform 0.32s ease;
        }

        .nav-btn:hover .nav-arrow {
          transform: translateX(2px);
          transition: transform 0.2s ease;
        }
        .nav-btn-prev:hover .nav-arrow {
          transform: translateX(-2px);
        }

        .dot-pip {
          transition: width 0.4s cubic-bezier(0.4,0,0.2,1),
                      background 0.4s ease;
        }
      `}</style>

      <div className="relative w-full max-w-3xl mx-auto select-none">

        {/* ── Card ── */}
        <div className="relative bg-white border border-[#e8ddd0] rounded-2xl px-10 py-10 shadow-[0_4px_40px_rgba(212,163,115,0.10)] overflow-hidden min-h-[240px]">

          {/* Watermark quote mark */}
          <Quote
            size={80}
            className="absolute top-4 right-6 text-[#f0e8dc] pointer-events-none"
            strokeWidth={1}
          />

          {/* Animated content */}
          <div
            className={visible ? "review-card-visible" : "review-card-enter"}
            style={
              visible
                ? undefined
                : { opacity: 0, transform: enterTranslate + " scale(0.98)" }
            }
          >
            {/* Stars */}
            <StarRating rating={review.rating ?? 5} />

            {/* Comment */}
            <blockquote
              className="mt-5 mb-6 text-[20px] leading-8 text-black-1500  italic"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              "{review.comment}"
            </blockquote>

            {/* Reviewer info */}
            <div className="flex items-center gap-3 mt-2">
              {/* Avatar initials */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold tracking-wider text-white shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #d4a373 0%, #a07850 100%)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "13px",
                }}
              >
                {review.name
                  ?.split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() ?? "?"}
              </div>

              <div>
                <p
                  className="text-sm font-semibold text-gray-800 leading-none mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "15px" }}
                >
                  {review.name}
                </p>
                {review.date && (
                  <p className="text-[11px] text-gray-400 tracking-wide uppercase">
                    {review.date}
                  </p>
                )}
              </div>

              {/* Verified badge */}
              <span className="ml-auto text-[10px] tracking-widest uppercase text-[#a08060] border border-[#e0cdb8] rounded-full px-2.5 py-1 font-medium">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        {total > 1 && (
          <div className="flex items-center justify-between mt-7 px-1">

            {/* Prev */}
            <button
              onClick={() => { prev(); resetTimer(); }}
              disabled={animating}
              className="nav-btn nav-btn-prev group flex items-center gap-2 text-[12px] uppercase tracking-widest text-[#a08060] hover:text-[#6b4c2a] transition-colors duration-200 disabled:opacity-40"
            >
              <div className="w-9 h-9 rounded-full border border-[#ddd0c0] flex items-center justify-center group-hover:border-[#d4a373] group-hover:bg-[#fdf6ee] transition-all duration-200">
                <ChevronLeft size={16} className="nav-arrow" />
              </div>
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { goTo(i, i > current ? "next" : "prev"); resetTimer(); }}
                  className="dot-pip h-[5px] rounded-full"
                  style={{
                    width: i === current ? "24px" : "6px",
                    background: i === current ? "#d4a373" : "#ddd0c0",
                  }}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => { next(); resetTimer(); }}
              disabled={animating}
              className="nav-btn group flex items-center gap-2 text-[12px] uppercase tracking-widest text-[#a08060] hover:text-[#6b4c2a] transition-colors duration-200 disabled:opacity-40"
            >
              <span className="hidden sm:inline">Next</span>
              <div className="w-9 h-9 rounded-full border border-[#ddd0c0] flex items-center justify-center group-hover:border-[#d4a373] group-hover:bg-[#fdf6ee] transition-all duration-200">
                <ChevronRight size={16} className="nav-arrow" />
              </div>
            </button>

          </div>
        )}

        {/* Counter */}
        <p className="text-center text-[11px] text-gray-400 mt-4 tracking-widest uppercase">
          {current + 1} / {total}
        </p>

      </div>
    </>
  );
}