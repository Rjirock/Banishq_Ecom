// components/Header.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart, Heart, User, Menu, Search, Bell,
  ChevronDown, BadgeCheck, LogOut, Settings, X,
  Gem, Sparkles, Flower2, Shirt, FlaskConical,
  Home, Info, Image, Phone, Package,
  ChevronRight, Tag, Gift, Truck,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

/* ─────────────────────────────────────────────
   DRAWER DATA
───────────────────────────────────────────── */
const CATEGORIES = [
  { label: "Jewellery", icon: Gem,         href: "/category/jewellery-collection", badge: "New Arrivals" },
  { label: "Women's",   icon: Shirt,        href: "/category/women",                badge: null           },
  { label: "Cosmetics", icon: FlaskConical, href: "/category/cosmetic-collection",  badge: "Trending"     },
  { label: "Florals",   icon: Flower2,      href: "/products?category=florals",     badge: null           },
];
const QUICK_LINKS = [
  { label: "Home",       icon: Home,    href: "/"         },
  { label: "About Us",   icon: Info,    href: "/about"    },
  { label: "Products",   icon: Package, href: "/products" }, // ← added
  { label: "Gallery",    icon: Image,   href: "/gallery"  },
  { label: "Contact Us", icon: Phone,   href: "/contact"  },
];
const OFFERS = [
  { icon: Tag,   text: "Use code SAVE10 for 10% off"        },
  { icon: Truck, text: "Free delivery on orders ₹999+"      },
  { icon: Gift,  text: "Gift wrapping available at checkout" },
];

