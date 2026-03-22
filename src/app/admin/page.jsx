// app/admin/page.jsx
"use client";

import { useState } from "react";
import { Bell, ChevronRight } from "lucide-react";
import { C } from "./data/theme";
import AdminSidebar from "./components/AdminSidebar";

import DashboardPage  from "./pages/DashboardPage";
import OrdersPage     from "./pages/OrdersPage";
import ProductsPage   from "./pages/ProductsPage";
import BannersPage    from "./pages/BannersPage";
import FeaturedPage   from "./pages/FeaturedPage";
import GalleryPage    from "./pages/GalleryPage";
import CustomersPage  from "./pages/CustomersPage";
import SettingsPage   from "./pages/SettingsPage";
import CouponsPage    from "./pages/Couponspage";
import AdminAccessPage from "./pages/AdminAccessPage";

import { MOCK_ORDERS }      from "./data/orders.data";
import { MOCK_PRODUCTS }    from "./data/products.data";
import { INITIAL_BANNERS }  from "./data/banners.data";
import { INITIAL_GALLERY }  from "./data/gallery.data";
import { MOCK_CUSTOMERS }   from "./data/customers.data";
import { INITIAL_SETTINGS } from "./data/settings.data";
import { INITIAL_COUPONS }  from "./data/coupons.data";

/* ── Clear admin cookie on logout ── */
function clearAdminCookie() {
  document.cookie = "banishq_token=; path=/; max-age=0; SameSite=Lax";
}

