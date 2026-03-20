// app/admin/data/dashboard.data.js

export const DASHBOARD_STATS = [
    {
      id: "revenue",
      label: "Total Revenue",
      value: "₹4,82,340",
      change: 12.4,
      colorKey: "gold",
    },
    {
      id: "orders",
      label: "Total Orders",
      value: "1,248",
      change: 8.2,
      colorKey: "blue",
    },
    {
      id: "customers",
      label: "Customers",
      value: "892",
      change: 5.7,
      colorKey: "green",
    },
    {
      id: "products",
      label: "Products",
      value: "156",
      change: -2.1,
      colorKey: "orange",
    },
  ];
  
  export const RECENT_ACTIVITY = [
    { id: 1, text: "New order ORD-008 received from Riya Singh", time: "2 min ago",  type: "order"   },
    { id: 2, text: "Product 'Rose Glow Serum' stock low (19 units)", time: "14 min ago", type: "warning" },
    { id: 3, text: "Payment received for ORD-007 — ₹18,999",  time: "1 hr ago",  type: "payment" },
    { id: 4, text: "ORD-003 shipped via Blue Dart",            time: "3 hr ago",  type: "ship"    },
    { id: 5, text: "New customer Divya Reddy registered",       time: "5 hr ago",  type: "user"    },
  ];