// app/admin/components/AdminSidebar.jsx
"use client";

import {
  LayoutDashboard, ShoppingBag, Package, Image,
  Star, BookImage, LogOut, Sparkles,
  Users, Settings, ChevronLeft, ChevronRight,
} from "lucide-react";
import { C } from "../data/theme";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",        icon: LayoutDashboard },
  { id: "orders",    label: "Orders",            icon: ShoppingBag     },
  { id: "products",  label: "Products",          icon: Package         },
  { id: "customers", label: "Customers",         icon: Users           },
  { id: "banners",   label: "Banners",           icon: Image           },
  { id: "featured",  label: "Featured Products", icon: Star            },
  { id: "gallery",   label: "Gallery",           icon: BookImage       },
  { id: "settings",  label: "Settings",          icon: Settings        },
];

export default function AdminSidebar({ activeTab, onTabChange, collapsed, onToggle, onLogout }) {
  return (
    <div style={{
      position: "relative",
      width: collapsed ? 72 : 280,
      flexShrink: 0,
      background: C.surface,
      borderRight: `1.5px solid ${C.border}`,
      display: "flex",
      flexDirection: "column",
      /* smooth left-to-right slide */
      transition: "width .35s cubic-bezier(.4,0,.2,1)",
      overflow: "visible",
      zIndex: 10,
      boxShadow: `2px 0 16px ${C.shadow}`,
    }}>

      {/* ── Brand header ── */}
      <div style={{
        padding: collapsed ? "20px 0" : "22px 22px 18px",
        borderBottom: `1.5px solid ${C.border}`,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: 12,
        overflow: "hidden",
        background: C.goldBg,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: `linear-gradient(135deg,${C.gold},${C.goldLight})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 3px 10px ${C.gold}44`,
        }}>
          <Sparkles size={16} color="#1a1205" />
        </div>

        {/* Brand name — slides in/out */}
        <div style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          maxWidth: collapsed ? 0 : 200,
          opacity: collapsed ? 0 : 1,
          transition: "max-width .35s cubic-bezier(.4,0,.2,1), opacity .25s ease",
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 19, fontWeight: 700, color: C.text,
            margin: 0, lineHeight: 1.2,
          }}>BANISHQ</p>
          <p style={{ margin: 0, fontSize: 10, color: C.gold, fontWeight: 700, letterSpacing: ".2em" }}>
            ADMIN
          </p>
        </div>
      </div>

      {/* ── Toggle button — sits on the right edge ── */}
      <button
        onClick={onToggle}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{
          position: "absolute",
          top: 24,
          right: -14,
          width: 28, height: 28,
          borderRadius: "50%",
          background: C.surface,
          border: `1.5px solid ${C.border}`,
          boxShadow: `0 2px 8px ${C.shadowMd}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          color: C.muted,
          zIndex: 20,
          transition: "background .2s, color .2s, transform .35s cubic-bezier(.4,0,.2,1)",
          transform: collapsed ? "rotate(0deg)" : "rotate(0deg)",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = C.goldBg; e.currentTarget.style.color = C.gold; }}
        onMouseLeave={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.color = C.muted; }}
      >
        {collapsed
          ? <ChevronRight size={14} strokeWidth={2.5} />
          : <ChevronLeft  size={14} strokeWidth={2.5} />
        }
      </button>

      {/* ── Nav items ── */}
      <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto", overflowX: "hidden" }}>
        {NAV_ITEMS.map((item, i) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={collapsed ? item.label : ""}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 13,
                padding: collapsed ? "12px 0" : "12px 14px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                marginBottom: 3,
                background: active
                  ? `linear-gradient(90deg, ${C.goldBg}, #FDF3D8)`
                  : "transparent",
                color: active ? C.gold : C.muted,
                transition: "all .2s ease",
                textAlign: "left",
                borderLeft: active ? `3px solid ${C.gold}` : "3px solid transparent",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                animationDelay: `${i * 0.04}s`,
                boxShadow: active ? `0 2px 8px ${C.gold}18` : "none",
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = C.goldBg;
                  e.currentTarget.style.color = C.text;
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = C.muted;
                }
              }}
            >
              <item.icon
                size={18}
                strokeWidth={active ? 2.2 : 1.7}
                style={{ flexShrink: 0 }}
              />

              {/* Label — slides in/out with sidebar */}
              <span style={{
                fontSize: 14, fontWeight: active ? 700 : 500,
                whiteSpace: "nowrap", flex: 1,
                overflow: "hidden",
                maxWidth: collapsed ? 0 : 160,
                opacity: collapsed ? 0 : 1,
                transition: "max-width .35s cubic-bezier(.4,0,.2,1), opacity .2s ease",
              }}>
                {item.label}
              </span>

              {/* Active dot */}
              {!collapsed && active && (
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: C.gold, flexShrink: 0,
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div style={{
        padding: collapsed ? "12px 10px" : "12px 10px 16px",
        borderTop: `1.5px solid ${C.border}`,
        flexShrink: 0,
        background: C.goldBg,
      }}>
        {/* Admin badge */}
        {!collapsed && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px", marginBottom: 8,
            background: C.surface,
            border: `1.5px solid ${C.border}`,
            borderRadius: 12,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              background: `linear-gradient(135deg,${C.gold},${C.goldLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, color: "#1a1205",
              boxShadow: `0 2px 8px ${C.gold}44`,
            }}>A</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.text }}>Admin</p>
              <p style={{ margin: 0, fontSize: 11, color: C.gold, fontWeight: 600 }}>Full Access</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          title={collapsed ? "Log Out" : ""}
          style={{
            width: "100%",
            display: "flex", alignItems: "center",
            gap: 11,
            padding: collapsed ? "11px 0" : "10px 14px",
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: 11, border: "none",
            cursor: "pointer", background: "transparent",
            color: C.muted,
            transition: "all .18s",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = C.red;
            e.currentTarget.style.background = "#FFF1F1";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = C.muted;
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={17} style={{ flexShrink: 0 }} />
          <span style={{
            fontSize: 14, fontWeight: 500,
            overflow: "hidden",
            maxWidth: collapsed ? 0 : 120,
            opacity: collapsed ? 0 : 1,
            transition: "max-width .35s cubic-bezier(.4,0,.2,1), opacity .2s ease",
            whiteSpace: "nowrap",
          }}>
            Log Out
          </span>
        </button>
      </div>
    </div>
  );
}