export default function AdminPage() {
  const [activeTab,   setActiveTab]   = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [orders,    setOrders]    = useState(MOCK_ORDERS);
  const [products,  setProducts]  = useState(MOCK_PRODUCTS);
  const [banners,   setBanners]   = useState(INITIAL_BANNERS);
  const [gallery,   setGallery]   = useState(INITIAL_GALLERY);
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [settings,  setSettings]  = useState(INITIAL_SETTINGS);
  const [coupons,   setCoupons]   = useState(INITIAL_COUPONS);

  /* ── Handlers ── */
  const handleUpdateOrder = (id, status, payment, shipmentData) => {
    setOrders(prev => prev.map(o =>
      o.id === id
        ? { ...o, status, payment, ...(shipmentData ? { shipmentData } : {}) }
        : o
    ));
    // TODO: await api.patch(`/orders/${id}`, { status, payment, shipmentData })
  };

  const handleSaveProduct = (cat, form) => {
    setProducts(prev => {
      if (form.id) return { ...prev, [cat]: prev[cat].map(p => p.id === form.id ? { ...p, ...form } : p) };
      return { ...prev, [cat]: [...prev[cat], { ...form, id: `${cat}-${Date.now()}`, featured: form.featured ?? false }] };
    });
  };

  const handleDeleteProduct = (cat, id) => {
    setProducts(prev => ({ ...prev, [cat]: prev[cat].filter(p => p.id !== id) }));
  };

  const handleToggleFeatured = (cat, id) => {
    setProducts(prev => ({
      ...prev,
      [cat]: prev[cat].map(p => p.id === id ? { ...p, featured: !p.featured } : p),
    }));
  };

  const handleSaveBanner = (key, imageData) => {
    // imageData = base64 data URL from device upload, or empty string to remove
    setBanners(prev => ({ ...prev, [key]: { ...prev[key], current: imageData } }));
    // TODO: upload to storage (S3/Cloudinary) and save returned URL instead of base64
  };

  const handleAddImage    = (form) => setGallery(prev => [...prev, { ...form, id: `g-${Date.now()}` }]);
  const handleDeleteImage = (id)   => setGallery(prev => prev.filter(i => i.id !== id));

  const handleUpdateCustomerStatus = (id, status) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  /* Coupons */
  const handleAddCoupon    = (c) => setCoupons(prev => [...prev, c]);
  const handleUpdateCoupon = (c) => setCoupons(prev => prev.map(x => x.id === c.id ? c : x));
  const handleDeleteCoupon = (id) => setCoupons(prev => prev.filter(c => c.id !== id));
  const handleToggleCoupon = (id) => setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));

  const handleSaveSettings = (newSettings) => setSettings(newSettings);

  /* ── Logout — clear cookie + full reload to login ── */
  const handleLogout = () => {
    clearAdminCookie();
    window.location.href = "/admin-login";
  };

  const TAB_LABELS = {
    dashboard: "Dashboard",
    orders:    "Orders",
    products:  "Products",
    customers: "Customers",
    banners:   "Banners",
    featured:  "Featured Products",
    gallery:   "Gallery",
    settings:  "Settings",
    coupons:   "Coupons",
    access:    "Admin Access",
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardPage orders={orders} />;
      case "orders":    return <OrdersPage orders={orders} onUpdateOrder={handleUpdateOrder} />;
      case "products":  return (
        <ProductsPage
          products={products}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          onToggleFeatured={handleToggleFeatured}
        />
      );
      case "customers": return <CustomersPage customers={customers} onUpdateStatus={handleUpdateCustomerStatus} />;
      case "banners":   return <BannersPage banners={banners} onSaveBanner={handleSaveBanner} />;
      case "featured":  return <FeaturedPage products={products} onToggleFeatured={handleToggleFeatured} />;
      case "gallery":   return (
        <GalleryPage images={gallery} onAddImage={handleAddImage} onDeleteImage={handleDeleteImage} />
      );
      case "settings":  return <SettingsPage settings={settings} onSave={handleSaveSettings} />;
      case "coupons":   return <CouponsPage coupons={coupons} onAddCoupon={handleAddCoupon} onUpdateCoupon={handleUpdateCoupon} onDeleteCoupon={handleDeleteCoupon} onToggleCoupon={handleToggleCoupon} />;
      case "access":    return <AdminAccessPage />;
      default: return null;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        /* ── Reset header & footer from the main site layout ── */
        header, footer, nav[class*="header"], nav[class*="nav"],
        [class*="Header"], [class*="Footer"], [class*="header"], [class*="footer"] {
          display: none !important;
        }

        /* ── Remove layout padding added for fixed header ── */
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: ${C.bg} !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* ── Ensure admin sits full screen ── */
        main { padding: 0 !important; padding-top: 0 !important; }

        * { box-sizing: border-box; }

        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.gold}66; }

        input, select, textarea {
          font-family: 'Plus Jakarta Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        input:focus, select:focus, textarea:focus {
          border-color: ${C.gold} !important;
          box-shadow: 0 0 0 3px rgba(201,168,76,.15) !important;
          outline: none !important;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .admin-tab-content { animation: fadeIn .3s ease both; }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: C.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>

        {/* ── Sidebar ── */}
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen(v => !v)}
          onLogout={handleLogout}
        />

        {/* ── Main content area ── */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}>

          {/* ── Top bar ── */}
          <div style={{
            height: 62, flexShrink: 0,
            background: C.surface,
            borderBottom: `1.5px solid ${C.border}`,
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px", gap: 16,
            boxShadow: `0 1px 8px ${C.shadow}`,
          }}>

            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13.5, color: C.dim, fontWeight: 500 }}>Admin</span>
              <ChevronRight size={14} color={C.dim} />
              <span style={{
                fontSize: 15, fontWeight: 700, color: C.text,
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: ".02em",
              }}>
                {TAB_LABELS[activeTab]}
              </span>
            </div>

            {/* Right actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>

              {/* Bell */}
              <button style={{
                background: "none", border: "none", cursor: "pointer",
                color: C.muted, position: "relative",
                display: "flex", alignItems: "center",
                padding: 8, borderRadius: 10,
                transition: "background .2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = C.goldBg}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <Bell size={19} strokeWidth={1.8} />
                <span style={{
                  position: "absolute", top: 5, right: 5,
                  width: 8, height: 8, borderRadius: "50%",
                  background: C.gold, border: `2px solid ${C.surface}`,
                }} />
              </button>

              {/* Divider */}
              <div style={{ width: 1, height: 28, background: C.border }} />

              {/* Admin avatar */}
              <div style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "5px 10px", borderRadius: 12,
                background: C.goldBg, border: `1px solid ${C.gold}33`,
                cursor: "pointer",
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: `linear-gradient(135deg,${C.gold},${C.goldLight})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: "#1a1205",
                  boxShadow: `0 2px 6px ${C.gold}44`,
                }}>A</div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>Admin</p>
                  <p style={{ margin: 0, fontSize: 10.5, color: C.gold, fontWeight: 600 }}>Full Access</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Page content ── */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "30px 30px 52px",
            background: C.bg,
          }}>
            <div className="admin-tab-content" key={activeTab}>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}