// context/OrderContext.jsx
"use client";

import { createContext, useContext, useState } from "react";
import { ORDERS } from "../app/data/orders/order"; // seed with existing dummy orders

const OrderContext = createContext(null);

/* ── Generate a random order ID like R0374915036 ── */
function genOrderId() {
  return "BNQ" + Math.floor(1000000000 + Math.random() * 9000000000);
}

/* ── Format today's date like "Mon, 27th Mar 26" ── */
function formatDate(d = new Date()) {
  const days  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months= ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const day   = d.getDate();
  const ord   = day === 1||day===21||day===31?"st":day===2||day===22?"nd":day===3||day===23?"rd":"th";
  return `${days[d.getDay()]}, ${day}${ord} ${months[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
}

/* ── Estimate delivery date (5 days from now) ── */
function deliveryDate(d = new Date()) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + 5);
  const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${nd.getDate()} ${months[nd.getMonth()]} ${nd.getFullYear()}`;
}

export function OrderProvider({ children }) {
  // Seed with existing dummy orders so My Orders tab isn't empty on first load
  const [orders, setOrders] = useState([...ORDERS]);

  /*
   * placeOrder — call this after successful payment or COD confirm.
   *
   * @param cartItems    — array from CartContext: [{ id, name, brand, image, price, originalPrice, discount, qty }]
   * @param addressData  — object from AddressStep: { fullName, phone, email, address, city, state, pinCode }
   * @param paymentMethod — "cod" | "card" | "upi" | "nb"
   * @param total        — final amount paid (number)
   */
  const placeOrder = ({ cartItems, addressData, paymentMethod, total }) => {
    const now     = new Date();
    const orderId = genOrderId();

    const newOrder = {
      id:          orderId,
      customerName: addressData?.fullName ?? "Customer",
      placed:      formatDate(now),
      total:       total ?? cartItems.reduce((s,x) => s + x.price * x.qty, 0),
      card:        paymentMethod === "cod" ? "COD" : "****",
      orderStatus: "Processing",

      tracking: {
        trackingNumber:    "Pending",
        estimatedDelivery: deliveryDate(now),
        courierPartner:    "To be assigned",
        courierService:    addressData?.city ?? "",
        shipmentId:        null,
        shippingMethod:    "Standard Delivery",
        shippingMethodNote:"Delivery within 5–7 business days",
        deliveryAddress:   `${addressData?.city ?? ""}, ${addressData?.state ?? ""}`,
        shipmentDate:      null,
        estimatedArrival:  deliveryDate(now),
        currentStep:       0,
        steps: [
          { label:"Pickup Pending", date:null, location:null, done:false, active:true  },
          { label:"In Transit",     date:null, location:null, done:false, active:false },
          { label:"Shipped",        date:null, location:null, done:false, active:false },
          { label:"Delivered",      date:null, location:null, done:false, active:false },
        ],
      },

      products: cartItems.map((item, idx) => ({
        id:       idx + 1,
        name:     item.name,
        brand:    item.brand    ?? "",
        image:    item.image    ?? "",
        size:     item.size     ?? "Standard",
        qty:      item.qty,
        price:    item.price,
        delivery: deliveryDate(now),
        status:   "Processing",
      })),
    };

    // prepend so newest order appears first
    setOrders(prev => [newOrder, ...prev]);
    return orderId;
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used inside <OrderProvider>");
  return ctx;
}