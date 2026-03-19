"use client";

import { useEffect, useState, useRef } from "react";

export default function StatsSection() {
  const stats = [
    { value: 25,   suffix: "k+",      label: "Happy Customers"          },
    { value: 1200, suffix: "+",        label: "Premium Jewelry Designs"  },
    { value: 18,   suffix: "k+",       label: "Orders Delivered"         },
    { value: 8,    suffix: "+ Years",  label: "Of Trusted Craftsmanship" },
  ];

  return (
    <section className="relative w-full overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/stats-bg.jpg')] bg-cover bg-center" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8
                      py-12 sm:py-14 lg:py-0 lg:h-[220px] lg:flex lg:items-center">
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-4 sm:gap-x-6 text-center text-white">
          {stats.map((item, index) => (
            <StatItem key={index} {...item} />
          ))}
        </div>
      </div>

    </section>
  );
}

function StatItem({ value, suffix, label }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  /* start counter only when visible */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(counter);
      }
      setCount(Math.floor(start));
    }, 16);

    return () => clearInterval(counter);
  }, [started, value]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      {/* Number */}
      <h3 className="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-[#D4AF37] font-serif leading-none">
        {count.toLocaleString()}{suffix}
      </h3>

      {/* Divider */}
      <div className="w-8 h-[2px] bg-[#D4AF37]/40 my-2 sm:my-3 rounded-full" />

      {/* Label */}
      <p className="text-[12px] sm:text-[13px] lg:text-[14px] text-white/80 tracking-wide leading-snug max-w-[120px]">
        {label}
      </p>
    </div>
  );
}