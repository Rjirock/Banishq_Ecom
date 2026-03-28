// app/profile/page.jsx
"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User, Lock, LogOut, Camera, ChevronRight,
  ShoppingBag, Sparkles, ArrowRight, UserCircle2,
} from "lucide-react";
import PersonalInformation from "@/components/profile_compo/personal_info/page";
import LoginPassword       from "@/components/profile_compo/login_password/page";
import LogoutTab           from "@/components/profile_compo/log_out/page";
import MyOrdersTab         from "@/components/profile_compo/my-order/page";
import { useAuth }         from "@/context/AuthContext";

const TABS = [
  { id: "info",     label: "Personal Information", icon: User        },
  { id: "my-order", label: "My Orders",            icon: ShoppingBag },
  { id: "password", label: "Login & Password",     icon: Lock        },
  { id: "logout",   label: "Log Out",              icon: LogOut      },
];

const VALID_TABS = ["info", "my-order", "password", "logout"];

/* ─────────────────────────────────────────
   GUEST WALL
───────────────────────────────────────── */
function GuestWall() {
  const router = useRouter();
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Jost:wght@300;400;500;600;700&display=swap');
        @keyframes guestIn  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer  { from{transform:translateX(-100%)} to{transform:translateX(250%)} }
        @keyframes ringPulse{
          0%,100%{box-shadow:0 6px 28px rgba(20,14,4,.3),0 0 0 0 rgba(201,168,76,0)}
          50%    {box-shadow:0 6px 28px rgba(20,14,4,.3),0 0 0 5px rgba(201,168,76,.16)}
        }
        .cta-btn{
          position:relative;overflow:hidden;display:inline-flex;align-items:center;
          justify-content:center;gap:10px;padding:14px 32px;border-radius:14px;border:none;
          background:linear-gradient(120deg,#140e04 0%,#3a2408 45%,#5a3a0c 65%,#140e04 100%);
          color:#fff;font-family:'Jost',sans-serif;font-size:13px;font-weight:700;
          letter-spacing:.16em;text-transform:uppercase;cursor:pointer;text-decoration:none;
          animation:ringPulse 3.5s ease infinite;transition:transform .3s,box-shadow .3s;
        }
        .cta-btn::before{content:'';position:absolute;top:0;left:12%;right:12%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(201,168,76,.65),transparent);}
        .cta-btn .sweep{position:absolute;inset:0;
          background:linear-gradient(105deg,transparent 25%,rgba(201,168,76,.22) 50%,transparent 75%);
          transform:translateX(-100%);}
        .cta-btn:hover{transform:translateY(-2px);box-shadow:0 14px 38px rgba(20,14,4,.42)}
        .cta-btn:hover .sweep{animation:shimmer .7s ease forwards}
        .outline-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;
          padding:13px 28px;border-radius:14px;border:2px solid #C9A84C;background:transparent;
          color:#7a6030;font-family:'Jost',sans-serif;font-size:13px;font-weight:700;
          letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:all .25s ease;}
        .outline-btn:hover{background:#fdf9f0;border-color:#a07c2a;color:#5c4220;transform:translateY(-1px)}
      `}</style>

      <div style={{ minHeight:"100vh",background:"#F4EFE6",display:"flex",flexDirection:"column" }}>
        <div style={{ height:3,background:"linear-gradient(90deg,#C9A84C,#e8c96a,#C9A84C)" }}/>
        <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 24px" }}>
          <div style={{ maxWidth:480,width:"100%",textAlign:"center",animation:"guestIn .6s ease both" }}>

            <div style={{ width:88,height:88,borderRadius:"50%",
              background:"linear-gradient(135deg,#f5ede0,#e8d5b8)",
              border:"2px solid #EDE5D8",boxShadow:"0 8px 32px rgba(201,168,76,.18)",
              display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px" }}>
              <UserCircle2 size={40} color="#C9A84C" strokeWidth={1.4}/>
            </div>

            <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:14 }}>
              <div style={{ height:1,width:36,background:"linear-gradient(90deg,transparent,#C9A84C)" }}/>
              <span style={{ fontSize:11,fontWeight:700,letterSpacing:".28em",color:"#C9A84C",textTransform:"uppercase" }}>
                Members Only
              </span>
              <div style={{ height:1,width:36,background:"linear-gradient(90deg,#C9A84C,transparent)" }}/>
            </div>

            <h1 style={{ fontFamily:"'Cormorant Garamond',serif",
              fontSize:"clamp(32px,5vw,52px)",fontWeight:700,
              color:"#1a1205",lineHeight:1.1,margin:"0 0 16px" }}>
              Sign in to access<br/>
              <em style={{ color:"#C9A84C",fontStyle:"italic" }}>your profile</em>
            </h1>

            <p style={{ fontSize:14,color:"#A89880",lineHeight:1.8,maxWidth:360,margin:"0 auto 36px" }}>
              Create an account or log in to view your orders,
              manage your details, and enjoy a personalised experience.
            </p>

            <div style={{ height:1,background:"linear-gradient(90deg,transparent,#EDE5D8,transparent)",marginBottom:36 }}/>

            <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap" }}>
              <button className="cta-btn" onClick={() => router.push("/sign-up")}>
                <span className="sweep"/>
                <Sparkles size={13} style={{ position:"relative",zIndex:1,color:"#d4a94a" }}/>
                <span style={{ position:"relative",zIndex:1 }}>Create Account</span>
                <ArrowRight size={13} style={{ position:"relative",zIndex:1 }}/>
              </button>
              <button className="outline-btn" onClick={() => router.push("/login")}>
                <User size={14}/> Log In
              </button>
            </div>

            <p style={{ fontSize:11.5,color:"#C9A84C",marginTop:28,fontWeight:600,letterSpacing:".06em" }}>
              🔒 &nbsp;Your data is safe and never shared
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   INNER PAGE — reads searchParams
   Must be inside <Suspense> on the export
───────────────────────────────────────── */
function ProfileInner() {
  const { user, ready } = useAuth();
  const router          = useRouter();
  const searchParams    = useSearchParams();   // ← safe here inside Suspense

  const tabFromUrl  = searchParams.get("tab");
  const resolvedTab = VALID_TABS.includes(tabFromUrl) ? tabFromUrl : "info";

  const [activeTab, setActiveTab] = useState(resolvedTab);
  const [imgSrc,    setImgSrc]    = useState(null);
  const fileRef = useRef(null);

  /* Sync tab when URL param changes (e.g. redirect from checkout) */
  useEffect(() => {
    const t = searchParams.get("tab");
    if (VALID_TABS.includes(t) && t !== activeTab) {
      setActiveTab(t);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result);
    reader.readAsDataURL(file);
  };

  /* ── Auth guard ── */
  if (!ready) {
    return (
      <div style={{ minHeight:"100vh",background:"#F4EFE6",
                    display:"flex",alignItems:"center",justifyContent:"center" }}>
        <div style={{ width:36,height:36,borderRadius:"50%",
                      border:"3px solid #EDE5D8",borderTopColor:"#C9A84C",
                      animation:"spin .8s linear infinite" }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!user) return <GuestWall />;

  const renderTab = () => {
    if (activeTab === "info")     return <PersonalInformation key="info" />;
    if (activeTab === "my-order") return <MyOrdersTab key="my-order" />;
    if (activeTab === "password") return <LoginPassword key="password" />;
    if (activeTab === "logout")   return <LogoutTab key="logout" />;
  };

  const displayName = user?.name ?? "My Account";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeSlide {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <div className="min-h-screen bg-[#f5f0e8] w-full">

        {/* Header */}
        <div className="bg-[#f0ebe0] border-b border-[#e0d8cc] py-1 px-6 text-center
                        animate-[fadeSlide_0.4s_ease_both]">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight"
              style={{ fontFamily:"'Playfair Display',serif" }}>
            Profile
          </h1>
          <p className="text-[12.5px] text-gray-400 mt-1 tracking-wide">
            <span className="hover:text-gray-600 cursor-pointer transition-colors"
                  onClick={() => router.push("/")}>Home</span>
            {" / "}
            <span className="text-gray-600">Profile</span>
          </p>
        </div>

        {/* Body */}
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* Sidebar */}
            <div className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-35
                            animate-[fadeSlide_0.45s_ease_both]">
              <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] overflow-hidden">

                {/* Avatar */}
                <div className="flex flex-col items-center pt-8 pb-6 px-5 border-b border-gray-100">
                  <div className="relative group cursor-pointer mb-3"
                       onClick={() => fileRef.current?.click()} title="Change photo">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-[#e8ddd0] ring-4 ring-[#f0ebe0]">
                      {imgSrc
                        ? <img src={imgSrc} alt="avatar" className="w-full h-full object-cover"/>
                        : <div className="w-full h-full flex items-center justify-center">
                            <User size={28} className="text-[#b8964e]"/>
                          </div>
                      }
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Camera size={16} className="text-white"/>
                    </div>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*"
                         className="hidden" onChange={handleImageChange}/>
                  <p className="text-[15px] font-semibold text-gray-900"
                     style={{ fontFamily:"'Playfair Display',serif" }}>
                    {displayName}
                  </p>
                  {user?.email && (
                    <p className="text-[11.5px] text-gray-400 mt-0.5 truncate max-w-[200px]">
                      {user.email}
                    </p>
                  )}
                </div>

                {/* Nav */}
                <nav className="py-2">
                  {TABS.map(({ id, label, icon: Icon }) => {
                    const active   = activeTab === id;
                    const isLogout = id === "logout";
                    return (
                      <button key={id}
                        onClick={() => { setActiveTab(id); router.push(`/profile?tab=${id}`); }}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 text-left text-[13px]
                          font-medium transition-all duration-200 group relative
                          ${active && !isLogout ? "text-[#7a6030] bg-[#fdf8f2]" : ""}
                          ${!active && !isLogout ? "text-gray-500 hover:text-gray-800 hover:bg-gray-50" : ""}
                          ${isLogout && !active  ? "text-red-400 hover:text-red-500 hover:bg-red-50" : ""}
                          ${isLogout && active   ? "text-red-500 bg-red-50" : ""}
                        `}
                      >
                        <span className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full
                          transition-all duration-200
                          ${active && !isLogout ? "opacity-100 bg-[#b8964e]" : ""}
                          ${active && isLogout  ? "opacity-100 bg-red-400"   : ""}
                          ${!active             ? "opacity-0"                : ""}`}
                        />
                        <Icon size={15} className={
                          active && !isLogout ? "text-[#b8964e]" :
                          active && isLogout  ? "text-red-500"   :
                          isLogout            ? "text-red-400"   : "text-gray-400"
                        }/>
                        <span className="flex-1">{label}</span>
                        <ChevronRight size={13} className={`transition-all duration-200
                          ${active ? "translate-x-0.5 opacity-60" : "opacity-0 group-hover:opacity-30"}`}/>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main panel */}
            <div key={activeTab}
                 className="flex-1 bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)]
                            p-8 min-h-[480px] animate-[fadeSlide_0.35s_ease_both]">
              {renderTab()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   PAGE EXPORT — wraps ProfileInner in
   Suspense so useSearchParams() works
   on Vercel / static builds
───────────────────────────────────────── */
export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight:"100vh",background:"#F4EFE6",
                    display:"flex",alignItems:"center",justifyContent:"center" }}>
        <div style={{ width:36,height:36,borderRadius:"50%",
                      border:"3px solid #EDE5D8",borderTopColor:"#C9A84C",
                      animation:"spin .8s linear infinite" }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <ProfileInner />
    </Suspense>
  );
}
