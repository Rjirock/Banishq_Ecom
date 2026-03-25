// components/FeaturedProducts.jsx
"use client";

import { useState } from "react";
import { Heart, Star, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { featuredProducts } from "../../app/data/featured-products/featuredProducts";

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Jost:wght@400;500;600;700&display=swap');

  @keyframes cardIn {
    from { opacity:0; transform:translateY(16px) scale(0.97); }
    to   { opacity:1; transform:translateY(0)    scale(1);    }
  }
  @keyframes heartPop {
    0%  { transform:scale(1)   }
    40% { transform:scale(1.35)}
    100%{ transform:scale(1)   }
  }

  /* grid: 3 cols → 2 cols → 2 cols on mobile → 1 col only on very small */
  .fp-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
  @media (max-width: 1024px) {
    .fp-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  }
  @media (max-width: 560px) {
    .fp-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  }
  @media (max-width: 320px) {
    .fp-grid { grid-template-columns: 1fr; gap: 12px; }
  }

  /* section padding */
  .fp-section { padding: 80px 0; }
  @media (max-width: 768px)  { .fp-section { padding: 56px 0; } }
  @media (max-width: 480px)  { .fp-section { padding: 40px 0; } }

  /* inner max-width padding */
  .fp-inner { max-width:1300px; margin:0 auto; padding:0 40px; }
  @media (max-width: 768px)  { .fp-inner { padding:0 16px; } }
  @media (max-width: 480px)  { .fp-inner { padding:0 10px; } }

  /* heading */
  .fp-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(24px, 3.5vw, 36px);
    font-weight: 700; color: #1a1205; margin:0 0 36px;
  }
  @media (max-width: 480px) { .fp-heading { margin-bottom:24px; } }

  /* card */
  .fp-card {
    background: #fff;
    border: 1.5px solid rgba(0,0,0,0.08);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    transition: transform .28s ease, box-shadow .28s ease;
    animation: cardIn .4s ease both;
  }
  .fp-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 14px 40px rgba(0,0,0,0.11);
  }

  /* image */
  .fp-img-wrap { position:relative; overflow:hidden; }
  .fp-img-wrap img {
    width:100%; display:block; object-fit:cover;
    height: 240px;
    transition: transform .55s ease;
  }
  @media (max-width: 1024px) { .fp-img-wrap img { height: 220px; } }
  @media (max-width: 560px)  { .fp-img-wrap img { height: 160px; } }
  @media (max-width: 400px)  { .fp-img-wrap img { height: 130px; } }
  .fp-card:hover .fp-img-wrap img { transform: scale(1.06); }

  /* wish btn heart pop */
  .heart-liked { animation: heartPop .35s ease both; }

  /* add-to-cart button */
  .fp-atc {
    width:100%; display:flex; align-items:center; justify-content:center; gap:8px;
    padding:11px 0; border-radius:30px; border:none; cursor:pointer;
    font-family:'Jost',sans-serif; font-size:13.5px; font-weight:700;
    transition:all .25s ease;
  }
  .fp-atc.idle {
    background:#1a1205; color:#fff;
  }
  .fp-atc.idle:hover { background:rgba(26,18,5,.82); }
  .fp-atc.added {
    background:#E8D2B5; color:#7a5c1e; cursor:default;
  }
`;

/* ─────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────── */
function ProductCard({ product, delay = 0 }) {
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [status, setStatus] = useState("idle");

  const liked = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (status === "added") return;
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
    });
    setStatus("added");
    setTimeout(() => setStatus("idle"), 2000);
  };

  const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;
  const isAdded = status === "added";

  return (
    <div className="fp-card" style={{ animationDelay: `${delay}s` }}>

      {/* IMAGE */}
      <div className="fp-img-wrap">
        <img src={product.image} alt={product.name} />

        {/* discount badge */}
        <div style={{
          position: "absolute", top: 10, left: 10,
          background: "linear-gradient(135deg,#9C7A3C,#c8a050)",
          color: "#fff", fontSize: 10.5, fontWeight: 800,
          padding: "4px 10px", borderRadius: 20,
          letterSpacing: ".04em",
          boxShadow: "0 2px 8px rgba(156,122,60,.4)",
        }}>
          {product.discount}% OFF
        </div>

        {/* wishlist */}
        <button
          onClick={() => toggleWishlist({
            id: product.id,
            name: product.name,
            brand: product.brand,
            image: product.image,
            price: product.price,
            originalPrice: product.originalPrice,
            discount: product.discount,
          })}
          style={{
            position: "absolute", top: 10, right: 10,
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,.92)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.1)",
            transition: "transform .2s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <Heart
            size={18} strokeWidth={1.6}
            fill={liked ? "#ef4444" : "none"}
            color={liked ? "#ef4444" : "#333"}
            className={liked ? "heart-liked" : ""}
          />
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "16px 16px 18px" }}>

        {/* name */}
        <h3 style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "clamp(15px,1.4vw,17px)", fontWeight: 700,
          color: "#1a1205", margin: "0 0 3px", lineHeight: 1.3,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>
          {product.name}
        </h3>

        {/* brand */}
        <p style={{
          fontSize: 11, color: "rgba(0,0,0,.38)", fontWeight: 600,
          letterSpacing: ".04em", margin: "0 0 10px"
        }}>
          {product.brand}
        </p>

        {/* price row */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
          <span style={{
            fontSize: "clamp(16px,1.6vw,19px)", fontWeight: 700,
            color: "#9C7A3C", fontFamily: "'Cormorant Garamond',serif"
          }}>
            {fmt(product.price)}
          </span>
          <span style={{ fontSize: 12, color: "rgba(0,0,0,.28)", textDecoration: "line-through" }}>
            {fmt(product.originalPrice)}
          </span>
        </div>

        {/* stars */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 1 }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={13} fill="#F4B400" color="#F4B400" strokeWidth={0} />
            ))}
          </div>
          <span style={{ fontSize: 12, color: "rgba(0,0,0,.5)" }}>
            {product.rating} ({product.reviews} Reviews)
          </span>
        </div>

        {/* add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`fp-atc ${isAdded ? "added" : "idle"}`}
        >
          {isAdded ? (
            <><Check size={15} strokeWidth={2.5} /> Added to Cart</>
          ) : (
            <><ShoppingCart size={15} /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SECTION
───────────────────────────────────────── */
export default function FeaturedProducts() {
  return (
    <>
      <style>{STYLES}</style>
      <section className="fp-section" style={{ background: "#EDEBE8" }}>
        <div className="fp-inner">

          {/* heading + eyebrow */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                height: 1, width: 32,
                background: "linear-gradient(90deg,transparent,#C9A84C)"
              }} />
              <span style={{
                fontSize: 10.5, fontWeight: 700, letterSpacing: ".24em",
                textTransform: "uppercase", color: "#C9A84C",
                fontFamily: "'Jost',sans-serif"
              }}>
                Handpicked for You
              </span>
            </div>
            <h2 className="fp-heading">Featured Products</h2>
          </div>

          <div className="fp-grid">
            {featuredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                delay={Math.min(i * 0.07, 0.35)}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}