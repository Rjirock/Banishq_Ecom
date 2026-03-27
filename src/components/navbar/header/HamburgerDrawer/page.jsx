// components/header/HamburgerDrawer.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X, Sparkles, Gem, Shirt, FlaskConical, Flower2,
  Home, Info, Image, Phone, Package,
  ChevronRight, Tag, Gift, Truck, LogOut, User,
} from "lucide-react";

const CATEGORIES = [
  { label: "Jewellery", icon: Gem,         href: "/category/jewellery-collection", badge: "New Arrivals" },
  { label: "Women's",   icon: Shirt,        href: "/category/women",                badge: null           },
  { label: "Cosmetics", icon: FlaskConical, href: "/category/cosmetic-collection",  badge: "Trending"     },
  { label: "Florals",   icon: Flower2,      href: "/products?category=florals",     badge: null           },
];

const QUICK_LINKS = [
  { label: "Home",       icon: Home,  href: "/"        },
  { label: "About Us",   icon: Info,  href: "/about"   },
  { label: "Gallery",    icon: Image, href: "/gallery" },
  { label: "Contact Us", icon: Phone, href: "/contact" },
];

const OFFERS = [
  { icon: Tag,   text: "Use code SAVE10 for 10% off"        },
  { icon: Truck, text: "Free delivery on orders ₹999+"      },
  { icon: Gift,  text: "Gift wrapping available at checkout" },
];

