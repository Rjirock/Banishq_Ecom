"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

/* ⭐ STAR RATING */
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
            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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

export default function ReviewCarousel({ reviews = [] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("next");
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
      }, 300);
    },
    [animating, total]
  );

  const next = useCallback(() => goTo(current + 1, "next"), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, "prev"), [current, goTo]);

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
      <div className="text-center py-10 sm:py-16 text-gray-400 italic text-sm">
        No reviews yet — be the first to share your experience.
      </div>
    );
  }

  const review = reviews[current];

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4 sm:px-6">

      {/* CARD */}
      <div className="relative bg-white border border-[#e8ddd0] rounded-xl sm:rounded-2xl
                      px-5 sm:px-8 md:px-10
                      py-6 sm:py-8 md:py-10
                      shadow-[0_4px_30px_rgba(212,163,115,0.10)]
                      overflow-hidden">

        <Quote
          size={50}
          className="absolute top-3 right-4 sm:top-4 sm:right-6 text-[#f0e8dc]"
        />

        <div className={visible ? "opacity-100 transition-all duration-500" : "opacity-0"}>

          {/* Stars */}
          <StarRating rating={review.rating ?? 5} />

          {/* Comment */}
          <blockquote className="mt-4 mb-5
                                 text-[15px] sm:text-[17px] md:text-[20px]
                                 leading-6 sm:leading-7 md:leading-8
                                 italic text-black">
            "{review.comment}"
          </blockquote>

          {/* USER */}
          <div className="flex items-center gap-3">

            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs text-white"
              style={{ background: "linear-gradient(135deg, #d4a373, #a07850)" }}>
              {review.name?.[0] ?? "?"}
            </div>

            <div>
              <p className="text-[13px] sm:text-[14px] font-semibold text-gray-800">
                {review.name}
              </p>
              {review.date && (
                <p className="text-[10px] sm:text-[11px] text-gray-400">
                  {review.date}
                </p>
              )}
            </div>

            <span className="ml-auto text-[9px] sm:text-[10px]
                             border px-2 py-1 rounded-full text-[#a08060]">
              Verified
            </span>
          </div>

        </div>
      </div>

      {/* NAVIGATION */}
      {total > 1 && (
        <div className="flex items-center justify-between mt-5 sm:mt-7">

          {/* PREV */}
          <button
            onClick={() => { prev(); resetTimer(); }}
            className="flex items-center gap-2 text-[11px] sm:text-[12px]"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 border rounded-full flex items-center justify-center">
              <ChevronLeft size={14} />
            </div>
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* DOTS */}
          <div className="flex gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-[5px] rounded-full transition-all duration-300 ${
                  i === current ? "w-5 bg-[#d4a373]" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* NEXT */}
          <button
            onClick={() => { next(); resetTimer(); }}
            className="flex items-center gap-2 text-[11px] sm:text-[12px]"
          >
            <span className="hidden sm:inline">Next</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 border rounded-full flex items-center justify-center">
              <ChevronRight size={14} />
            </div>
          </button>
        </div>
      )}

      {/* COUNTER */}
      <p className="text-center text-[10px] sm:text-[11px] text-gray-400 mt-3 sm:mt-4">
        {current + 1} / {total}
      </p>

    </div>
  );
}