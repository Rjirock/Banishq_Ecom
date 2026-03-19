export const products = [
  {
    slug: "gold-plated-crystal-wing-earrings",
    category: "Earring",
    name: "Gold Plated Crystal Wing Earrings",

    price: 1999,
    oldPrice: 899,
    discount: "20% OFF",

    rating: 4.8,
    totalReviews: 245, // numeric count for summary display

    images: ["/images/1.jpg", "/images/2.jpg"],

    // ===== SHORT DESCRIPTION (for card if needed) =====
    shortDescription: "Perfect for weddings and festive occasions.",

    // ===== FULL DESCRIPTION (for tab) =====
    description: `
Grace your look with timeless elegance and radiant sparkle with these exquisite Gold Plated Crystal Wing Stud Earrings.

Featuring a beautifully layered wing-inspired design, each curve is delicately adorned with shimmering crystals that catch the light from every angle.

Crafted with precision and finished in a rich gold tone, these earrings offer a luxurious appeal without compromising comfort.

Designed to be lightweight yet impactful, they ensure comfortable wear throughout the day or night.
    `,

    // ===== FEATURES (Single Product Section) =====
    features: [
      "Premium Gold Plating Finish",
      "High-Quality Sparkling Crystals",
      "Lightweight & Comfortable to Wear",
      "Secure Push Back Closure",
      "Elegant Layered Wing Design"
    ],

    // ===== SPECIFICATIONS (Used Anywhere Else If Needed) =====
    specifications: [
      "Type: Stud Earrings",
      "Material: Alloy with Gold Plating",
      "Stone Type: American Diamonds / Crystals",
      "Closure: Push Back",
      "Weight: Lightweight",
      "Occasion: Party, Wedding, Festive, Evening Wear"
    ],

    // ===== ADDITIONAL INFORMATION TAB =====
    additionalInfo: [
      { label: "Type", value: "Stud Earrings" },
      { label: "Material", value: "Alloy with Gold Plating" },
      { label: "Stone Type", value: "American Diamonds / Crystals" },
      { label: "Closure", value: "Push Back" },
      { label: "Weight", value: "Lightweight" },
      { label: "Occasion", value: "Party, Wedding, Festive, Evening Wear" }
    ],

    // ===== REVIEWS TAB (ARRAY) =====
    reviews: [
      {
        name: "Priya Sharma",
        rating: 5,
        comment: "Absolutely stunning earrings! Perfect for weddings."
      },
      {
        name: "Ananya Verma",
        rating: 4,
        comment: "Very elegant design and comfortable to wear."
      }
    ]
  }
];