export default function HamburgerDrawer({ open, onClose, user, onLogout }) {
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const go = (href) => { onClose(); router.push(href); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Jost:wght@400;500;600;700&display=swap');
        @keyframes drawerIn  { from{transform:translateX(-100%)} to{transform:translateX(0)}  }
        @keyframes drawerOut { from{transform:translateX(0)} to{transform:translateX(-100%)} }
        @keyframes bdIn      { from{opacity:0} to{opacity:1} }
        @keyframes bdOut     { from{opacity:1} to{opacity:0} }
        @keyframes rowIn     { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        .d-panel { animation: drawerIn .38s cubic-bezier(.22,1,.36,1) both }
        .d-panel.out { animation: drawerOut .3s ease forwards }
        .d-bd    { animation: bdIn .28s ease both }
        .d-bd.out{ animation: bdOut .28s ease forwards }
        .cat-row {
          display:flex;align-items:center;gap:13px;padding:12px 18px;
          border-radius:13px;cursor:pointer;text-decoration:none;color:inherit;
          transition:background .16s,transform .16s;animation:rowIn .4s ease both;
        }
        .cat-row:hover { background:#fdf9f0; transform:translateX(4px) }
        .ql-row {
          display:flex;align-items:center;gap:11px;padding:10px 14px;
          border-radius:11px;cursor:pointer;text-decoration:none;color:inherit;
          transition:background .16s;animation:rowIn .4s ease both;
        }
        .ql-row:hover { background:#f7f3ee }
      `}</style>

      {/* backdrop */}
      <div
        className={`d-bd${!open ? " out" : ""}`}
        onClick={onClose}
        style={{ position:"fixed",inset:0,zIndex:9998,
          background:"rgba(10,8,4,0.65)",backdropFilter:"blur(4px)" }}
      />

      {/* panel */}
      <div
        className={`d-panel${!open ? " out" : ""}`}
        style={{ position:"fixed",top:0,left:0,bottom:0,zIndex:9999,
          width:330,maxWidth:"88vw",background:"#fff",
          boxShadow:"8px 0 48px rgba(0,0,0,0.18)",
          display:"flex",flexDirection:"column",overflow:"hidden",
          fontFamily:"'Jost',sans-serif" }}
      >
        {/* gold top bar */}
        <div style={{ height:3,background:"linear-gradient(90deg,#C9A84C,#e8c96a,#C9A84C)",flexShrink:0 }}/>

        {/* header */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"16px 18px 14px",borderBottom:"1px solid #f0ece6",
          background:"#fdfaf6",flexShrink:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <Sparkles size={14} color="#C9A84C"/>
            <span style={{ fontFamily:"'Cormorant Garamond',serif",
              fontSize:19,fontWeight:700,color:"#1a1205" }}>Explore</span>
          </div>
          <button onClick={onClose}
            style={{ width:30,height:30,borderRadius:"50%",border:"1.5px solid #EDE5D8",
              background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",
              cursor:"pointer",color:"#888",transition:"all .15s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#C9A84C";e.currentTarget.style.color="#C9A84C"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#EDE5D8";e.currentTarget.style.color="#888"}}
          >
            <X size={13} strokeWidth={2.5}/>
          </button>
        </div>

        {/* scrollable body */}
        <div style={{ flex:1,overflowY:"auto",padding:"18px 14px 28px" }}>

          {/* user card */}
          {user && (
            <div onClick={() => go("/profile")}
              style={{ display:"flex",alignItems:"center",gap:11,padding:"13px 14px",
                borderRadius:14,cursor:"pointer",marginBottom:20,
                background:"linear-gradient(120deg,#fdf8f0,#f5ede0)",
                border:"1.5px solid #EDE5D8",transition:"box-shadow .2s",
                animation:"rowIn .3s ease both" }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 18px rgba(201,168,76,.18)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}
            >
              <div style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,
                background:"linear-gradient(135deg,#d4a373,#7a6030)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:13,fontWeight:700,color:"#fff" }}>
                {user.name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()}
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <p style={{ fontSize:13,fontWeight:700,color:"#1a1205",margin:0,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{user.name}</p>
                <p style={{ fontSize:10.5,color:"#A89880",margin:0,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{user.email}</p>
              </div>
              <ChevronRight size={13} color="#C9A84C"/>
            </div>
          )}

          {/* categories */}
          <p style={{ fontSize:9.5,fontWeight:700,letterSpacing:".22em",textTransform:"uppercase",
            color:"#C9A84C",margin:"0 4px 9px",paddingLeft:4 }}>Shop by Category</p>
          <div style={{ marginBottom:22 }}>
            {CATEGORIES.map((cat,i) => (
              <a key={cat.label} className="cat-row" href={cat.href}
                onClick={e=>{e.preventDefault();go(cat.href)}}
                style={{ animationDelay:`${i*.06}s`,marginBottom:3 }}>
                <div style={{ width:36,height:36,borderRadius:11,flexShrink:0,
                  background:"linear-gradient(135deg,rgba(201,168,76,.15),rgba(201,168,76,.05))",
                  border:"1.5px solid rgba(201,168,76,.25)",
                  display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <cat.icon size={16} color="#C9A84C" strokeWidth={1.7}/>
                </div>
                <span style={{ flex:1,fontSize:13.5,fontWeight:600,color:"#1a1205" }}>{cat.label}</span>
                {cat.badge && (
                  <span style={{ fontSize:8.5,fontWeight:700,letterSpacing:".08em",
                    textTransform:"uppercase",padding:"3px 7px",borderRadius:20,
                    background:"#fdf9e8",border:"1px solid rgba(201,168,76,.3)",color:"#7a6030" }}>
                    {cat.badge}
                  </span>
                )}
                <ChevronRight size={12} color="#C9A84C" style={{ flexShrink:0 }}/>
              </a>
            ))}
          </div>

          <div style={{ height:1,background:"linear-gradient(90deg,transparent,#EDE5D8,transparent)",margin:"0 0 18px" }}/>

          {/* quick links */}
          <p style={{ fontSize:9.5,fontWeight:700,letterSpacing:".22em",textTransform:"uppercase",
            color:"#A89880",margin:"0 4px 9px",paddingLeft:4 }}>Quick Links</p>
          <div style={{ marginBottom:22 }}>
            {QUICK_LINKS.map((link,i) => (
              <a key={link.label} className="ql-row" href={link.href}
                onClick={e=>{e.preventDefault();go(link.href)}}
                style={{ animationDelay:`${(i+4)*.06}s`,marginBottom:2 }}>
                <link.icon size={14} color="#A89880" strokeWidth={1.8}/>
                <span style={{ fontSize:13,fontWeight:500,color:"#3d2a0a" }}>{link.label}</span>
              </a>
            ))}
            {user && (
              <a className="ql-row" href="profile?tab=my-order"
                onClick={e=>{e.preventDefault();go("profile?tab=my-order")}}
                style={{ animationDelay:".32s",marginBottom:2 }}>
                <Package size={14} color="#A89880" strokeWidth={1.8}/>
                <span style={{ fontSize:13,fontWeight:500,color:"#3d2a0a" }}>My Orders</span>
              </a>
            )}
          </div>

          <div style={{ height:1,background:"linear-gradient(90deg,transparent,#EDE5D8,transparent)",margin:"0 0 18px" }}/>

          {/* offers */}
          <p style={{ fontSize:9.5,fontWeight:700,letterSpacing:".22em",textTransform:"uppercase",
            color:"#A89880",margin:"0 4px 9px",paddingLeft:4 }}>Today's Offers</p>
          <div style={{ display:"flex",flexDirection:"column",gap:7,marginBottom:24 }}>
            {OFFERS.map((o,i) => (
              <div key={i} style={{ display:"flex",alignItems:"center",gap:9,
                padding:"9px 12px",borderRadius:11,
                background:"#fdfaf6",border:"1px solid #EDE5D8",
                animation:`rowIn .4s ease ${(i+6)*.07}s both` }}>
                <o.icon size={13} color="#C9A84C" strokeWidth={1.8}/>
                <span style={{ fontSize:11.5,color:"#7a6030",fontWeight:500,lineHeight:1.4 }}>{o.text}</span>
              </div>
            ))}
          </div>

          {/* auth buttons */}
          {user ? (
            <button onClick={() => { onClose(); onLogout(); }}
              style={{ width:"100%",padding:"11px 0",borderRadius:11,
                border:"1.5px solid #fca5a5",background:"#fff5f5",color:"#ef4444",
                fontSize:13,fontWeight:700,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                transition:"background .2s" }}
              onMouseEnter={e=>e.currentTarget.style.background="#fee2e2"}
              onMouseLeave={e=>e.currentTarget.style.background="#fff5f5"}>
              <LogOut size={13}/> Log Out
            </button>
          ) : (
            <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
              <button onClick={() => go("/sign-up")}
                style={{ width:"100%",padding:"12px 0",borderRadius:11,border:"none",cursor:"pointer",
                  background:"linear-gradient(120deg,#140e04,#3a2408,#5a3a0c,#140e04)",
                  color:"#fff",fontSize:12.5,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:7 }}>
                <User size={13}/> Create Account
              </button>
              <button onClick={() => go("/login")}
                style={{ width:"100%",padding:"11px 0",borderRadius:11,
                  border:"2px solid #C9A84C",background:"transparent",color:"#7a6030",
                  fontSize:12.5,fontWeight:700,cursor:"pointer",
                  letterSpacing:".1em",textTransform:"uppercase" }}>
                Log In
              </button>
            </div>
          )}
        </div>

        {/* footer */}
        <div style={{ borderTop:"1px solid #f0ece6",padding:"12px 18px",background:"#fdfaf6",
          flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",gap:7 }}>
          <Sparkles size={10} color="#C9A84C"/>
          <span style={{ fontSize:10.5,color:"#A89880",letterSpacing:".08em" }}>
            Premium Curated Collections
          </span>
          <Sparkles size={10} color="#C9A84C"/>
        </div>
      </div>
    </>
  );
}