// components/header/SearchBar.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Gem, ChevronRight } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";

/* ── Results Dropdown ──────────────────────── */
function SearchDropdown({ results, isEmpty, query, onNavigate, mobile = false }) {
  const { products, categories, pages } = results;
  const hasProducts   = products.length > 0;
  const hasCategories = categories.length > 0;
  const hasPages      = pages.length > 0;

  const panelStyle = mobile ? {
    background:"#fff", borderRadius:16, overflow:"hidden",
    border:"1.5px solid #EDE5D8", boxShadow:"0 8px 32px rgba(0,0,0,.1)",
  } : {
    position:"absolute", top:"calc(100% + 10px)", left:0, right:0, zIndex:200,
    background:"#fff", borderRadius:16, overflow:"hidden",
    border:"1.5px solid #EDE5D8", boxShadow:"0 12px 40px rgba(0,0,0,.13)",
    animation:"fadeSlide .2s ease both",
    maxHeight:440, overflowY:"auto",
  };

  const sectionLabel = (text) => (
    <p style={{ fontSize:9.5,fontWeight:700,letterSpacing:".2em",textTransform:"uppercase",
      color:"#C9A84C",margin:0,padding:"12px 16px 6px",fontFamily:"'Jost',sans-serif" }}>
      {text}
    </p>
  );

  const rowBase = {
    display:"flex",alignItems:"center",gap:12,padding:"10px 16px",
    cursor:"pointer",transition:"background .15s",textDecoration:"none",
    borderBottom:"1px solid #f5f0e8",
  };

  if (isEmpty) return (
    <div style={panelStyle}>
      <div style={{ padding:"28px 16px",textAlign:"center" }}>
        <p style={{ fontSize:14,color:"#A89880",margin:0,fontFamily:"'Jost',sans-serif" }}>
          No results for <strong style={{ color:"#1a1205" }}>"{query}"</strong>
        </p>
        <p style={{ fontSize:12,color:"#C9A84C",marginTop:6 }}>Try a different keyword</p>
      </div>
    </div>
  );

  return (
    <div style={panelStyle}>

      {hasProducts && (
        <>
          {sectionLabel("Products")}
          {products.map((p,i) => (
            <div key={i} style={rowBase}
              onClick={() => onNavigate(p.href)}
              onMouseEnter={e=>e.currentTarget.style.background="#fdfaf6"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div style={{ width:40,height:40,borderRadius:10,flexShrink:0,
                overflow:"hidden",border:"1px solid #EDE5D8",background:"#f5f0e8" }}>
                <img src={p.image} alt={p.name}
                  style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }}/>
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <p style={{ fontSize:13,fontWeight:600,color:"#1a1205",margin:0,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.name}</p>
                <p style={{ fontSize:11,color:"#A89880",margin:0 }}>{p.hint}</p>
              </div>
              <div style={{ textAlign:"right",flexShrink:0 }}>
                <p style={{ fontSize:13,fontWeight:700,color:"#9C7A3C",margin:0 }}>{p.price}</p>
                <p style={{ fontSize:10,color:"#16a34a",margin:0,fontWeight:600 }}>{p.discount}% OFF</p>
              </div>
            </div>
          ))}
        </>
      )}

      {hasCategories && (
        <>
          {sectionLabel("Categories")}
          {categories.map((c,i) => (
            <div key={i} style={rowBase}
              onClick={() => onNavigate(c.href)}
              onMouseEnter={e=>e.currentTarget.style.background="#fdfaf6"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div style={{ width:32,height:32,borderRadius:8,flexShrink:0,
                background:"linear-gradient(135deg,rgba(201,168,76,.15),rgba(201,168,76,.05))",
                border:"1px solid rgba(201,168,76,.25)",
                display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Gem size={14} color="#C9A84C"/>
              </div>
              <div>
                <p style={{ fontSize:13,fontWeight:600,color:"#1a1205",margin:0 }}>{c.name}</p>
                <p style={{ fontSize:11,color:"#A89880",margin:0 }}>{c.hint}</p>
              </div>
              <ChevronRight size={13} color="#C9A84C" style={{ marginLeft:"auto" }}/>
            </div>
          ))}
        </>
      )}

      {hasPages && (
        <>
          {sectionLabel("Pages")}
          {pages.map((p,i) => (
            <div key={i}
              style={{ ...rowBase, borderBottom: i === pages.length-1 ? "none" : "1px solid #f5f0e8" }}
              onClick={() => onNavigate(p.href)}
              onMouseEnter={e=>e.currentTarget.style.background="#fdfaf6"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div style={{ width:32,height:32,borderRadius:8,flexShrink:0,
                background:"#f5f0e8",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Search size={13} color="#A89880"/>
              </div>
              <div>
                <p style={{ fontSize:13,fontWeight:500,color:"#1a1205",margin:0 }}>{p.name}</p>
                <p style={{ fontSize:11,color:"#A89880",margin:0 }}>{p.hint}</p>
              </div>
              <ChevronRight size={13} color="#C9A84C" style={{ marginLeft:"auto" }}/>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ── Desktop Search Bar ────────────────────── */
export function DesktopSearchBar({ className = "", style = {} }) {
  const router = useRouter();
  const [query,   setQuery]   = useState("");
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef(null);

  const { results, isEmpty } = useSearch(query);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNav = (href) => {
    setQuery(""); setFocused(false);
    router.push(href);
  };

  return (
    <div ref={wrapRef} className={className}
      style={{ position:"relative", flexShrink:0, ...style }}>
      <input
        type="text"
        placeholder="Search products, brands, categories…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        style={{ width:"100%",height:54,borderRadius:40,
          border:`2px solid ${focused ? "#C6A75E" : "#e5e5e5"}`,
          paddingLeft:20,paddingRight:52,
          fontSize:15,outline:"none",fontFamily:"'Jost',sans-serif",
          background:"#fafafa",
          boxShadow: focused ? "0 0 0 3px rgba(198,167,94,.12)" : "none",
          transition:"border-color .2s,box-shadow .2s" }}
      />
      {query ? (
        <button onClick={() => { setQuery(""); setFocused(false); }}
          style={{ position:"absolute",right:18,top:"50%",transform:"translateY(-50%)",
            background:"none",border:"none",cursor:"pointer",color:"#999",
            display:"flex",alignItems:"center" }}>
          <X size={16} strokeWidth={2}/>
        </button>
      ) : (
        <Search size={20} strokeWidth={1.5} color="#999"
          style={{ position:"absolute",right:18,top:"50%",transform:"translateY(-50%)",
            pointerEvents:"none" }}/>
      )}

      {focused && query.length >= 2 && (
        <SearchDropdown
          results={results} isEmpty={isEmpty}
          query={query} onNavigate={handleNav}
        />
      )}
    </div>
  );
}

/* ── Mobile Search Overlay ─────────────────── */
export function MobileSearchOverlay({ onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { results, isEmpty } = useSearch(query);

  const handleNav = (href) => {
    setQuery(""); onClose();
    router.push(href);
  };

  return (
    <div style={{ position:"fixed",top:0,left:0,right:0,zIndex:9990,
      padding:"10px 14px",background:"#fff",display:"flex",
      flexDirection:"column",
      boxShadow:"0 4px 20px rgba(0,0,0,0.12)",
      animation:"searchSlide .25s ease both" }}>

      {/* input row */}
      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ flex:1,position:"relative" }}>
          <Search size={16} color="#999"
            style={{ position:"absolute",left:14,top:"50%",transform:"translateY(-50%)" }}/>
          <input autoFocus type="text"
            placeholder="Search products…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width:"100%",height:46,borderRadius:30,border:"2px solid #C6A75E",
              paddingLeft:38,paddingRight:14,fontSize:14,outline:"none",
              fontFamily:"'Jost',sans-serif",background:"#fff",boxSizing:"border-box" }}/>
        </div>
        <button onClick={() => { setQuery(""); onClose(); }}
          style={{ width:36,height:36,borderRadius:"50%",border:"1.5px solid #EDE5D8",
            background:"#fdfaf6",display:"flex",alignItems:"center",justifyContent:"center",
            cursor:"pointer",color:"#888",flexShrink:0 }}>
          <X size={14} strokeWidth={2.5}/>
        </button>
      </div>

      {/* results */}
      {query.length >= 2 && (
        <div style={{ marginTop:8,maxHeight:"60vh",overflowY:"auto" }}>
          <SearchDropdown
            results={results} isEmpty={isEmpty}
            query={query} onNavigate={handleNav} mobile
          />
        </div>
      )}
    </div>
  );
}