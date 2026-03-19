// app/about/page.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Sparkles, Leaf, Heart, Star,
  Award, Users, Globe, ShieldCheck, Gem,
} from "lucide-react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const VALUES = [
  {
    Icon: Gem,
    title: "Artisan Craftsmanship",
    body: "Every piece is handcrafted by master artisans carrying generational techniques. We celebrate imperfection as the mark of the human hand.",
  },
  {
    Icon: Leaf,
    title: "Sustainable Sourcing",
    body: "We partner only with ethical suppliers — conflict-free gems, recycled metals, and naturally grown botanicals that respect the earth.",
  },
  {
    Icon: Heart,
    title: "Customer Intimacy",
    body: "We don't sell products, we curate experiences. Every recommendation, package, and note is personal — because you deserve to feel seen.",
  },
  {
    Icon: ShieldCheck,
    title: "Uncompromised Quality",
    body: "Each item passes a 12-point quality check before it reaches you. Our standard is simple: if we wouldn't gift it to family, we won't sell it to you.",
  },
];

const STATS = [
  { val: "12+",  label: "Years of Legacy"     },
  { val: "40K+", label: "Happy Customers"     },
  { val: "200+", label: "Artisan Partners"    },
  { val: "18",   label: "Countries Shipped To" },
];

const MILESTONES = [
  { year: "2012", title: "The First Workshop", body: "Founded in a 200 sq ft studio in Jaipur by two sisters with a shared dream — to bring handcrafted luxury to every home." },
  { year: "2015", title: "Going Online",        body: "Launched our first digital storefront. Within 6 months, orders arrived from 8 states. The world was ready." },
  { year: "2018", title: "The Green Pledge",    body: "Committed to 100% ethically sourced materials and zero single-use plastic packaging across all shipments." },
  { year: "2021", title: "International Bloom", body: "Shipped our first international order to London. Today we reach 18 countries — and counting." },
  { year: "2024", title: "40,000 Families",     body: "A quiet milestone. 40,000 homes now carry a piece of our story. Every order is still packed with the same love as the first." },
];

const TEAM = [
  { name: "Priya Mehta",    role: "Co-Founder & Creative Director", initials: "PM", accent: "#C9A84C" },
  { name: "Ananya Mehta",   role: "Co-Founder & Head of Sourcing",  initials: "AM", accent: "#b8964e" },
  { name: "Rohit Sharma",   role: "Head of Design",                 initials: "RS", accent: "#a07c3a" },
  { name: "Kavya Nair",     role: "Customer Experience Lead",       initials: "KN", accent: "#c9a030" },
];