/* ─────────────────────────────────────────────
   HAMBURGER DRAWER
───────────────────────────────────────────── */
function HamburgerDrawer({ open, onClose, user, onLogout }) {
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
        @keyframes drawerOut { from{transform:translateX(0)}     to{transform:translateX(-100%)} }
        @keyframes bdIn      { from{opacity:0} to{opacity:1} }
        @keyframes bdOut     { from{opacity:1} to{opacity:0} }
        @keyframes rowIn     { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        .d-panel { animation: drawerIn  .38s cubic-bezier(.22,1,.36,1) both }
        .d-panel.out { animation: drawerOut .3s ease forwards }
        .d-bd    { animation: bdIn  .28s ease both }
        .d-bd.out{ animation: bdOut .28s ease forwards }
        .cat-row {
          display:flex;align-items:center;gap:13px;padding:12px 18px;
          border-radius:13px;cursor:pointer;text-decoration:none;color:inherit;
          transition:background .16s,transform .16s;animation:rowIn .4s ease both;
        }
        .cat-row:hover{background:#fdf9f0;transform:translateX(4px)}
        .ql-row{
          display:flex;align-items:center;gap:11px;padding:10px 14px;
          border-radius:11px;cursor:pointer;text-decoration:none;color:inherit;
          transition:background .16s;animation:rowIn .4s ease both;
        }
        .ql-row:hover{background:#f7f3ee}
      `}</style>

      {/* backdrop */}
      <div className={`d-bd${!open?" out":""}`}
        onClick={onClose}
        style={{ position:"fixed",inset:0,zIndex:9998,
          background:"rgba(10,8,4,0.65)",backdropFilter:"blur(4px)" }}
      />

      {/* panel */}
      <div className={`d-panel${!open?" out":""}`}
        style={{ position:"fixed",top:0,left:0,bottom:0,zIndex:9999,
          width:330,maxWidth:"88vw",background:"#fff",
          boxShadow:"8px 0 48px rgba(0,0,0,0.18)",
          display:"flex",flexDirection:"column",overflow:"hidden",
          fontFamily:"'Jost',sans-serif" }}
      >
        {/* gold bar */}
        <div style={{ height:3,background:"linear-gradient(90deg,#C9A84C,#e8c96a,#C9A84C)",flexShrink:0 }}/>

        {/* drawer header */}
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

        {/* body */}
        <div style={{ flex:1,overflowY:"auto",padding:"18px 14px 28px" }}>

          {/* user card */}
          {user && (
            <div onClick={()=>go("/profile")}
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
            {CATEGORIES.map((cat,i)=>(
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
                {cat.badge&&(
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
            {QUICK_LINKS.map((link,i)=>(
              <a key={link.label} className="ql-row" href={link.href}
                onClick={e=>{e.preventDefault();go(link.href)}}
                style={{ animationDelay:`${(i+4)*.06}s`,marginBottom:2 }}>
                <link.icon size={14} color="#A89880" strokeWidth={1.8}/>
                <span style={{ fontSize:13,fontWeight:500,color:"#3d2a0a" }}>{link.label}</span>
              </a>
            ))}
            {user&&(
              <a className="ql-row" href="/orders"
                onClick={e=>{e.preventDefault();go("/orders")}}
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
            {OFFERS.map((o,i)=>(
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
            <button onClick={()=>{onClose();onLogout()}}
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
              <button onClick={()=>go("/sign-up")}
                style={{ width:"100%",padding:"12px 0",borderRadius:11,border:"none",cursor:"pointer",
                  background:"linear-gradient(120deg,#140e04,#3a2408,#5a3a0c,#140e04)",
                  color:"#fff",fontSize:12.5,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:7 }}>
                <User size={13}/> Create Account
              </button>
              <button onClick={()=>go("/login")}
                style={{ width:"100%",padding:"11px 0",borderRadius:11,
                  border:"2px solid #C9A84C",background:"transparent",color:"#7a6030",
                  fontSize:12.5,fontWeight:700,cursor:"pointer",
                  letterSpacing:".1em",textTransform:"uppercase" }}>
                Log In
              </button>
            </div>
          )}
        </div>

        {/* drawer footer */}
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

/* ─────────────────────────────────────────────
   MAIN HEADER
───────────────────────────────────────────── */
export default function Header() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout, ready } = useAuth();
  const { totalItems } = useCart();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const dropdownRef  = useRef(null);
  const searchRef    = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target))
        setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menuItems = [
    { name: "Home",       path: "/"         },
    { name: "About Us",   path: "/about"    },
    { name: "Products",   path: "/products" },
    { name: "Gallery",    path: "/gallery"  },
    { name: "Contact Us", path: "/contact"  },
  ];

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/login");
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlide {
          from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)}
        }
        @keyframes badgePop {
          0%{transform:scale(0)} 70%{transform:scale(1.25)} 100%{transform:scale(1)}
        }
        @keyframes searchSlide {
          from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)}
        }

        /* ── Responsive nav: hide on < lg ── */
        .hdr-nav       { display: flex }
        .hdr-hamburger { display: none }

        /* ── Bottom bar: full width search on md+ ── */
        .search-wrap { width: 650px }

        @media (max-width: 1024px) {
          .hdr-nav       { display: none  }
          .hdr-hamburger { display: flex  }
          .search-wrap   { width: 100%; max-width: 500px }
        }

        @media (max-width: 768px) {
          .search-wrap { max-width: 100%; flex: 1 }
          .hdr-bell    { display: none }
        }

        @media (max-width: 480px) {
          .hdr-logo img  { height: 40px !important }
          .hdr-icons-gap { gap: 14px !important }
          .bottom-bar-px { padding-left: 14px !important; padding-right: 14px !important }
          .top-bar-px    { padding-left: 14px !important; padding-right: 14px !important }
        }

        /* mobile search overlay */
        .mobile-search-overlay {
          display: none;
        }
        @media (max-width: 640px) {
          .desktop-search { display: none }
          .mobile-search-btn { display: flex !important }
          .mobile-search-overlay.active {
            display: flex;
            position: fixed; top: 0; left: 0; right: 0; zIndex: 9990;
            padding: 12px 14px;
            background: #fff;
            box-shadow: 0 4px 20px rgba(0,0,0,0.12);
            animation: searchSlide .25s ease both;
          }
        }
      `}</style>

      <header style={{ position:"fixed",top:0,left:0,right:0,zIndex:50,width:"100%" }}>

        {/* ══════════════════════════════════
            TOP BAR
        ══════════════════════════════════ */}
        <div style={{ background:"#E8D2B5",borderBottom:"1px solid rgba(0,0,0,0.1)",width:"100%" }}>
          <div className="top-bar-px"
            style={{ maxWidth:1440,margin:"0 auto",height:68,
              display:"flex",alignItems:"center",justifyContent:"space-between",
              paddingLeft:24,paddingRight:24 }}>

            {/* Logo */}
            <Link href="/" className="hdr-logo" style={{ display:"flex",alignItems:"center",flexShrink:0 }}>
              <img src="/logo.png" alt="BANISHQ" style={{ height:50,objectFit:"contain",display:"block" }}/>
            </Link>

            {/* Desktop nav */}
            <nav className="hdr-nav" style={{ alignItems:"center",gap:28 }}>
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <div key={item.path} style={{ position:"relative" }}>
                    <Link href={item.path} style={{
                      fontSize:15,fontWeight:500,textDecoration:"none",
                      color: isActive ? "#C6A75E" : "#1a1205",
                      transition:"color .2s",
                    }}
                    onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.color="#C6A75E" }}
                    onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.color="#1a1205" }}
                    >
                      {item.name}
                    </Link>
                    {isActive && (
                      <div style={{ position:"absolute",bottom:-6,left:0,right:0,
                        height:2.5,borderRadius:2,
                        background:"linear-gradient(90deg,#C9A84C,#e8c96a)" }}/>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Icons */}
            <div className="hdr-icons-gap"
              style={{ display:"flex",alignItems:"center",gap:20 }}>

              {/* Cart */}
              <Link href="/cart" style={{ position:"relative",display:"inline-flex",color:"#1a1205" }}>
                <ShoppingCart size={22} strokeWidth={1.6}/>
                {totalItems > 0 && (
                  <span style={{
                    position:"absolute",top:-8,right:-10,
                    minWidth:20,height:20,padding:"0 4px",borderRadius:99,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:10,fontWeight:800,color:"#1a1205",lineHeight:1,
                    background:"linear-gradient(135deg,#e8c96a,#C9A84C,#a07c2a)",
                    boxShadow:"0 2px 8px rgba(201,168,76,.55),0 0 0 2px #E8D2B5",
                    animation:"badgePop .35s cubic-bezier(.22,1,.36,1) both",
                  }}>
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              <Link href="/my-whishlist" style={{ color:"#1a1205",display:"inline-flex" }}>
                <Heart size={22} strokeWidth={1.6}/>
              </Link>

              {/* Mobile search button */}
              <button
                className="mobile-search-btn"
                style={{ display:"none",background:"none",border:"none",
                  cursor:"pointer",color:"#1a1205",padding:0,alignItems:"center" }}
                onClick={() => setSearchOpen(true)}
              >
                <Search size={22} strokeWidth={1.6}/>
              </button>

              {/* Profile */}
              {ready && (
                user ? (
                  <div style={{ position:"relative" }} ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(v => !v)}
                      style={{ width:36,height:36,borderRadius:"50%",
                        background:"linear-gradient(135deg,#d4a373,#7a6030)",
                        border:"2px solid rgba(198,167,94,.5)",cursor:"pointer",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        position:"relative",transition:"transform .2s" }}
                      onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                      title={user.name}
                    >
                      <span style={{ color:"#fff",fontWeight:700,fontSize:12 }}>
                        {user.name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()}
                      </span>
                      <span style={{ position:"absolute",bottom:-1,right:-1,width:14,height:14,
                        borderRadius:"50%",background:"#22c55e",border:"2px solid #E8D2B5",
                        display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <svg viewBox="0 0 10 10" width="8" height="8" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </button>

                    {dropdownOpen && (
                      <div style={{
                        position:"absolute",right:0,top:46,width:208,
                        background:"#fff",borderRadius:16,
                        boxShadow:"0 8px 32px rgba(0,0,0,0.13)",
                        border:"1px solid #f0ece6",overflow:"hidden",zIndex:60,
                        animation:"fadeSlide .2s ease both",
                      }}>
                        <div style={{ padding:"14px 16px",background:"#fdf8f2",
                          borderBottom:"1px solid #f0ece6" }}>
                          <p style={{ fontSize:13,fontWeight:700,color:"#1a1205",margin:0,
                            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                            {user.name}
                          </p>
                          <p style={{ fontSize:11,color:"#A89880",margin:"2px 0 0",
                            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                            {user.email}
                          </p>
                          <span style={{ display:"inline-flex",alignItems:"center",gap:4,
                            marginTop:6,fontSize:9.5,fontWeight:700,color:"#16a34a",
                            background:"#f0fdf4",padding:"2px 8px",borderRadius:20 }}>
                            <BadgeCheck size={9}/> Verified
                          </span>
                        </div>
                        {[
                          { icon: User,     label:"My Profile", href:"/profile" },
                          { icon: Settings, label:"My Orders",  href:"/orders"  },
                        ].map(({icon:Icon,label,href})=>(
                          <Link key={href} href={href} onClick={()=>setDropdownOpen(false)}
                            style={{ display:"flex",alignItems:"center",gap:10,
                              padding:"11px 16px",textDecoration:"none",
                              color:"#3d2a0a",fontSize:13,fontWeight:500,
                              transition:"background .15s" }}
                            onMouseEnter={e=>e.currentTarget.style.background="#fdf8f2"}
                            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                          >
                            <Icon size={13} color="#b8964e"/> {label}
                          </Link>
                        ))}
                        <button onClick={handleLogout}
                          style={{ width:"100%",display:"flex",alignItems:"center",gap:10,
                            padding:"11px 16px",border:"none",cursor:"pointer",
                            background:"transparent",color:"#ef4444",fontSize:13,fontWeight:500,
                            transition:"background .15s" }}
                          onMouseEnter={e=>e.currentTarget.style.background="#fff5f5"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                        >
                          <LogOut size={13}/> Log Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/sign-up"
                    style={{ display:"inline-flex",color:"#1a1205",
                      transition:"color .15s" }}
                    onMouseEnter={e=>e.currentTarget.style.color="#C6A75E"}
                    onMouseLeave={e=>e.currentTarget.style.color="#1a1205"}
                  >
                    <User size={22} strokeWidth={1.6}/>
                  </Link>
                )
              )}

              {/* Hamburger — visible < lg */}
              <button
                className="hdr-hamburger"
                onClick={() => setDrawerOpen(true)}
                style={{ background:"none",border:"none",cursor:"pointer",
                  color:"#1a1205",padding:4,borderRadius:8,
                  display:"none",alignItems:"center",justifyContent:"center",
                  transition:"background .16s" }}
                onMouseEnter={e=>e.currentTarget.style.background="#f5ede0"}
                onMouseLeave={e=>e.currentTarget.style.background="none"}
                title="Menu"
              >
                <Menu size={24} strokeWidth={1.6}/>
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════
            BOTTOM BAR (search + hamburger for desktop)
        ══════════════════════════════════ */}
        <div style={{ background:"#fff",boxShadow:"0 4px 15px rgba(0,0,0,0.08)",width:"100%" }}>
          <div className="bottom-bar-px"
            style={{ maxWidth:1440,margin:"0 auto",height:76,
              display:"flex",alignItems:"center",justifyContent:"space-between",
              gap:16,paddingLeft:48,paddingRight:48 }}>

            {/* Desktop hamburger */}
            <button
              onClick={() => setDrawerOpen(true)}
              style={{ background:"none",border:"none",cursor:"pointer",flexShrink:0,
                color:"#1a1205",padding:6,borderRadius:10,
                display:"flex",alignItems:"center",justifyContent:"center",
                transition:"background .16s,transform .16s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#f5ede0";e.currentTarget.style.transform="scale(1.06)"}}
              onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.transform="scale(1)"}}
              title="Browse Categories"
            >
              <Menu size={26} strokeWidth={1.5}/>
            </button>

            {/* Search bar */}
            <div className="search-wrap desktop-search"
              style={{ position:"relative",flexShrink:0 }}>
              <input type="text" placeholder="Search products, brands…"
                style={{ width:"100%",height:54,borderRadius:40,
                  border:"2px solid #e5e5e5",paddingLeft:20,paddingRight:52,
                  fontSize:15,outline:"none",fontFamily:"'Jost',sans-serif",
                  background:"#fafafa",transition:"border-color .2s,box-shadow .2s" }}
                onFocus={e=>{e.target.style.borderColor="#C6A75E";e.target.style.boxShadow="0 0 0 3px rgba(198,167,94,.12)"}}
                onBlur={e=>{e.target.style.borderColor="#e5e5e5";e.target.style.boxShadow="none"}}
              />
              <Search size={20} strokeWidth={1.5} color="#999"
                style={{ position:"absolute",right:18,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}/>
            </div>

            {/* Bell */}
            <Bell className="hdr-bell" size={24} strokeWidth={1.5}
              style={{ flexShrink:0,cursor:"pointer",color:"#1a1205",
                transition:"color .15s" }}/>
          </div>
        </div>

        {/* ══════════════════════════════════
            MOBILE SEARCH OVERLAY
        ══════════════════════════════════ */}
        {searchOpen && (
          <div style={{ position:"fixed",top:0,left:0,right:0,zIndex:9990,
            padding:"10px 14px",background:"#fff",display:"flex",alignItems:"center",gap:10,
            boxShadow:"0 4px 20px rgba(0,0,0,0.12)",animation:"searchSlide .25s ease both" }}
            ref={searchRef}
          >
            <div style={{ flex:1,position:"relative" }}>
              <Search size={16} color="#999"
                style={{ position:"absolute",left:14,top:"50%",transform:"translateY(-50%)" }}/>
              <input autoFocus type="text" placeholder="Search products…"
                style={{ width:"100%",height:46,borderRadius:30,border:"2px solid #C6A75E",
                  paddingLeft:38,paddingRight:14,fontSize:14,outline:"none",
                  fontFamily:"'Jost',sans-serif",background:"#fff" }}/>
            </div>
            <button onClick={()=>setSearchOpen(false)}
              style={{ width:36,height:36,borderRadius:"50%",border:"1.5px solid #EDE5D8",
                background:"#fdfaf6",display:"flex",alignItems:"center",justifyContent:"center",
                cursor:"pointer",color:"#888",flexShrink:0 }}>
              <X size={14} strokeWidth={2.5}/>
            </button>
          </div>
        )}
      </header>

      {/* Drawer */}
      {drawerOpen && (
        <HamburgerDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          user={user}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}