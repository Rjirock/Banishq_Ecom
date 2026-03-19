// data/orders.js — Central orders store
// All order + tracking data lives here.
// Replace with real API calls in production.

export const ORDERS = [
  {
    id: "R0374915036",
    customerName: "Raj Singh",          // ← customer name shown on track page
    placed: "Thu, 17th Nov 26",
    total: 5000,
    card: "7541",
    orderStatus: "In-Transit",

    tracking: {
      trackingNumber: "F782340387234",
      estimatedDelivery: "26 March, Wed at 4:00 PM",
      courierPartner: "Rajesh Kumar",
      courierService: "Ranchi, Jharkhand",
      shipmentId: "12/02/2026",
      shippingMethod: "Standard Delivery",
      shippingMethodNote: "Delivery within 3–5 business days",
      deliveryAddress: "Ranchi, Jharkhand",
      shipmentDate: "18/02/2026",
      estimatedArrival: "20/02/2026",
      currentStep: 2,

      steps: [
        { label: "Pickup Pending", date: "10/02/2026", location: "Ranchi, Jharkhand", done: true,  active: false },
        { label: "In Transit",     date: "12/02/2026", location: "Ranchi, Jharkhand", done: true,  active: false },
        { label: "Shipped",        date: "12/02/2026", location: "Ranchi, Jharkhand", done: true,  active: true  },
        { label: "Delivered",      date: null,          location: null,                done: false, active: false },
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
    id: "R0284761023",
    customerName: "Priya Sharma",       // ← customer name shown on track page
    placed: "Mon, 3rd Jan 26",
    total: 3200,
    card: "4412",
    orderStatus: "Delivered",

    tracking: {
      trackingNumber: "G921450183746",
      estimatedDelivery: "10 Jan, Sat at 12:00 PM",
      courierPartner: "Suresh Mehta",
      courierService: "Mumbai, Maharashtra",
      shipmentId: "03/01/2026",
      shippingMethod: "Express Delivery",
      shippingMethodNote: "Delivery within 1–2 business days",
      deliveryAddress: "Mumbai, Maharashtra",
      shipmentDate: "04/01/2026",
      estimatedArrival: "10/01/2026",
      currentStep: 3,

      steps: [
        { label: "Pickup Pending", date: "03/01/2026", location: "Mumbai, Maharashtra", done: true, active: false },
        { label: "In Transit",     date: "04/01/2026", location: "Mumbai, Maharashtra", done: true, active: false },
        { label: "Shipped",        date: "07/01/2026", location: "Mumbai, Maharashtra", done: true, active: false },
        { label: "Delivered",      date: "10/01/2026", location: "Mumbai, Maharashtra", done: true, active: true  },
      ],
    },

    products: [
      { id: 5, name: "Embroidered Kurta Set", brand: "By Anita Dongre", size: "M", qty: 1, price: 2100, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=120&q=80", delivery: "10 Jan 2026", status: "Delivered" },
      { id: 6, name: "Cotton Palazzo Pants",  brand: "By W for Woman",  size: "L", qty: 2, price: 1100, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4b5d?w=120&q=80", delivery: "10 Jan 2026", status: "Delivered" },
    ],
  },
];

// Helper — get single order by id
export function getOrderById(id) {
  return ORDERS.find((o) => o.id === id) ?? null;
}