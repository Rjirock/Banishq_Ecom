// components/Header.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart, Heart, User, Menu, Search,
  Bell, BadgeCheck, LogOut, Settings, X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth }    from "@/context/AuthContext";
import { useCart }    from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import HamburgerDrawer from "./HamburgerDrawer/page";
import { DesktopSearchBar, MobileSearchOverlay } from "./SearchBar/page";

const menuItems = [
  { name: "Home",       path: "/"         },
  { name: "About Us",   path: "/about"    },
  { name: "Products",   path: "/products" },
  { name: "Gallery",    path: "/gallery"  },
  { name: "Contact Us", path: "/contact"  },
];

/* tiny helper — fires onClose after delay ms */
function AutoClose({ onClose, delay }) {
  useEffect(() => {
    const t = setTimeout(onClose, delay);
    return () => clearTimeout(t);
  }, []);
  return null;
}

export default function Header() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout, ready } = useAuth();
  const { totalItems }    = useCart();
  const { totalWishlist } = useWishlist();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const dropdownRef = useRef(null);

  /* close profile dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [logoutPopup, setLogoutPopup] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setLogoutPopup(true);        // show the confirmation popup
  };

  const handleLogoutPopupClose = () => {
    setLogoutPopup(false);
    router.push("/");            // go home when ✕ is clicked
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

        .hdr-nav       { display: flex }
        .hdr-hamburger { display: none }
        .search-wrap   { width: 650px  }

        @media (max-width: 1024px) {
          .hdr-nav       { display: none }
          .hdr-hamburger { display: flex }
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
        @media (max-width: 640px) {
          .desktop-search    { display: none }
          .mobile-search-btn { display: flex !important }
        }
      `}</style>

      <header style={{ position:"fixed",top:0,left:0,right:0,zIndex:50,width:"100%" }}>

        {/* ══ TOP BAR ══ */}
        <div style={{ background:"#E8D2B5",borderBottom:"1px solid rgba(0,0,0,0.1)",width:"100%" }}>
          <div className="top-bar-px"
            style={{ maxWidth:1440,margin:"0 auto",height:68,
              display:"flex",alignItems:"center",justifyContent:"space-between",
              paddingLeft:24,paddingRight:24 }}>

            {/* Logo */}
            <Link href="/" className="hdr-logo"
              style={{ display:"flex",alignItems:"center",flexShrink:0 }}>
              <img src="/logo.png" alt="BANISHQ"
                style={{ height:50,objectFit:"contain",display:"block" }}/>
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
                      transition:"color .2s" }}
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

              {/* Cart badge */}
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

              {/* Wishlist with badge */}
              <Link href="/my-whishlist"
                style={{ color:"#1a1205", display:"inline-flex", position:"relative" }}>
                <Heart size={22} strokeWidth={1.6}/>
                {totalWishlist > 0 && (
                  <span style={{
                    position:"absolute", top:-8, right:-10,
                    minWidth:20, height:20, padding:"0 4px", borderRadius:99,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:10, fontWeight:800, color:"#fff", lineHeight:1,
                    background:"#ef4444",
                    boxShadow:"0 2px 8px rgba(239,68,68,.5), 0 0 0 2px #E8D2B5",
                    animation:"badgePop .35s cubic-bezier(.22,1,.36,1) both",
                  }}>
                    {totalWishlist > 99 ? "99+" : totalWishlist}
                  </span>
                )}
              </Link>

              {/* Mobile search trigger */}
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
                      <span style={{ position:"absolute",bottom:-1,right:-1,
                        width:14,height:14,borderRadius:"50%",
                        background:"#22c55e",border:"2px solid #E8D2B5",
                        display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <svg viewBox="0 0 10 10" width="8" height="8" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </button>

                    {dropdownOpen && (
                      <div style={{ position:"absolute",right:0,top:46,width:208,
                        background:"#fff",borderRadius:16,
                        boxShadow:"0 8px 32px rgba(0,0,0,0.13)",
                        border:"1px solid #f0ece6",overflow:"hidden",zIndex:60,
                        animation:"fadeSlide .2s ease both" }}>
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
                          { icon: User,     label: "My Profile", href: "/profile" },
                          { icon: Settings, label: "My Orders",  href: "profile?tab=my-order"  },
                        ].map(({ icon: Icon, label, href }) => (
                          <Link key={href} href={href}
                            onClick={() => setDropdownOpen(false)}
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
                    style={{ display:"inline-flex",color:"#1a1205",transition:"color .15s" }}
                    onMouseEnter={e=>e.currentTarget.style.color="#C6A75E"}
                    onMouseLeave={e=>e.currentTarget.style.color="#1a1205"}
                  >
                    <User size={22} strokeWidth={1.6}/>
                  </Link>
                )
              )}

              {/* Mobile hamburger (< lg) */}
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

        {/* ══ BOTTOM BAR ══ */}
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

            {/* ← SearchBar component */}
            <DesktopSearchBar className="search-wrap desktop-search"/>

            {/* Bell */}
            <Bell className="hdr-bell" size={24} strokeWidth={1.5}
              style={{ flexShrink:0,cursor:"pointer",color:"#1a1205" }}/>
          </div>
        </div>

        {/* ══ MOBILE SEARCH OVERLAY ══ */}
        {searchOpen && (
          <MobileSearchOverlay onClose={() => setSearchOpen(false)}/>
        )}

      </header>

      {/* ← HamburgerDrawer component */}
      {drawerOpen && (
        <HamburgerDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          user={user}
          onLogout={handleLogout}
        />
      )}
      {/* ── LOGOUT CONFIRMATION POPUP ── */}
      {logoutPopup && (
        <>
          <style>{`
            @keyframes logoutPopIn {
              0%  { opacity:0; transform:translateY(-12px) scale(0.95); }
              70% { transform:translateY(2px) scale(1.01); }
              100%{ opacity:1; transform:translateY(0) scale(1); }
            }
            @keyframes logoutBdIn { from{opacity:0} to{opacity:1} }
          `}</style>

          {/* backdrop */}
          <div
            onClick={handleLogoutPopupClose}
            style={{
              position:"fixed", inset:0, zIndex:9997,
              background:"rgba(10,8,4,0.45)",
              backdropFilter:"blur(4px)",
              animation:"logoutBdIn .2s ease both",
            }}
          />

          {/* popup card — top-center */}
          <div
            style={{
              position:"fixed", top:24, left:"50%",
              transform:"translateX(-50%)",
              zIndex:9998,
              width:"min(360px,90vw)",
              background:"#fff",
              borderRadius:18,
              overflow:"hidden",
              boxShadow:"0 16px 56px rgba(0,0,0,0.2), 0 0 0 1px rgba(201,168,76,.15)",
              fontFamily:"'Jost',sans-serif",
              animation:"logoutPopIn .38s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            {/* gold top bar */}
            <div style={{ height:3,
              background:"linear-gradient(90deg,#C9A84C,#e8c96a,#C9A84C)" }}/>

            <div style={{ padding:"20px 22px 22px",
              display:"flex", alignItems:"flex-start", gap:14 }}>

              {/* icon */}
              <div style={{
                width:44, height:44, borderRadius:"50%", flexShrink:0,
                background:"linear-gradient(135deg,#fdf8f0,#f0e6d0)",
                border:"1.5px solid #EDE5D8",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>

              {/* text */}
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{
                  fontSize:15, fontWeight:700, color:"#1a1205",
                  margin:"0 0 4px",
                  fontFamily:"'Cormorant Garamond',serif",
                }}>
                  You've been logged out
                </p>
                <p style={{
                  fontSize:12.5, color:"#A89880", margin:0, lineHeight:1.6,
                }}>
                  Come back anytime — your cart is saved.
                </p>
              </div>

              {/* ✕ button → home */}
              <button
                onClick={handleLogoutPopupClose}
                style={{
                  flexShrink:0, width:28, height:28, borderRadius:"50%",
                  border:"1.5px solid #EDE5D8", background:"#fdfaf6",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  cursor:"pointer", color:"#aaa", transition:"all .15s",
                  marginTop:2,
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#C9A84C";e.currentTarget.style.color="#C9A84C";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#EDE5D8";e.currentTarget.style.color="#aaa";}}
                title="Go to home"
              >
                <X size={13} strokeWidth={2.5}/>
              </button>
            </div>

            {/* thin progress bar that shrinks to 0 in 3 s then auto-closes */}
            <div style={{ height:2, background:"#f5f0e8" }}>
              <div style={{
                height:"100%", background:"#C9A84C",
                animation:"logoutProgress 3s linear forwards",
              }}/>
            </div>
          </div>

          <style>{`
            @keyframes logoutProgress {
              from { width:100% }
              to   { width:0%   }
            }
          `}</style>

          {/* auto-close after 3 s */}
          <AutoClose onClose={handleLogoutPopupClose} delay={3000}/>
        </>
      )}
    </>
  );
}