// components/HeroBanner.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────
   SLIDE DATA — only bg images change,
   foreground layout stays fixed
───────────────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&q=85",
    tint: "rgba(243,228,207,0.42)",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=85",
    tint: "rgba(240,220,195,0.38)",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1573408301185-9519f94815b2?w=1600&q=85",
    tint: "rgba(235,215,190,0.40)",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=85",
    tint: "rgba(243,228,207,0.44)",
  },
];

const AUTO_PLAY_MS = 4500;

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Jost:wght@400;500;600;700&display=swap');

  @keyframes heroUp {
    from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)}
  }
  @keyframes shimmer {
    from{transform:translateX(-100%)} to{transform:translateX(250%)}
  }
  @keyframes ringPulse {
    0%,100%{box-shadow:0 8px 32px rgba(20,14,4,.28),0 0 0 0 rgba(212,175,55,0)}
    50%    {box-shadow:0 8px 32px rgba(20,14,4,.28),0 0 0 6px rgba(212,175,55,.2)}
  }

  .hero-cta {
    position:relative; overflow:hidden;
    display:inline-flex; align-items:center; gap:10px;
    padding:15px 36px; border-radius:8px; border:none; cursor:pointer;
    background:#D4AF37; color:#1a1205;
    font-family:'Jost',sans-serif; font-size:14px; font-weight:700;
    letter-spacing:.1em; text-transform:uppercase;
    box-shadow:0 6px 24px rgba(212,175,55,.4);
    animation:ringPulse 3.5s ease 1s infinite;
    transition:transform .3s, box-shadow .3s;
  }
  .hero-cta .sweep {
    position:absolute; inset:0;
    background:linear-gradient(105deg,transparent 25%,rgba(255,255,255,.35) 50%,transparent 75%);
    transform:translateX(-100%);
  }
  .hero-cta:hover{ transform:translateY(-3px); box-shadow:0 12px 32px rgba(212,175,55,.5); }
  .hero-cta:hover .sweep{ animation:shimmer .7s ease forwards; }
  .hero-cta:active{ transform:translateY(0); }

  .hero-arrow {
    position:absolute; top:50%; transform:translateY(-50%);
    z-index:20; width:46px; height:46px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    background:rgba(255,255,255,.82); backdrop-filter:blur(6px);
    border:1.5px solid rgba(212,175,55,.4); cursor:pointer;
    box-shadow:0 4px 18px rgba(0,0,0,.12);
    transition:all .2s ease;
  }
  .hero-arrow:hover{ background:#D4AF37; border-color:#D4AF37; transform:translateY(-50%) scale(1.08); }
  .hero-arrow:hover svg{ stroke:#fff; }
  .hero-arrow.left { left:24px; }
  .hero-arrow.right{ right:24px; }

  .hero-dot {
    width:8px; height:8px; border-radius:50%;
    border:1.5px solid #D4AF37; cursor:pointer;
    background:transparent; padding:0;
    transition:all .3s ease;
  }
  .hero-dot.active{ background:#D4AF37; width:24px; border-radius:4px; }

  /* content layout */
  .hero-inner {
    max-width:1440px; margin:0 auto;
    padding:96px 80px 104px;
    position:relative; z-index:10;
  }
  .hero-h1 {
    font-family:'Great Vibes',cursive;
    font-size:clamp(48px,6.5vw,80px);
    line-height:1.12; color:#fff; margin:0;
    text-shadow: 0 2px 18px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.25);
    animation:heroUp .7s ease .1s both;
  }
  .hero-p {
    font-family:'Jost',sans-serif;
    font-size:clamp(14px,1.5vw,18px);
    color:rgba(255,255,255,0.92); font-weight:500; line-height:1.75;
    margin:20px 0 0; max-width:480px;
    text-shadow: 0 1px 8px rgba(0,0,0,0.3);
    animation:heroUp .7s ease .25s both;
  }
  .hero-btn-wrap{ animation:heroUp .7s ease .4s both; }

  @media(max-width:768px){
    .hero-inner{ padding:72px 28px 88px; }
    .hero-p{ max-width:100%; }
    .hero-arrow{ width:38px; height:38px; }
    .hero-arrow.left{ left:10px; }
    .hero-arrow.right{ right:10px; }
  }
  @media(max-width:480px){
    .hero-inner{ padding:52px 16px 72px; }
    .hero-cta{ width:100%; justify-content:center; padding:14px 20px; font-size:13px; }
    .hero-arrow{ width:32px; height:32px; }
    .hero-arrow.left{ left:6px; }
    .hero-arrow.right{ right:6px; }
  }
`;

export default function HeroBanner() {
  const router  = useRouter();
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);

  const total = SLIDES.length;
  const prev  = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);
  const next  = useCallback(() => setCurrent(c => (c + 1) % total),         [total]);

  /* auto-play */
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(next, AUTO_PLAY_MS);
    return () => clearTimeout(t);
  }, [current, paused, next]);

  /* keyboard navigation */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <>
      <style>{STYLES}</style>

      <section
        style={{ position:"relative", width:"100%", overflow:"hidden",
          background:"#F3E4CF", minHeight:460 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >

        {/* ── BACKGROUND SLIDES — cross-fade ── */}
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            style={{
              position:"absolute", inset:0,
              backgroundImage:`url(${s.image})`,
              backgroundSize:"cover",
              backgroundPosition:"center",
              opacity: i === current ? 1 : 0,
              transform: i === current ? "scale(1)" : "scale(1.04)",
              transition:"opacity .9s ease, transform .9s ease",
              pointerEvents:"none",
            }}
          />
        ))}

        {/* warm tint overlay */}
        <div style={{
          position:"absolute", inset:0,
          background: SLIDES[current].tint,
          transition:"background .9s ease",
          pointerEvents:"none",
        }}/>

        {/* ── dark scrim — only behind the text (left 60%) so image stays visible on the right ── */}
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(100deg, rgba(10,7,3,0.38) 0%, rgba(10,7,3,0.22) 45%, transparent 72%)",
          pointerEvents:"none",
        }}/>

        {/* grain texture */}
        <div style={{
          position:"absolute", inset:0, opacity:.15, pointerEvents:"none",
          backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
        }}/>

        {/* ════════════════════════════════════
            FOREGROUND — original layout unchanged
        ════════════════════════════════════ */}
        <div className="hero-inner">
          <div style={{ maxWidth:600 }}>

            <h1 className="hero-h1">
              Where Style<br/>
              Meets Sparkle
            </h1>

            <p className="hero-p">
              Discover timeless fashion and statement jewellery crafted to make
              you shine every day.
            </p>

            <div className="hero-btn-wrap" style={{ marginTop:32 }}>
              <button className="hero-cta" onClick={() => router.push("/products")}>
                <span className="sweep"/>
                <span style={{ position:"relative", zIndex:1 }}>
                  Shop The Collection
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* ── PREV ARROW ── */}
        <button className="hero-arrow left" onClick={prev} aria-label="Previous slide">
          <ChevronLeft size={20} color="#9C7A3C" strokeWidth={2.2}/>
        </button>

        {/* ── NEXT ARROW ── */}
        <button className="hero-arrow right" onClick={next} aria-label="Next slide">
          <ChevronRight size={20} color="#9C7A3C" strokeWidth={2.2}/>
        </button>

        {/* ── DOT PAGINATION ── */}
        <div style={{
          position:"absolute", bottom:24, left:"50%",
          transform:"translateX(-50%)",
          display:"flex", alignItems:"center", gap:8, zIndex:20,
        }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === current ? "active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* ── SLIDE COUNTER ── */}
        <div style={{
          position:"absolute", bottom:22, right:28, zIndex:20,
          fontFamily:"'Jost',sans-serif", fontSize:11, fontWeight:700,
          color:"rgba(26,18,5,.45)", letterSpacing:".1em",
        }}>
          {String(current + 1).padStart(2,"0")}&nbsp;/&nbsp;{String(total).padStart(2,"0")}
        </div>

        {/* ── PROGRESS BAR ── */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0,
          height:3, background:"rgba(212,175,55,.2)", zIndex:20,
        }}>
          <div style={{
            height:"100%",
            background:"linear-gradient(90deg,#D4AF37,#e8c96a)",
            width:`${((current + 1) / total) * 100}%`,
            transition:"width .5s ease",
            borderRadius:"0 2px 2px 0",
          }}/>
        </div>

      </section>
    </>
  );
}