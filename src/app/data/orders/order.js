// data/orders/order.js
// ─────────────────────────────────────────────────────────────
// Central order store.
// Each order has:
//   customer     — filled from AddressStep form by the customer
//   tracking     — initially null/pending, filled by admin from admin panel
//   products     — items ordered
//
// shipment.adminConfirmed = false means "Waiting for order confirmation"
// shipment.adminConfirmed = true  means admin has dispatched + filled courier info
// ─────────────────────────────────────────────────────────────

export const ORDERS = [
  {
    id: "BNQ0374915036",
    placed: "Thu, 17th Nov 2026",
    total: 5000,
    card: "7541",
    orderStatus: "In-Transit",

    /* ── Customer filled this via AddressStep form ── */
    customer: {
      fullName:  "Raj Singh",
      phone:     "+91 98765 43210",
      email:     "raj.singh@gmail.com",
      pincode:   "834001",
      state:     "Jharkhand",
      city:      "Ranchi",
      address:   "12, Lalpur Road, Near Post Office",
      landmark:  "Near State Bank ATM",
      type:      "Home",
    },

    /* ── Admin fills this from admin panel after order received ── */
    shipment: {
      adminConfirmed:    true,           // false = show "Waiting for confirmation"
      trackingNumber:    "BNQ782340387234",
      courierName:       "Rajesh Kumar",
      courierService:    "Blue Dart Express",
      courierPhone:      "+91 90000 12345",
      shippingMethod:    "Standard Delivery",
      shippingNote:      "Delivery within 3–5 business days",
      shipmentDate:      "18/02/2026",
      estimatedArrival:  "20/02/2026",
      estimatedDelivery: "26 March, Wed at 4:00 PM",
      currentStep:       2,
      steps: [
        { label: "Order Confirmed", date: "10/02/2026", location: "Ranchi, Jharkhand",  done: true,  active: false },
        { label: "Pickup Done",     date: "12/02/2026", location: "Ranchi, Jharkhand",  done: true,  active: false },
        { label: "Shipped",         date: "12/02/2026", location: "Ranchi, Jharkhand",  done: true,  active: true  },
        { label: "Delivered",       date: null,          location: null,                 done: false, active: false },
      ],
    },

    products: [
      { id: 1, name: "Floral Summer Maxi Dress", brand: "By Milla Thomas", size: "M",  qty: 1, price: 1250, image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=120&q=80", delivery: "26 March 2026", status: "In-Transit" },
      { id: 2, name: "Floral Summer Maxi Dress", brand: "By Milla Thomas", size: "L",  qty: 1, price: 1250, image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=120&q=80", delivery: "28 March 2026", status: "In-Transit" },
      { id: 3, name: "Floral Summer Maxi Dress", brand: "By Milla Thomas", size: "S",  qty: 2, price: 1250, image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=120&q=80", delivery: "26 March 2026", status: "In-Transit" },
      { id: 4, name: "Floral Summer Maxi Dress", brand: "By Milla Thomas", size: "XL", qty: 1, price: 1250, image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=120&q=80", delivery: "26 March 2026", status: "In-Transit" },
    ],
  },

  {
    id: "BNQ0284761023",
    placed: "Mon, 3rd Jan 2026",
    total: 3200,
    card: "4412",
    orderStatus: "Delivered",

    customer: {
      fullName:  "Priya Sharma",
      phone:     "+91 87654 32109",
      email:     "priya.sharma@gmail.com",
      pincode:   "400001",
      state:     "Maharashtra",
      city:      "Mumbai",
      address:   "Flat 4B, Seabreeze Apartments, Marine Drive",
      landmark:  "Opposite Nariman Point",
      type:      "Home",
    },

    shipment: {
      adminConfirmed:    true,
      trackingNumber:    "BNQ921450183746",
      courierName:       "Suresh Mehta",
      courierService:    "DTDC Courier",
      courierPhone:      "+91 90000 67890",
      shippingMethod:    "Express Delivery",
      shippingNote:      "Delivery within 1–2 business days",
      shipmentDate:      "04/01/2026",
      estimatedArrival:  "10/01/2026",
      estimatedDelivery: "10 Jan, Sat at 12:00 PM",
      currentStep:       3,
      steps: [
        { label: "Order Confirmed", date: "03/01/2026", location: "Mumbai, Maharashtra", done: true, active: false },
        { label: "Pickup Done",     date: "04/01/2026", location: "Mumbai, Maharashtra", done: true, active: false },
        { label: "Shipped",         date: "07/01/2026", location: "Mumbai, Maharashtra", done: true, active: false },
        { label: "Delivered",       date: "10/01/2026", location: "Mumbai, Maharashtra", done: true, active: true  },
      ],
    },

    products: [
      { id: 5, name: "Embroidered Kurta Set", brand: "By Anita Dongre", size: "M", qty: 1, price: 2100, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=120&q=80", delivery: "10 Jan 2026", status: "Delivered" },
      { id: 6, name: "Cotton Palazzo Pants",  brand: "By W for Woman",  size: "L", qty: 2, price: 1100, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4b5d?w=120&q=80", delivery: "10 Jan 2026", status: "Delivered" },
    ],
  },

  /* ── Example: order received but admin NOT yet confirmed ── */
  {
    id: "BNQ0391827465",
    placed: "Sun, 22nd Mar 2026",
    total: 2199,
    card: "9920",
    orderStatus: "Processing",

    customer: {
      fullName:  "Anjali Verma",
      phone:     "+91 76543 21098",
      email:     "anjali.verma@gmail.com",
      pincode:   "302015",
      state:     "Rajasthan",
      city:      "Jaipur",
      address:   "45, Lal Kothi Colony, Sector 6",
      landmark:  "Near Central Park",
      type:      "Home",
    },

    /* Admin hasn't filled this yet */
    shipment: {
      adminConfirmed:    false,  // ← shows "Waiting for confirmation" message
      trackingNumber:    null,
      courierName:       null,
      courierService:    null,
      courierPhone:      null,
      shippingMethod:    null,
      shippingNote:      null,
      shipmentDate:      null,
      estimatedArrival:  null,
      estimatedDelivery: null,
      currentStep:       0,
      steps: [
        { label: "Order Confirmed", date: null, location: null, done: false, active: true  },
        { label: "Pickup Done",     date: null, location: null, done: false, active: false },
        { label: "Shipped",         date: null, location: null, done: false, active: false },
        { label: "Delivered",       date: null, location: null, done: false, active: false },
      ],
    },

    products: [
      { id: 7, name: "Rose Glow Face Serum", brand: "Dermé Paris", size: "50ml", qty: 1, price: 2199, image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=120&q=80", delivery: "TBD", status: "Processing" },
    ],
  },
];

/* ── Helpers ── */
export function getOrderById(id) {
  return ORDERS.find(o => o.id === id) ?? null;
}

export function getOrderByTracking(trackingNumber) {
  return ORDERS.find(o => o.shipment?.trackingNumber === trackingNumber) ?? null;
}