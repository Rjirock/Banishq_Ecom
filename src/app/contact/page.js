// app/contact/page.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Mail, Phone, MapPin, Clock, Send,
  ArrowRight, Sparkles, Instagram,
  MessageCircle, CheckCircle2, ChevronDown,
} from "lucide-react";

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; font-family:'Jost',sans-serif; }

  @keyframes heroIn    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeLeft  { from{opacity:0;transform:translateX(-22px)} to{opacity:1;transform:translateX(0)} }
  @keyframes fadeRight { from{opacity:0;transform:translateX(22px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes shimmer   { from{transform:translateX(-100%)} to{transform:translateX(250%)} }
  @keyframes ringPulse {
    0%,100%{box-shadow:0 6px 28px rgba(20,14,4,.3),0 0 0 0 rgba(201,168,76,0)}
    50%    {box-shadow:0 6px 28px rgba(20,14,4,.3),0 0 0 5px rgba(201,168,76,.16)}
  }
  @keyframes popIn {
    0%  {opacity:0;transform:scale(0.5)}
    70% {transform:scale(1.1)}
    100%{opacity:1;transform:scale(1)}
  }
  @keyframes float {
    0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)}
  }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes successSlide {
    from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)}
  }

  .from-up    { animation:fadeUp    .65s ease both }
  .from-left  { animation:fadeLeft  .65s ease both }
  .from-right { animation:fadeRight .65s ease both }

  .gold-rule { height:1px; background:linear-gradient(90deg,transparent,#C9A84C,transparent); }

  /* luxury CTA */
  .cta-btn {
    position:relative; overflow:hidden;
    display:inline-flex; align-items:center; justify-content:center; gap:10px;
    padding:14px 30px; border-radius:14px; border:none;
    background:linear-gradient(120deg,#140e04 0%,#3a2408 45%,#5a3a0c 65%,#140e04 100%);
    color:#fff; font-family:'Jost',sans-serif; font-size:13px; font-weight:700;
    letter-spacing:.16em; text-transform:uppercase; cursor:pointer;
    animation:ringPulse 3.5s ease infinite;
    transition:transform .3s,box-shadow .3s; text-decoration:none;
  }
  .cta-btn::before{
    content:'';position:absolute;top:0;left:12%;right:12%;height:1px;
    background:linear-gradient(90deg,transparent,rgba(201,168,76,.65),transparent);
  }
  .cta-btn .sweep{
    position:absolute;inset:0;
    background:linear-gradient(105deg,transparent 25%,rgba(201,168,76,.22) 50%,transparent 75%);
    transform:translateX(-100%);
  }
  .cta-btn:hover{transform:translateY(-2px);box-shadow:0 14px 38px rgba(20,14,4,.42)}
  .cta-btn:hover .sweep{animation:shimmer .7s ease forwards}
  .cta-btn:active{transform:translateY(0)}

  /* form input gold focus */
  .gold-field {
    width:100%; border:1.5px solid #DDD0BE; border-radius:12px;
    padding:13px 16px; font-size:14px; font-weight:500; color:#1a1205;
    background:#fdfaf6; outline:none; font-family:'Jost',sans-serif;
    transition:border-color .2s, box-shadow .2s;
    resize:none;
  }
  .gold-field:focus{border-color:#C9A84C; box-shadow:0 0 0 3px rgba(201,168,76,.12)}
  .gold-field::placeholder{color:#c4b49a}

  /* info card hover */
  .info-card{transition:transform .25s, box-shadow .25s}
  .info-card:hover{transform:translateY(-4px);box-shadow:0 14px 36px rgba(0,0,0,.1) !important}

  /* faq item */
  .faq-item{transition:background .2s, border-color .2s}

  /* ornament slow spin */
  .ornament{animation:spin 50s linear infinite}
  .gem-float{animation:float 3.5s ease-in-out infinite}
`;

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const INFO_CARDS = [
  {
    Icon: Mail,
    title: "Email Us",
    lines: ["hello@ourstorename.com", "support@ourstorename.com"],
    note: "We reply within 24 hours",
    accent: "#C9A84C",
  },
  {
    Icon: Phone,
    title: "Call Us",
    lines: ["+91 98765 43210", "+91 80000 12345"],
    note: "Mon – Sat, 9 AM to 7 PM IST",
    accent: "#b8964e",
  },
  {
    Icon: MapPin,
    title: "Visit Us",
    lines: ["12 Artisan Lane, Johari Bazaar", "Jaipur, Rajasthan 302003"],
    note: "Open Mon – Sat, 10 AM to 6 PM",
    accent: "#a07c3a",
  },
  {
    Icon: Clock,
    title: "Working Hours",
    lines: ["Mon – Fri: 9 AM – 7 PM", "Sat: 10 AM – 5 PM"],
    note: "Sunday: Closed",
    accent: "#c9a030",
  },
];

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 5–7 business days. Express delivery (2–3 days) is available at checkout for select pin codes.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 7-day hassle-free return policy on all products. Items must be unused and in original packaging. Reach out to us and we'll arrange a pickup.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes! We currently ship to 18 countries. International orders typically take 10–14 business days. Duties and taxes are borne by the recipient.",
  },
  {
    q: "Can I track my order?",
    a: "Absolutely. Once your order is dispatched, you'll receive a tracking link via email and SMS. You can also track it on your My Orders page.",
  },
  {
    q: "Are your products authentic and ethically sourced?",
    a: "Every product on our platform is handpicked and verified. We work directly with artisans and certified suppliers, with zero middlemen.",
  },
];

const SOCIALS = [
  { Icon: Instagram,      label: "Instagram",  handle: "@ourstorename",   href: "#" },
  { Icon: MessageCircle,  label: "WhatsApp",   handle: "+91 98765 43210", href: "#" },
  { Icon: Mail,           label: "Newsletter", handle: "Subscribe free",  href: "#" },
];

/* ─────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function Reveal({ children, style = {} }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={style}>
      {vis ? children : <div style={{ minHeight: 80 }} />}
    </div>
  );
}

/* ─────────────────────────────────────────
   FAQ ITEM
───────────────────────────────────────── */
function FaqItem({ q, a, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="faq-item"
      style={{
        border: `1.5px solid ${open ? "#C9A84C" : "#EDE5D8"}`,
        borderRadius: 14,
        overflow: "hidden",
        background: open ? "#fdfaf6" : "#fff",
        marginBottom: 10,
        animationDelay: `${idx * 0.08}s`,
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 16,
          padding: "18px 22px", background: "none", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 14, fontWeight: 600, color: open ? "#3d2a0a" : "#1a1205",
          lineHeight: 1.4,
        }}>
          {q}
        </span>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          background: open ? "#C9A84C" : "#F0E9DB",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background .2s, transform .3s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }}>
          <ChevronDown size={14} color={open ? "#fff" : "#C9A84C"} strokeWidth={2.5} />
        </div>
      </button>

      {open && (
        <div style={{
          padding: "0 22px 18px",
          animation: "fadeUp .25s ease both",
        }}>
          <div style={{ height: 1, background: "#EDE5D8", marginBottom: 14 }} />
          <p style={{
            fontSize: 13.5, color: "#7a6a54", lineHeight: 1.8, margin: 0,
          }}>
            {a}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function ContactPage() {

  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors]   = useState({});
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())       e.name    = "Please enter your name";
    if (!form.email.includes("@")) e.email = "Enter a valid email address";
    if (!form.subject.trim())    e.subject = "Please add a subject";
    if (form.message.trim().length < 20) e.message = "Message must be at least 20 characters";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); setForm({ name:"",email:"",subject:"",message:"" }); }, 1400);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ minHeight: "100vh", background: "#F4EFE6", overflowX: "hidden" }}>

        {/* ══════════════════════════════════════
            § 1  HERO
        ══════════════════════════════════════ */}
        <div style={{
          position: "relative",
          background: "linear-gradient(160deg,#12100c 0%,#251c10 55%,#1a1205 100%)",
          padding: "80px 24px 96px",
          textAlign: "center",
          overflow: "hidden",
        }}>
          {/* noise */}
          <div style={{
            position:"absolute",inset:0,opacity:.35,pointerEvents:"none",
            backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
          }}/>

          {/* rotating circles */}
          <svg className="ornament" style={{ position:"absolute",top:-70,left:-70,opacity:.06,width:240,height:240 }} viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#C9A84C" strokeWidth="1" strokeDasharray="6 8"/>
            <circle cx="100" cy="100" r="65" fill="none" stroke="#C9A84C" strokeWidth=".5" strokeDasharray="3 10"/>
          </svg>
          <svg className="ornament" style={{ position:"absolute",bottom:-80,right:-80,opacity:.07,width:260,height:260,animationDirection:"reverse" }} viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4 10"/>
          </svg>

          {/* breadcrumb */}
          <p style={{ fontSize:12,color:"#9a7d50",letterSpacing:".1em",marginBottom:20,
                      animation:"heroIn .5s ease both" }}>
            <Link href="/" style={{ color:"#9a7d50",textDecoration:"none" }}>Home</Link>
            <span style={{ margin:"0 8px",color:"#C9A84C" }}>›</span>
            <span style={{ color:"#C9A84C",fontWeight:600 }}>Contact Us</span>
          </p>

          {/* eyebrow */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:16,
                        animation:"heroIn .5s ease .1s both" }}>
            <div style={{ height:1,width:44,background:"linear-gradient(90deg,transparent,#C9A84C)" }}/>
            <span style={{ fontSize:11,fontWeight:700,letterSpacing:".28em",color:"#C9A84C",textTransform:"uppercase" }}>Get in Touch</span>
            <div style={{ height:1,width:44,background:"linear-gradient(90deg,#C9A84C,transparent)" }}/>
          </div>

          {/* headline */}
          <h1 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:"clamp(38px,6vw,72px)",fontWeight:700,
            color:"#f5ede0",lineHeight:1.08,margin:"0 auto 20px",maxWidth:700,
            animation:"heroIn .6s ease .2s both",
          }}>
            We'd love to <em style={{ color:"#C9A84C",fontStyle:"italic" }}>hear from you</em>
          </h1>

          <p style={{
            fontSize:15,color:"#a89272",maxWidth:480,margin:"0 auto 0",lineHeight:1.8,
            animation:"heroIn .6s ease .35s both",
          }}>
            A question, a concern, a compliment, or just a hello — our team is here,
            and we always write back.
          </p>

          {/* wave */}
          <svg viewBox="0 0 1440 56" style={{ position:"absolute",bottom:0,left:0,width:"100%",display:"block" }}>
            <path d="M0,28 C360,56 1080,0 1440,28 L1440,56 L0,56 Z" fill="#F4EFE6"/>
          </svg>
        </div>

        {/* ══════════════════════════════════════
            § 2  INFO CARDS
        ══════════════════════════════════════ */}
        <Reveal>
          <div style={{ maxWidth:1100,margin:"0 auto",padding:"64px 24px 0" }}>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:18 }}>
              {INFO_CARDS.map(({ Icon, title, lines, note, accent }, i) => (
                <div
                  key={title}
                  className="info-card from-up"
                  style={{
                    background:"#fff",borderRadius:20,
                    border:"1.5px solid #EDE5D8",
                    boxShadow:"0 2px 20px rgba(0,0,0,.05)",
                    padding:"28px 22px",
                    animationDelay:`${i*.1}s`,
                  }}
                >
                  {/* icon */}
                  <div style={{
                    width:48,height:48,borderRadius:"50%",
                    background:`linear-gradient(135deg,${accent}22,${accent}0a)`,
                    border:`1.5px solid ${accent}44`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    marginBottom:16,
                  }}>
                    <Icon size={20} color={accent} strokeWidth={1.8}/>
                  </div>

                  <h3 style={{
                    fontFamily:"'Cormorant Garamond',serif",
                    fontSize:18,fontWeight:700,color:"#1a1205",margin:"0 0 10px",
                  }}>
                    {title}
                  </h3>

                  {lines.map((l) => (
                    <p key={l} style={{ fontSize:13.5,color:"#5c4220",fontWeight:600,margin:"0 0 3px" }}>{l}</p>
                  ))}

                  <p style={{
                    fontSize:11.5,color:"#A89880",marginTop:8,margin:"8px 0 0",
                    letterSpacing:".03em",
                  }}>
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ══════════════════════════════════════
            § 3  CONTACT FORM + MAP
        ══════════════════════════════════════ */}
        <Reveal>
          <div style={{ maxWidth:1100,margin:"0 auto",padding:"72px 24px" }}>

            {/* section label */}
            <div className="from-up" style={{ textAlign:"center",marginBottom:52 }}>
              <span style={{ fontSize:11,fontWeight:700,letterSpacing:".28em",color:"#C9A84C",textTransform:"uppercase" }}>
                Send a Message
              </span>
              <h2 style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:"clamp(26px,4vw,42px)",fontWeight:700,
                color:"#1a1205",margin:"10px 0 0",
              }}>
                We're just a message away
              </h2>
              <div className="gold-rule" style={{ width:60,margin:"16px auto 0" }}/>
            </div>

            <div style={{ display:"flex",gap:28,alignItems:"flex-start",flexWrap:"wrap" }}>

              {/* ── LEFT: FORM ───────────────────── */}
              <div
                className="from-left"
                style={{
                  flex:"1 1 440px",minWidth:0,
                  background:"#fff",borderRadius:22,
                  border:"1.5px solid #EDE5D8",
                  boxShadow:"0 2px 24px rgba(0,0,0,.05)",
                  padding:"32px",
                }}
              >
                {/* success banner */}
                {sent && (
                  <div style={{
                    display:"flex",alignItems:"flex-start",gap:12,
                    padding:"16px 18px",borderRadius:14,
                    background:"#f0fdf4",border:"1.5px solid #86efac",
                    marginBottom:24,
                    animation:"successSlide .35s ease both",
                  }}>
                    <CheckCircle2 size={20} color="#16a34a" style={{ flexShrink:0,marginTop:1 }}/>
                    <div>
                      <p style={{ fontSize:14,fontWeight:700,color:"#15803d",margin:"0 0 2px" }}>
                        Message sent successfully!
                      </p>
                      <p style={{ fontSize:12.5,color:"#4ade80",margin:0 }}>
                        We'll get back to you within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                {/* name + email row */}
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
                  <div>
                    <label style={{ display:"block",fontSize:12,fontWeight:700,color:"#5c4220",marginBottom:7,letterSpacing:".04em" }}>
                      Full Name <span style={{ color:"#ef4444" }}>*</span>
                    </label>
                    <input
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Your name"
                      className="gold-field"
                      style={{ borderColor: errors.name ? "#f87171" : "#DDD0BE" }}
                    />
                    {errors.name && <p style={{ fontSize:11,color:"#ef4444",marginTop:5 }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label style={{ display:"block",fontSize:12,fontWeight:700,color:"#5c4220",marginBottom:7,letterSpacing:".04em" }}>
                      Email Address <span style={{ color:"#ef4444" }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="your@email.com"
                      className="gold-field"
                      style={{ borderColor: errors.email ? "#f87171" : "#DDD0BE" }}
                    />
                    {errors.email && <p style={{ fontSize:11,color:"#ef4444",marginTop:5 }}>{errors.email}</p>}
                  </div>
                </div>

                {/* subject */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:"block",fontSize:12,fontWeight:700,color:"#5c4220",marginBottom:7,letterSpacing:".04em" }}>
                    Subject <span style={{ color:"#ef4444" }}>*</span>
                  </label>
                  <input
                    value={form.subject}
                    onChange={set("subject")}
                    placeholder="How can we help you?"
                    className="gold-field"
                    style={{ borderColor: errors.subject ? "#f87171" : "#DDD0BE" }}
                  />
                  {errors.subject && <p style={{ fontSize:11,color:"#ef4444",marginTop:5 }}>{errors.subject}</p>}
                </div>

                {/* message */}
                <div style={{ marginBottom:24 }}>
                  <label style={{ display:"block",fontSize:12,fontWeight:700,color:"#5c4220",marginBottom:7,letterSpacing:".04em" }}>
                    Message <span style={{ color:"#ef4444" }}>*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Tell us everything — we're listening…"
                    className="gold-field"
                    style={{ borderColor: errors.message ? "#f87171" : "#DDD0BE" }}
                  />
                  {errors.message && <p style={{ fontSize:11,color:"#ef4444",marginTop:5 }}>{errors.message}</p>}
                  <p style={{ fontSize:11,color:"#A89880",marginTop:6,textAlign:"right" }}>
                    {form.message.length} / 20 min characters
                  </p>
                </div>

                {/* submit */}
                <button
                  className="cta-btn"
                  onClick={handleSubmit}
                  style={{ width:"100%", justifyContent:"center", padding:"15px 0", opacity: sending ? .7 : 1 }}
                >
                  <span className="sweep"/>
                  {sending
                    ? <span style={{ position:"relative",zIndex:1 }}>Sending…</span>
                    : <>
                        <Send size={14} style={{ position:"relative",zIndex:1,color:"#d4a94a" }}/>
                        <span style={{ position:"relative",zIndex:1 }}>Send Message</span>
                        <ArrowRight size={14} style={{ position:"relative",zIndex:1 }}/>
                      </>
                  }
                </button>

                <p style={{ fontSize:11.5,color:"#A89880",textAlign:"center",marginTop:14 }}>
                  🔒 Your information is safe with us. We never share data.
                </p>
              </div>

              {/* ── RIGHT: MAP + SOCIAL ──────────── */}
              <div className="from-right" style={{ flex:"0 0 320px",display:"flex",flexDirection:"column",gap:18 }}>

                {/* decorative map placeholder */}
                <div style={{
                  borderRadius:20,overflow:"hidden",
                  border:"1.5px solid #EDE5D8",
                  boxShadow:"0 2px 20px rgba(0,0,0,.05)",
                  position:"relative",
                }}>
                  {/* Map mock */}
                  <div style={{
                    background:"linear-gradient(145deg,#e8e0d0 0%,#d4cabb 100%)",
                    height:220,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    position:"relative",overflow:"hidden",
                  }}>
                    {/* grid lines */}
                    {[...Array(8)].map((_,i)=>(
                      <div key={`h${i}`} style={{ position:"absolute",left:0,right:0,top:`${i*14}%`,height:1,background:"rgba(180,160,130,0.4)" }}/>
                    ))}
                    {[...Array(10)].map((_,i)=>(
                      <div key={`v${i}`} style={{ position:"absolute",top:0,bottom:0,left:`${i*11}%`,width:1,background:"rgba(180,160,130,0.4)" }}/>
                    ))}

                    {/* location pin */}
                    <div className="gem-float" style={{ position:"relative",zIndex:1,textAlign:"center" }}>
                      <div style={{
                        width:48,height:48,borderRadius:"50%",
                        background:"linear-gradient(135deg,#C9A84C,#e8c96a)",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        margin:"0 auto",
                        boxShadow:"0 6px 20px rgba(201,168,76,.5)",
                      }}>
                        <MapPin size={22} color="#fff" strokeWidth={2}/>
                      </div>
                      <div style={{
                        width:0,height:0,
                        borderLeft:"6px solid transparent",borderRight:"6px solid transparent",
                        borderTop:"10px solid #C9A84C",
                        margin:"0 auto",
                      }}/>
                    </div>
                  </div>

                  {/* address below map */}
                  <div style={{ padding:"16px 18px",background:"#fff" }}>
                    <p style={{ fontSize:13,fontWeight:700,color:"#1a1205",margin:"0 0 4px" }}>
                      Our Jaipur Studio
                    </p>
                    <p style={{ fontSize:12.5,color:"#A89880",margin:0,lineHeight:1.6 }}>
                      12 Artisan Lane, Johari Bazaar<br/>
                      Jaipur, Rajasthan 302003
                    </p>
                  </div>
                </div>

                {/* social channels */}
                <div style={{
                  background:"#fff",borderRadius:20,
                  border:"1.5px solid #EDE5D8",
                  boxShadow:"0 2px 20px rgba(0,0,0,.05)",
                  padding:"22px",
                }}>
                  <p style={{
                    fontSize:11,fontWeight:700,letterSpacing:".2em",
                    textTransform:"uppercase",color:"#C9A84C",marginBottom:16,
                  }}>
                    Find Us Online
                  </p>
                  <div className="gold-rule" style={{ marginBottom:16 }}/>

                  {SOCIALS.map(({ Icon, label, handle, href }) => (
                    <a
                      key={label}
                      href={href}
                      style={{
                        display:"flex",alignItems:"center",gap:12,
                        padding:"11px 14px",borderRadius:12,
                        border:"1.5px solid #EDE5D8",background:"#fdfaf6",
                        marginBottom:10,textDecoration:"none",
                        transition:"border-color .2s,background .2s",
                      }}
                      onMouseEnter={(e)=>{ e.currentTarget.style.borderColor="#C9A84C"; e.currentTarget.style.background="#fdf9f0"; }}
                      onMouseLeave={(e)=>{ e.currentTarget.style.borderColor="#EDE5D8"; e.currentTarget.style.background="#fdfaf6"; }}
                    >
                      <div style={{
                        width:34,height:34,borderRadius:"50%",
                        background:"rgba(201,168,76,.12)",
                        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                      }}>
                        <Icon size={16} color="#C9A84C" strokeWidth={1.8}/>
                      </div>
                      <div>
                        <p style={{ fontSize:13,fontWeight:700,color:"#1a1205",margin:0 }}>{label}</p>
                        <p style={{ fontSize:11.5,color:"#A89880",margin:0 }}>{handle}</p>
                      </div>
                      <ArrowRight size={13} color="#C9A84C" style={{ marginLeft:"auto" }}/>
                    </a>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </Reveal>

        {/* ══════════════════════════════════════
            § 4  FAQ
        ══════════════════════════════════════ */}
        <Reveal>
          <div style={{
            background:"#F0E9DB",borderTop:"1.5px solid #E5D9C8",
            borderBottom:"1.5px solid #E5D9C8",padding:"80px 24px",
          }}>
            <div style={{ maxWidth:760,margin:"0 auto" }}>

              {/* heading */}
              <div className="from-up" style={{ textAlign:"center",marginBottom:48 }}>
                <span style={{ fontSize:11,fontWeight:700,letterSpacing:".28em",color:"#C9A84C",textTransform:"uppercase" }}>
                  FAQ
                </span>
                <h2 style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:"clamp(26px,4vw,42px)",fontWeight:700,
                  color:"#1a1205",margin:"10px 0 0",
                }}>
                  Questions we get asked a lot
                </h2>
                <div className="gold-rule" style={{ width:60,margin:"16px auto 0" }}/>
              </div>

              {FAQS.map((f, i) => <FaqItem key={f.q} q={f.q} a={f.a} idx={i} />)}

              <p style={{ fontSize:13,color:"#A89880",textAlign:"center",marginTop:28 }}>
                Didn't find your answer?{" "}
                <a href="mailto:hello@ourstorename.com" style={{ color:"#C9A84C",fontWeight:700,textDecoration:"none" }}>
                  Email us directly →
                </a>
              </p>
            </div>
          </div>
        </Reveal>

        {/* ══════════════════════════════════════
            § 5  CLOSING CTA BANNER
        ══════════════════════════════════════ */}
        <Reveal>
          <div style={{ maxWidth:1100,margin:"0 auto",padding:"72px 24px 80px" }}>
            <div
              className="from-up"
              style={{
                background:"linear-gradient(135deg,#12100c 0%,#3d2a0a 50%,#12100c 100%)",
                borderRadius:24,padding:"60px 40px",
                textAlign:"center",position:"relative",overflow:"hidden",
                boxShadow:"0 16px 56px rgba(0,0,0,.22)",
              }}
            >
              {/* top gold rule */}
              <div style={{
                position:"absolute",top:0,left:"10%",right:"10%",height:1,
                background:"linear-gradient(90deg,transparent,#C9A84C,transparent)",
              }}/>

              {/* dot grid bg */}
              <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:.04 }} viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
                {[...Array(5)].map((_,r)=>[...Array(12)].map((_,c)=>(
                  <circle key={`${r}-${c}`} cx={c*38+19} cy={r*45+22} r="2.5" fill="#C9A84C"/>
                )))}
              </svg>

              <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:18 }}>
                <div style={{ height:1,width:36,background:"linear-gradient(90deg,transparent,#C9A84C)" }}/>
                <Sparkles size={14} color="#C9A84C"/>
                <div style={{ height:1,width:36,background:"linear-gradient(90deg,#C9A84C,transparent)" }}/>
              </div>

              <h2 style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:"clamp(24px,4vw,42px)",fontWeight:700,
                color:"#f5ede0",margin:"0 0 12px",lineHeight:1.15,
                position:"relative",zIndex:1,
              }}>
                While you're here — explore what we love
              </h2>

              <p style={{
                fontSize:14,color:"#a89272",maxWidth:460,margin:"0 auto 32px",
                lineHeight:1.8,position:"relative",zIndex:1,
              }}>
                Handcrafted jewellery, blooming florals, and artisan botanicals — all waiting for you.
              </p>

              <Link href="/products" className="cta-btn" style={{ position:"relative",zIndex:1 }}>
                <span className="sweep"/>
                <Sparkles size={13} style={{ position:"relative",zIndex:1,color:"#d4a94a" }}/>
                <span style={{ position:"relative",zIndex:1 }}>Browse Collection</span>
                <ArrowRight size={13} style={{ position:"relative",zIndex:1 }}/>
              </Link>
            </div>
          </div>
        </Reveal>

      </div>
    </>
  );
}