/* ─────────────────────────────────────────────
   HOOK — fade-in on scroll
───────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; font-family: 'Jost', sans-serif; }

  @keyframes heroIn    { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeUp    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeLeft  { from { opacity:0; transform:translateX(-24px); } to { opacity:1; transform:translateX(0); } }
  @keyframes fadeRight { from { opacity:0; transform:translateX(24px);  } to { opacity:1; transform:translateX(0); } }
  @keyframes scaleIn   { from { opacity:0; transform:scale(0.88); } to { opacity:1; transform:scale(1); } }
  @keyframes shimmer   { from { transform:translateX(-100%); } to { transform:translateX(250%); } }
  @keyframes goldPulse {
    0%,100% { box-shadow:0 6px 28px rgba(20,14,4,.3), 0 0 0 0 rgba(201,168,76,0); }
    50%      { box-shadow:0 6px 28px rgba(20,14,4,.3), 0 0 0 5px rgba(201,168,76,.16); }
  }
  @keyframes float {
    0%,100% { transform:translateY(0); }
    50%      { transform:translateY(-8px); }
  }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes lineGrow { from { width:0; } to { width:100%; } }

  .reveal   { opacity:0; }
  .revealed { opacity:1; }
  .from-up    { animation: fadeUp    0.7s ease both; }
  .from-left  { animation: fadeLeft  0.7s ease both; }
  .from-right { animation: fadeRight 0.7s ease both; }
  .scale-in   { animation: scaleIn   0.6s ease both; }

  .cta-btn {
    position:relative; overflow:hidden;
    display:inline-flex; align-items:center; justify-content:center; gap:10px;
    padding:15px 32px; border-radius:14px; border:none;
    background:linear-gradient(120deg,#140e04 0%,#3a2408 45%,#5a3a0c 65%,#140e04 100%);
    color:#fff; font-family:'Jost',sans-serif; font-size:13px; font-weight:700;
    letter-spacing:.16em; text-transform:uppercase; text-decoration:none; cursor:pointer;
    animation:goldPulse 3.5s ease infinite;
    transition:transform .3s, box-shadow .3s;
  }
  .cta-btn::before {
    content:''; position:absolute; top:0; left:12%; right:12%; height:1px;
    background:linear-gradient(90deg,transparent,rgba(201,168,76,.65),transparent);
  }
  .cta-btn .sweep {
    position:absolute; inset:0;
    background:linear-gradient(105deg,transparent 25%,rgba(201,168,76,.22) 50%,transparent 75%);
    transform:translateX(-100%);
  }
  .cta-btn:hover { transform:translateY(-2px); box-shadow:0 14px 38px rgba(20,14,4,.42); }
  .cta-btn:hover .sweep { animation:shimmer .7s ease forwards; }
  .cta-btn:active { transform:translateY(0); }

  .gold-rule {
    height:1px;
    background:linear-gradient(90deg,transparent,#C9A84C,transparent);
  }

  .ornament { animation:spin 40s linear infinite; }
  .gem-float { animation:float 4s ease-in-out infinite; }
`;

/* ─────────────────────────────────────────────
   SECTION WRAPPER with scroll reveal
───────────────────────────────────────────── */
function Section({ children, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ ...style }}>
      {visible ? children : <div style={{ minHeight: 200 }} />}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <>
      <style>{STYLES}</style>
      <div style={{ minHeight: "100vh", background: "#F4EFE6", overflowX: "hidden" }}>

        {/* ══════════════════════════════════════════
            § 1  HERO
        ══════════════════════════════════════════ */}
        <div style={{
          position: "relative",
          background: "linear-gradient(160deg, #12100c 0%, #251c10 50%, #1a1205 100%)",
          padding: "90px 24px 100px",
          overflow: "hidden",
          textAlign: "center",
        }}>

          {/* noise texture overlay */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
            opacity: 0.4,
            pointerEvents: "none",
          }} />

          {/* rotating ornament top-left */}
          <svg className="ornament" style={{ position:"absolute", top:-60, left:-60, opacity:0.06, width:240, height:240 }}
               viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#C9A84C" strokeWidth="1" strokeDasharray="8 6"/>
            <circle cx="100" cy="100" r="70" fill="none" stroke="#C9A84C" strokeWidth="0.5" strokeDasharray="3 8"/>
          </svg>

          {/* rotating ornament bottom-right */}
          <svg className="ornament" style={{ position:"absolute", bottom:-80, right:-80, opacity:0.07, width:280, height:280, animationDirection:"reverse" }}
               viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#C9A84C" strokeWidth="1" strokeDasharray="5 9"/>
          </svg>

          {/* breadcrumb */}
          <p style={{ fontSize:12, color:"#9a7d50", letterSpacing:"0.12em", marginBottom:24,
                      animation:"heroIn .5s ease both", animationDelay:"0s" }}>
            <Link href="/" style={{ color:"#9a7d50", textDecoration:"none" }}>Home</Link>
            <span style={{ margin:"0 8px", color:"#C9A84C" }}>›</span>
            <span style={{ color:"#C9A84C", fontWeight:600 }}>About Us</span>
          </p>

          {/* eyebrow */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:18,
                        animation:"heroIn .5s ease .1s both" }}>
            <div style={{ height:1, width:48, background:"linear-gradient(90deg,transparent,#C9A84C)" }} />
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.28em", color:"#C9A84C", textTransform:"uppercase" }}>
              Our Story
            </span>
            <div style={{ height:1, width:48, background:"linear-gradient(90deg,#C9A84C,transparent)" }} />
          </div>

          {/* headline */}
          <h1 style={{
            fontFamily:"'Cormorant Garamond', serif",
            fontSize:"clamp(40px,7vw,80px)", fontWeight:700,
            color:"#f5ede0", lineHeight:1.05, margin:"0 auto 22px",
            maxWidth:760, animation:"heroIn .6s ease .2s both",
          }}>
            Crafted with Love,<br />
            <em style={{ color:"#C9A84C", fontStyle:"italic" }}>Delivered with Soul</em>
          </h1>

          {/* subheading */}
          <p style={{
            fontSize:16, color:"#a89272", fontWeight:400,
            maxWidth:520, margin:"0 auto 36px", lineHeight:1.8,
            animation:"heroIn .6s ease .35s both",
          }}>
            Since 2012, we've been bridging the gap between India's finest artisans and the world —
            one thoughtfully curated piece at a time.
          </p>

          {/* CTA */}
          <div style={{ animation:"heroIn .5s ease .5s both" }}>
            <Link href="/products" className="cta-btn">
              <span className="sweep"/>
              <Sparkles size={14} style={{ position:"relative", zIndex:1, color:"#d4a94a" }}/>
              <span style={{ position:"relative", zIndex:1 }}>Shop the Collection</span>
              <ArrowRight size={14} style={{ position:"relative", zIndex:1 }}/>
            </Link>
          </div>

          {/* bottom wave */}
          <svg viewBox="0 0 1440 60" style={{ position:"absolute", bottom:0, left:0, width:"100%", display:"block" }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#F4EFE6"/>
          </svg>
        </div>

        {/* ══════════════════════════════════════════
            § 2  STATS BAR
        ══════════════════════════════════════════ */}
        <Section>
          <div style={{
            background:"#F0E9DB",
            borderBottom:"1.5px solid #E5D9C8",
            padding:"0 24px",
          }}>
            <div style={{
              maxWidth:960, margin:"0 auto",
              display:"grid", gridTemplateColumns:"repeat(4,1fr)",
              gap:0,
            }}>
              {STATS.map(({ val, label }, i) => (
                <div
                  key={label}
                  className="from-up"
                  style={{
                    textAlign:"center",
                    padding:"32px 16px",
                    borderRight: i < 3 ? "1px solid #E5D9C8" : "none",
                    animationDelay:`${i*0.1}s`,
                  }}
                >
                  <p style={{
                    fontFamily:"'Cormorant Garamond', serif",
                    fontSize:38, fontWeight:700, color:"#C9A84C",
                    margin:"0 0 4px",
                  }}>
                    {val}
                  </p>
                  <p style={{ fontSize:11, fontWeight:700, color:"#A89880", letterSpacing:"0.14em", textTransform:"uppercase", margin:0 }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════
            § 3  OUR STORY  (split layout)
        ══════════════════════════════════════════ */}
        <Section>
          <div style={{ maxWidth:1100, margin:"0 auto", padding:"96px 24px" }}>

            {/* section label */}
            <div className="from-up" style={{ textAlign:"center", marginBottom:64 }}>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.28em", color:"#C9A84C", textTransform:"uppercase" }}>
                Who We Are
              </span>
              <div className="gold-rule" style={{ width:60, margin:"10px auto 0" }} />
            </div>

            <div style={{ display:"flex", gap:64, alignItems:"center", flexWrap:"wrap" }}>

              {/* left — decorative visual block */}
              <div className="from-left scale-in" style={{ flex:"0 0 380px", position:"relative" }}>

                {/* main card */}
                <div style={{
                  width:"100%", aspectRatio:"4/5",
                  borderRadius:24, overflow:"hidden",
                  background:"linear-gradient(160deg,#251c10,#3d2a0a)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:"0 24px 64px rgba(0,0,0,0.2)",
                  position:"relative",
                }}>
                  {/* decorative grid of circles */}
                  <svg width="100%" height="100%" viewBox="0 0 400 500" style={{ position:"absolute", inset:0, opacity:0.06 }}>
                    {[...Array(8)].map((_,r)=>[...Array(6)].map((_,c)=>(
                      <circle key={`${r}-${c}`} cx={c*70+35} cy={r*65+32} r="3" fill="#C9A84C"/>
                    )))}
                  </svg>

                  {/* centered ornament */}
                  <div style={{ textAlign:"center", padding:40 }}>
                    <div className="gem-float" style={{
                      width:100, height:100, borderRadius:"50%",
                      background:"linear-gradient(135deg,#C9A84C,#e8c96a)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      margin:"0 auto 24px",
                      boxShadow:"0 0 40px rgba(201,168,76,0.4)",
                    }}>
                      <Gem size={42} color="#fff" strokeWidth={1.4}/>
                    </div>
                    <p style={{
                      fontFamily:"'Cormorant Garamond', serif",
                      fontSize:22, fontWeight:700, color:"#f5ede0",
                      margin:"0 0 8px",
                    }}>
                      Est. 2012
                    </p>
                    <p style={{ fontSize:12, color:"#9a7d50", letterSpacing:"0.12em" }}>
                      Jaipur, India
                    </p>
                  </div>
                </div>

                {/* floating badge */}
                <div style={{
                  position:"absolute", bottom:-20, right:-20,
                  background:"#fff",
                  borderRadius:16, padding:"14px 20px",
                  boxShadow:"0 8px 32px rgba(0,0,0,0.1)",
                  border:"1.5px solid #EDE5D8",
                  display:"flex", alignItems:"center", gap:10,
                }}>
                  <Star size={18} color="#C9A84C" fill="#C9A84C" strokeWidth={0}/>
                  <div>
                    <p style={{ fontSize:14, fontWeight:700, color:"#1a1205", margin:0 }}>4.9 / 5.0</p>
                    <p style={{ fontSize:10, color:"#A89880", margin:0 }}>40,000+ reviews</p>
                  </div>
                </div>
              </div>

              {/* right — story text */}
              <div className="from-right" style={{ flex:"1 1 340px", minWidth:0 }}>
                <h2 style={{
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:"clamp(28px,4vw,44px)", fontWeight:700,
                  color:"#1a1205", margin:"0 0 20px", lineHeight:1.2,
                }}>
                  Born from the <em style={{ color:"#C9A84C" }}>lanes of Jaipur,</em> grown for the world
                </h2>
                <div className="gold-rule" style={{ width:60, marginBottom:24 }} />

                <p style={{ fontSize:15, color:"#6b5327", lineHeight:1.85, marginBottom:18, fontWeight:400 }}>
                  It started with two sisters, a rented workshop, and an unshakeable belief:
                  that beautiful things should be accessible without compromising on ethics, craft, or origin.
                </p>
                <p style={{ fontSize:15, color:"#6b5327", lineHeight:1.85, marginBottom:18, fontWeight:400 }}>
                  We spent months visiting artisan clusters — jewellers in Jaipur, weavers in Varanasi,
                  plant growers in Kerala — listening before we ever sold a single thing. What emerged was
                  a curation philosophy rooted in <strong style={{ color:"#5c4220" }}>trust, transparency, and timelessness.</strong>
                </p>
                <p style={{ fontSize:15, color:"#6b5327", lineHeight:1.85, fontWeight:400 }}>
                  Today, every product on our platform carries a story — of the hands that made it,
                  the soil it came from, and the care taken to bring it to you.
                </p>

                {/* quote */}
                <div style={{
                  marginTop:28, padding:"18px 20px",
                  borderLeft:"3px solid #C9A84C",
                  background:"#F0E9DB", borderRadius:"0 12px 12px 0",
                }}>
                  <p style={{
                    fontFamily:"'Cormorant Garamond', serif",
                    fontSize:17, fontStyle:"italic", color:"#3d2a0a",
                    margin:"0 0 8px", lineHeight:1.5,
                  }}>
                    "We don't just sell objects. We carry forward a legacy."
                  </p>
                  <p style={{ fontSize:12, fontWeight:700, color:"#C9A84C", margin:0, letterSpacing:"0.08em" }}>
                    — Priya Mehta, Co-Founder
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════
            § 4  OUR VALUES
        ══════════════════════════════════════════ */}
        <Section>
          <div style={{ background:"#F0E9DB", borderTop:"1.5px solid #E5D9C8", borderBottom:"1.5px solid #E5D9C8", padding:"96px 24px" }}>
            <div style={{ maxWidth:1100, margin:"0 auto" }}>

              {/* heading */}
              <div className="from-up" style={{ textAlign:"center", marginBottom:56 }}>
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.28em", color:"#C9A84C", textTransform:"uppercase" }}>
                  What Drives Us
                </span>
                <h2 style={{
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:"clamp(28px,4vw,46px)", fontWeight:700,
                  color:"#1a1205", margin:"12px 0 0", lineHeight:1.2,
                }}>
                  Principles we never compromise on
                </h2>
                <div className="gold-rule" style={{ width:60, margin:"18px auto 0" }} />
              </div>

              {/* values grid */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:20 }}>
                {VALUES.map(({ Icon, title, body }, i) => (
                  <div
                    key={title}
                    className="from-up"
                    style={{
                      background:"#fff",
                      borderRadius:20,
                      border:"1.5px solid #EDE5D8",
                      padding:"32px 24px",
                      boxShadow:"0 2px 20px rgba(0,0,0,0.05)",
                      animationDelay:`${i*0.12}s`,
                      transition:"transform .25s, box-shadow .25s",
                    }}
                    onMouseEnter={(e)=>{ e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 36px rgba(0,0,0,0.1)"; }}
                    onMouseLeave={(e)=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 20px rgba(0,0,0,0.05)"; }}
                  >
                    {/* icon circle */}
                    <div style={{
                      width:52, height:52, borderRadius:"50%",
                      background:"linear-gradient(135deg,rgba(201,168,76,0.14),rgba(201,168,76,0.06))",
                      border:"1.5px solid rgba(201,168,76,0.3)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      marginBottom:18,
                    }}>
                      <Icon size={22} color="#C9A84C" strokeWidth={1.7}/>
                    </div>

                    <h3 style={{
                      fontFamily:"'Cormorant Garamond', serif",
                      fontSize:20, fontWeight:700, color:"#1a1205",
                      margin:"0 0 10px",
                    }}>
                      {title}
                    </h3>
                    <p style={{ fontSize:13.5, color:"#7a6a54", lineHeight:1.75, margin:0, fontWeight:400 }}>
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════
            § 5  JOURNEY TIMELINE
        ══════════════════════════════════════════ */}
        <Section>
          <div style={{ maxWidth:800, margin:"0 auto", padding:"96px 24px" }}>

            {/* heading */}
            <div className="from-up" style={{ textAlign:"center", marginBottom:64 }}>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.28em", color:"#C9A84C", textTransform:"uppercase" }}>
                Our Journey
              </span>
              <h2 style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:"clamp(28px,4vw,46px)", fontWeight:700,
                color:"#1a1205", margin:"12px 0 0",
              }}>
                Milestones along the way
              </h2>
              <div className="gold-rule" style={{ width:60, margin:"18px auto 0" }} />
            </div>

            {/* timeline */}
            <div style={{ position:"relative", paddingLeft:32 }}>

              {/* vertical line */}
              <div style={{
                position:"absolute", left:11, top:8, bottom:8,
                width:2, background:"linear-gradient(180deg,#C9A84C,rgba(201,168,76,0.1))",
                borderRadius:2,
              }}/>

              {MILESTONES.map(({ year, title, body }, i) => (
                <div
                  key={year}
                  className="from-left"
                  style={{ position:"relative", marginBottom:44, animationDelay:`${i*0.12}s` }}
                >
                  {/* dot */}
                  <div style={{
                    position:"absolute", left:-32, top:4,
                    width:22, height:22, borderRadius:"50%",
                    background:"linear-gradient(135deg,#C9A84C,#e8c96a)",
                    border:"3px solid #F4EFE6",
                    boxShadow:"0 0 0 2px #C9A84C",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    zIndex:1,
                  }}/>

                  {/* card */}
                  <div style={{
                    background:"#fff", borderRadius:16,
                    border:"1.5px solid #EDE5D8",
                    padding:"20px 24px",
                    boxShadow:"0 2px 16px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{ display:"flex", alignItems:"baseline", gap:14, marginBottom:6 }}>
                      <span style={{
                        fontFamily:"'Cormorant Garamond', serif",
                        fontSize:28, fontWeight:700, color:"#C9A84C",
                        lineHeight:1,
                      }}>
                        {year}
                      </span>
                      <h3 style={{
                        fontFamily:"'Cormorant Garamond', serif",
                        fontSize:18, fontWeight:700, color:"#1a1205", margin:0,
                      }}>
                        {title}
                      </h3>
                    </div>
                    <p style={{ fontSize:13.5, color:"#7a6a54", lineHeight:1.75, margin:0 }}>
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════
            § 6  TEAM
        ══════════════════════════════════════════ */}
        <Section>
          <div style={{ background:"#F0E9DB", borderTop:"1.5px solid #E5D9C8", padding:"96px 24px 80px" }}>
            <div style={{ maxWidth:1100, margin:"0 auto" }}>

              {/* heading */}
              <div className="from-up" style={{ textAlign:"center", marginBottom:56 }}>
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.28em", color:"#C9A84C", textTransform:"uppercase" }}>
                  The People
                </span>
                <h2 style={{
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:"clamp(28px,4vw,46px)", fontWeight:700,
                  color:"#1a1205", margin:"12px 0 0",
                }}>
                  Faces behind the craft
                </h2>
                <div className="gold-rule" style={{ width:60, margin:"18px auto 0" }} />
              </div>

              {/* team grid */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:20, marginBottom:64 }}>
                {TEAM.map(({ name, role, initials, accent }, i) => (
                  <div
                    key={name}
                    className="from-up scale-in"
                    style={{
                      background:"#fff", borderRadius:20,
                      border:"1.5px solid #EDE5D8",
                      padding:"32px 20px",
                      textAlign:"center",
                      boxShadow:"0 2px 20px rgba(0,0,0,0.05)",
                      animationDelay:`${i*0.1}s`,
                      transition:"transform .25s, box-shadow .25s",
                    }}
                    onMouseEnter={(e)=>{ e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 36px rgba(0,0,0,0.1)"; }}
                    onMouseLeave={(e)=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 20px rgba(0,0,0,0.05)"; }}
                  >
                    {/* avatar */}
                    <div style={{
                      width:72, height:72, borderRadius:"50%",
                      background:`linear-gradient(135deg,${accent},#e8c96a)`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      margin:"0 auto 16px",
                      boxShadow:`0 6px 20px rgba(201,168,76,0.3)`,
                      fontSize:22, fontWeight:700, color:"#fff",
                      fontFamily:"'Cormorant Garamond', serif",
                    }}>
                      {initials}
                    </div>
                    <h3 style={{
                      fontFamily:"'Cormorant Garamond', serif",
                      fontSize:18, fontWeight:700, color:"#1a1205",
                      margin:"0 0 6px",
                    }}>
                      {name}
                    </h3>
                    <p style={{ fontSize:12, color:"#A89880", fontWeight:600, letterSpacing:"0.04em", margin:0 }}>
                      {role}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── BOTTOM CTA BANNER ── */}
              <div className="from-up" style={{
                background:"linear-gradient(135deg,#12100c 0%,#3d2a0a 50%,#12100c 100%)",
                borderRadius:24, padding:"52px 40px",
                textAlign:"center", position:"relative", overflow:"hidden",
                boxShadow:"0 16px 48px rgba(0,0,0,0.22)",
              }}>
                {/* top rule */}
                <div style={{
                  position:"absolute", top:0, left:"10%", right:"10%", height:1,
                  background:"linear-gradient(90deg,transparent,#C9A84C,transparent)",
                }}/>

                {/* bg pattern */}
                <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.04 }}
                     viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
                  {[...Array(6)].map((_,r)=>[...Array(10)].map((_,c)=>(
                    <circle key={`${r}-${c}`} cx={c*45+22} cy={r*40+20} r="2.5" fill="#C9A84C"/>
                  )))}
                </svg>

                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:16 }}>
                  <div style={{ height:1, width:36, background:"linear-gradient(90deg,transparent,#C9A84C)" }} />
                  <Sparkles size={14} color="#C9A84C" />
                  <div style={{ height:1, width:36, background:"linear-gradient(90deg,#C9A84C,transparent)" }} />
                </div>

                <h2 style={{
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:"clamp(24px,4vw,40px)", fontWeight:700,
                  color:"#f5ede0", margin:"0 0 12px", lineHeight:1.2,
                  position:"relative", zIndex:1,
                }}>
                  Ready to experience the difference?
                </h2>
                <p style={{
                  fontSize:14, color:"#a89272", maxWidth:480, margin:"0 auto 32px",
                  lineHeight:1.8, position:"relative", zIndex:1,
                }}>
                  Every piece tells a story. Find yours in our carefully curated collection.
                </p>

                <Link href="/products" className="cta-btn" style={{ position:"relative", zIndex:1 }}>
                  <span className="sweep"/>
                  <span style={{ position:"relative", zIndex:1 }}>Explore Collection</span>
                  <ArrowRight size={14} style={{ position:"relative", zIndex:1 }}/>
                </Link>
              </div>

            </div>
          </div>
        </Section>

      </div>
    </>
  );
}