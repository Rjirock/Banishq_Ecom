// hooks/useSearch.js
"use client";

import { useMemo } from "react";

// ── data imports ──────────────────────────────────────────────
import { featuredProducts }  from "../app/data/featured-products/featuredProducts";
import { cosmeticsProducts } from "../app/data/cosmetics/cosmetics_data";
import { jewelleryProducts } from "../app/data/jewellery_data/jewellery_data";
import { womenProducts }     from "../app/data/women_category_data/women_data";
import { products as productDetails } from "../app/data/product-details/products";

// ── static pages ──────────────────────────────────────────────
const PAGES = [
  { type:"page", name:"Home",       href:"/",              hint:"Main page"       },
  { type:"page", name:"Products",   href:"/products",      hint:"All products"    },
  { type:"page", name:"Gallery",    href:"/gallery",       hint:"Photo gallery"   },
  { type:"page", name:"About Us",   href:"/about",         hint:"Our story"       },
  { type:"page", name:"Contact Us", href:"/contact",       hint:"Get in touch"    },
  { type:"page", name:"Cart",       href:"/cart",          hint:"Shopping cart"   },
  { type:"page", name:"My Orders",  href:"/orders",        hint:"Order history"   },
  { type:"page", name:"Wishlist",   href:"/my-whishlist",  hint:"Saved items"     },
  { type:"page", name:"Profile",    href:"/profile",       hint:"Your account"    },
];

// ── static categories ─────────────────────────────────────────
const CATEGORIES = [
  { type:"category", name:"Jewellery Collection", href:"/category/jewellery-collection", hint:"Rings, earrings, necklaces, bangles" },
  { type:"category", name:"Women's Collection",   href:"/category/women",                hint:"Sarees, suits, lehengas, western"    },
  { type:"category", name:"Cosmetics",            href:"/category/cosmetic-collection",  hint:"Makeup, skincare, fragrance"         },
  { type:"category", name:"Florals",              href:"/products?category=florals",     hint:"Indoor plants & bouquets"            },
  { type:"category", name:"Necklaces",            href:"/category/jewellery-collection", hint:"Chains, pendants, chokers"           },
  { type:"category", name:"Earrings",             href:"/category/jewellery-collection", hint:"Studs, hoops, jhumkas, chandbalis"   },
  { type:"category", name:"Rings",                href:"/category/jewellery-collection", hint:"Engagement, cocktail, toe rings"     },
  { type:"category", name:"Bangles",              href:"/category/jewellery-collection", hint:"Bangles, bracelets, kadas"           },
  { type:"category", name:"Sarees",               href:"/category/women",                hint:"Silk, georgette, banarasi"           },
  { type:"category", name:"Salwar Suits",         href:"/category/women",                hint:"Anarkali, kurta sets, palazzo"       },
  { type:"category", name:"Lehengas",             href:"/category/women",                hint:"Bridal, party, festive lehengas"     },
  { type:"category", name:"Western Wear",         href:"/category/women",                hint:"Dresses, jeans, co-ords, blazers"    },
  { type:"category", name:"Makeup",               href:"/category/cosmetic-collection",  hint:"Lipstick, foundation, kajal"         },
  { type:"category", name:"Skincare",             href:"/category/cosmetic-collection",  hint:"Serum, moisturiser, masks"           },
  { type:"category", name:"Fragrance",            href:"/category/cosmetic-collection",  hint:"Perfumes & body mists"               },
];

// ── helper: convert any product shape to a unified search item ─
function toItem(p, href) {
  return {
    type:     "product",
    name:     p.name     ?? p.name,
    brand:    p.brand    ?? "",
    category: p.category ?? p.subcategory ?? "",
    tags:     (p.tags ?? []).join(" "),
    shades:   (p.shades ?? []).join(" "),
    desc:     p.description ?? p.shortDescription ?? "",
    image:    p.image    ?? (p.images?.[0] ?? ""),
    price:    p.price    ? `₹${p.price.toLocaleString("en-IN")}`
                         : p.oldPrice ? `₹${p.oldPrice.toLocaleString("en-IN")}` : "",
    discount: p.discount ?? 0,
    rating:   p.rating   ?? 0,
    hint:     p.brand    ?? p.subcategory ?? "",
    href,
  };
}

// ── build master product list once at module level ─────────────
const ALL_PRODUCTS = [
  ...featuredProducts .map(p => toItem(p, "/products")),
  ...cosmeticsProducts.map(p => toItem(p, "/category/cosmetic-collection")),
  ...jewelleryProducts.map(p => toItem(p, "/category/jewellery-collection")),
  ...womenProducts    .map(p => toItem(p, "/category/women")),
  ...productDetails   .map(p => toItem(p, `/products`)),
];

// ── scoring function ──────────────────────────────────────────
function score(item, q) {
  const nameLower  = item.name.toLowerCase();
  const brandLower = item.brand.toLowerCase();
  let s = 0;
  if (nameLower === q)                        s += 100; // exact match
  if (nameLower.startsWith(q))               s += 60;  // starts with
  if (nameLower.includes(q))                 s += 40;  // name contains
  if (brandLower.includes(q))                s += 25;  // brand match
  if (item.category.toLowerCase().includes(q)) s += 20;
  if (item.subcategory?.toLowerCase().includes(q)) s += 15;
  if (item.tags.toLowerCase().includes(q))   s += 10;
  if (item.shades.toLowerCase().includes(q)) s += 8;
  if (item.desc.toLowerCase().includes(q))   s += 5;
  return s;
}

// ── main hook ─────────────────────────────────────────────────
export function useSearch(query) {
  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (q.length < 2) return { products: [], categories: [], pages: [] };

    // products: scored + sorted + deduplicated by name
    const seen = new Set();
    const products = ALL_PRODUCTS
      .map(p => ({ ...p, _score: score(p, q) }))
      .filter(p => p._score > 0)
      .sort((a, b) => b._score - a._score || b.rating - a.rating)
      .filter(p => {
        const key = p.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 6);

    // categories
    const categories = CATEGORIES.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.hint.toLowerCase().includes(q)
    );

    // pages
    const pages = PAGES.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.hint.toLowerCase().includes(q)
    );

    return { products, categories, pages };
  }, [q]);

  const total   = results.products.length + results.categories.length + results.pages.length;
  const isEmpty = q.length >= 2 && total === 0;

  return { results, total, isEmpty, query: q };
}