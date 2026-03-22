// app/track-order/[orderId]/page.jsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { getOrderById } from "../../data/orders/order";
import {
  Phone, Mail, ArrowRight, ChevronLeft,
  CheckCircle2, Circle, Clock3, MapPin,
  User, Home, Briefcase, MapPinOff,
  Truck, Package, Sparkles, AlertCircle,
} from "lucide-react";

/* ── Animated Progress Bar ── */
function ProgressStepper({ steps, currentStep }) {
  return (
    <div style={{ position: "relative", padding: "8px 0 4px" }}>
      <style>{`
        @keyframes glowPulse {
          0%,100% { box-shadow:0 0 0 0 rgba(201,168,76,0); }
          50%      { box-shadow:0 0 0 8px rgba(201,168,76,.2); }
        }
        @keyframes checkPop {
          0%   { transform:scale(0) rotate(-20deg); opacity:0; }
          60%  { transform:scale(1.2) rotate(4deg); }
          100% { transform:scale(1) rotate(0deg); opacity:1; }
        }
        @keyframes lineGrow { from{width:0} to{width:100%} }
        @keyframes stepFade { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .step-done   { animation:checkPop .5s cubic-bezier(.22,1,.36,1) both; }
        .step-active { animation:glowPulse 2s ease infinite; }
        .prog-line   { animation:lineGrow .8s ease .2s both; }
      `}</style>

      {/* Track line */}
      <div style={{ position:"absolute", top:28, left:"6%", right:"6%",
        height:3, borderRadius:99, background:"#EDE5D8", zIndex:0 }} />
      {/* Gold fill */}
      <div className="prog-line" style={{
        position:"absolute", top:28, left:"6%", height:3, borderRadius:99,
        background:"linear-gradient(90deg,#C9A84C,#E8C96A)",
        boxShadow:"0 0 10px rgba(201,168,76,.45)", zIndex:1,
        width: currentStep === 0 ? "0%"
          : `calc(${(currentStep / (steps.length - 1)) * 88}%)`,
      }} />

      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"flex-start", position:"relative", zIndex:2 }}>
        {steps.map((step, i) => {
          const isDone    = step.done;
          const isCurrent = i === currentStep && !isDone;
          return (
            <div key={i} style={{ display:"flex", flexDirection:"column",
              alignItems:"center", flex:1,
              animation:`stepFade .4s ease ${i * 0.1 + 0.1}s both` }}>
              <div
                className={isDone ? "step-done" : isCurrent ? "step-active" : ""}
                style={{
                  width:44, height:44, borderRadius:"50%",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background: isDone ? "linear-gradient(135deg,#C9A84C,#E8C96A)"
                    : isCurrent ? "#fff" : "#F7F3EE",
                  border: isDone ? "none"
                    : isCurrent ? "2.5px solid #C9A84C"
                    : "2px solid #DDD0BE",
                  boxShadow: isDone ? "0 4px 14px rgba(201,168,76,.4)"
                    : isCurrent ? "0 0 0 5px rgba(201,168,76,.12)" : "none",
                  animationDelay: isDone ? `${i * 0.12}s` : undefined,
                }}>
                {isDone ? (
                  <CheckCircle2 size={20} color="#fff" strokeWidth={2.5} />
                ) : isCurrent ? (
                  <div style={{ width:12, height:12, borderRadius:"50%",
                    background:"#C9A84C", animation:"glowPulse 2s ease infinite" }} />
                ) : (
                  <div style={{ width:10, height:10, borderRadius:"50%", background:"#DDD0BE" }} />
                )}
              </div>
              <p style={{ marginTop:8, fontSize:11.5, fontWeight: isDone||isCurrent ? 700 : 500,
                color: isDone ? "#1A1205" : isCurrent ? "#C9A84C" : "#B8A88A",
                textAlign:"center", lineHeight:1.35 }}>
                {step.label}
              </p>
              {step.date && (
                <p style={{ fontSize:10, color: isDone ? "#C9A84C" : "#C4B49A",
                  textAlign:"center", marginTop:2, fontWeight:600 }}>
                  {step.date}
                </p>
              )}
              {step.location && (
                <p style={{ fontSize:10, color:"#C4B49A", textAlign:"center", lineHeight:1.3, marginTop:1 }}>
                  {step.location}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Address type icon ── */
function AddrIcon({ type }) {
  if (type === "Work")  return <Briefcase size={13} color="#C9A84C" />;
  if (type === "Other") return <MapPinOff  size={13} color="#C9A84C" />;
  return <Home size={13} color="#C9A84C" />;
}

/* ── Info field ── */
function Field({ label, value, gold, link }) {
  return (
    <div>
      <p style={{ margin:"0 0 2px", fontSize:10, fontWeight:700,
        letterSpacing:".12em", textTransform:"uppercase", color:"#B8A88A" }}>
        {label}
      </p>
      {link
        ? <a href={link} style={{ fontSize:13.5, fontWeight:700, color:"#C9A84C", textDecoration:"none" }}>
            {value}
          </a>
        : <p style={{ margin:0, fontSize:13.5, fontWeight:700,
            color: gold ? "#C9A84C" : "#1A1205" }}>{value}</p>
      }
    </div>
  );
}

/* ── Section block ── */
function Section({ icon: Icon, title, children }) {
  return (
    <div style={{ padding:"20px 24px", borderBottom:"1.5px solid #F0EAE0" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
        <div style={{
          width:30, height:30, borderRadius:9,
          background:"#FDF9F0", border:"1px solid rgba(201,168,76,.25)",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <Icon size={14} color="#C9A84C" />
        </div>
        <span style={{ fontSize:11, fontWeight:700, letterSpacing:".18em",
          textTransform:"uppercase", color:"#7A6A50" }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ── PAGE ── */
export default function TrackOrderPage() {
  const { orderId } = useParams();
  const router      = useRouter();
  const order       = getOrderById(orderId);

  if (!order) {
    return (
      <div style={{ minHeight:"100vh", background:"#F7F4F0",
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center" }}>
          <Package size={44} color="#C4B49A" style={{ marginBottom:12 }} />
          <p style={{ color:"#A89272", fontSize:14, marginBottom:12 }}>Order not found.</p>
          <button onClick={() => router.push("/orders")} style={{
            color:"#C9A84C", fontSize:13, background:"none",
            border:"none", cursor:"pointer", fontWeight:700 }}>← Back</button>
        </div>
      </div>
    );
  }

  const { customer, shipment } = order;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after {
          font-family:'Plus Jakarta Sans',sans-serif;
          box-sizing:border-box; -webkit-font-smoothing:antialiased;
        }
        @keyframes trackFade { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F7F4F0" }}>

        {/* Page header */}
        <div style={{ background:"#F0EBE0", borderBottom:"1.5px solid #E5D9C8",
          padding:"28px 24px", textAlign:"center", animation:"trackFade .3s ease both" }}>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif",
            fontSize:32, fontWeight:700, color:"#1A1205", margin:"0 0 5px" }}>
            Track Your Order
          </h1>
          <p style={{ fontSize:12.5, color:"#A89272", margin:0 }}>
            <span style={{ cursor:"pointer" }} onClick={() => router.push("/")}>Home</span>
            <span style={{ margin:"0 6px", color:"#C9A84C" }}>›</span>
            <span style={{ cursor:"pointer" }} onClick={() => router.back()}>Orders</span>
            <span style={{ margin:"0 6px", color:"#C9A84C" }}>›</span>
            <strong style={{ color:"#1A1205" }}>{order.id}</strong>
          </p>
        </div>

        <div style={{ maxWidth:1000, margin:"0 auto", padding:"28px 20px 60px" }}>

          {/* Back */}
          <button onClick={() => router.back()} style={{
            display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#A89272",
            background:"none", border:"none", cursor:"pointer", marginBottom:22,
            fontWeight:600, padding:0, transition:"color .2s",
          }}
            onMouseEnter={e => e.currentTarget.style.color="#1A1205"}
            onMouseLeave={e => e.currentTarget.style.color="#A89272"}
          >
            <ChevronLeft size={15}/> Back to Orders
          </button>

          {/* ══ WAITING STATE ══ */}
          {!shipment.adminConfirmed && (
            <div style={{
              background:"#fff", border:"1.5px solid rgba(37,99,235,.25)",
              borderRadius:20, padding:"32px 28px", marginBottom:20,
              boxShadow:"0 2px 16px rgba(26,18,5,.06)",
              animation:"trackFade .35s ease both",
              textAlign:"center",
            }}>
              <div style={{
                width:64, height:64, borderRadius:"50%", margin:"0 auto 18px",
                background:"rgba(37,99,235,.08)", border:"2px solid rgba(37,99,235,.2)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <Clock3 size={28} color="#2563eb" />
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif",
                fontSize:24, fontWeight:700, color:"#1A1205", margin:"0 0 8px" }}>
                Waiting for Order Confirmation
              </h2>
              <p style={{ fontSize:14, color:"#A89272", margin:"0 0 6px", lineHeight:1.7 }}>
                Your order <strong style={{ color:"#C9A84C" }}>#{order.id}</strong> has been received.
              </p>
              <p style={{ fontSize:13.5, color:"#A89272", margin:"0 0 20px", lineHeight:1.7 }}>
                Our team is reviewing and preparing your shipment.<br/>
                Tracking details will appear here once the order is confirmed and dispatched.
              </p>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:8,
                padding:"10px 20px", borderRadius:99,
                background:"rgba(37,99,235,.08)", border:"1px solid rgba(37,99,235,.2)",
              }}>
                <AlertCircle size={14} color="#2563eb" />
                <span style={{ fontSize:13, color:"#2563eb", fontWeight:600 }}>
                  Estimated confirmation: within 24 hours
                </span>
              </div>
            </div>
          )}

          {/* ══ TRACKING CARD ══ */}
          {shipment.adminConfirmed && (
            <div style={{
              background:"#fff", border:"1.5px solid #EDE5D8",
              borderRadius:20, marginBottom:18, overflow:"hidden",
              boxShadow:"0 2px 16px rgba(26,18,5,.06)",
              animation:"trackFade .4s ease .05s both",
            }}>
              <div style={{ height:3, background:"linear-gradient(90deg,#C9A84C,#E8C96A,#C9A84C)" }} />
              <div style={{ padding:"24px 28px" }}>
                {/* Tracking no + ETA */}
                <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between",
                  alignItems:"flex-start", gap:16, marginBottom:6 }}>
                  <div>
                    <p style={{ margin:0, fontSize:11, fontWeight:700, letterSpacing:".16em",
                      textTransform:"uppercase", color:"#A89272" }}>Tracking Number</p>
                    <p style={{ margin:"4px 0 0", fontFamily:"'Cormorant Garamond',serif",
                      fontSize:26, fontWeight:700, color:"#1A1205" }}>
                      {shipment.trackingNumber}
                    </p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ margin:0, fontSize:11, fontWeight:700, letterSpacing:".16em",
                      textTransform:"uppercase", color:"#A89272" }}>Estimated Delivery</p>
                    <p style={{ margin:"4px 0 0", fontFamily:"'Cormorant Garamond',serif",
                      fontSize:22, fontWeight:700, color:"#1A1205" }}>
                      {shipment.estimatedDelivery}
                    </p>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:20 }}>
                  <button onClick={() => router.push("/orders")} style={{
                    display:"flex", alignItems:"center", gap:5, fontSize:11.5,
                    fontWeight:700, color:"#C9A84C", background:"none",
                    border:"none", cursor:"pointer", letterSpacing:".1em",
                    textTransform:"uppercase", padding:0,
                  }}>
                    Track Another <ArrowRight size={12}/>
                  </button>
                </div>
                <ProgressStepper steps={shipment.steps} currentStep={shipment.currentStep} />
              </div>
            </div>
          )}

          {/* ══ DETAILS SHEET ══ */}
          <div style={{
            background:"#fff", border:"1.5px solid #EDE5D8", borderRadius:20,
            overflow:"hidden", boxShadow:"0 2px 16px rgba(26,18,5,.06)",
            animation:"trackFade .4s ease .1s both",
          }}>
            <div style={{ height:3, background:"linear-gradient(90deg,#C9A84C,#E8C96A,#C9A84C)" }} />

            {/* ── Customer Details ── */}
            <Section icon={User} title="Customer Details">
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                <div style={{
                  width:46, height:46, borderRadius:"50%", flexShrink:0,
                  background:"linear-gradient(135deg,#C9A84C,#E8C96A)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:15, fontWeight:800, color:"#1A1205",
                  boxShadow:"0 3px 12px rgba(201,168,76,.3)",
                }}>
                  {customer.fullName.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()}
                </div>
                <div>
                  <p style={{ margin:0, fontFamily:"'Cormorant Garamond',serif",
                    fontSize:20, fontWeight:700, color:"#1A1205" }}>{customer.fullName}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <AddrIcon type={customer.type} />
                    <span style={{ fontSize:11, color:"#C9A84C", fontWeight:700,
                      letterSpacing:".1em", textTransform:"uppercase" }}>
                      {customer.type} Address
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"12px 20px" }}>
                <Field label="Phone"   value={customer.phone} link={`tel:${customer.phone}`} />
                <Field label="Email"   value={customer.email} link={`mailto:${customer.email}`} />
                <Field label="City"    value={customer.city} />
                <Field label="State"   value={customer.state} />
                <Field label="Pincode" value={customer.pincode} />
              </div>

              <div style={{ marginTop:14, padding:"12px 16px",
                background:"#FDFAF6", border:"1.5px solid #EDE5D8", borderRadius:12 }}>
                <p style={{ margin:"0 0 3px", fontSize:10, fontWeight:700,
                  letterSpacing:".12em", textTransform:"uppercase", color:"#B8A88A" }}>
                  Delivery Address
                </p>
                <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#1A1205", lineHeight:1.55 }}>
                  {customer.address}
                  {customer.landmark && (
                    <span style={{ color:"#A89272", fontWeight:500 }}> · Near {customer.landmark}</span>
                  )}
                </p>
                <p style={{ margin:"3px 0 0", fontSize:12.5, color:"#A89272" }}>
                  {customer.city}, {customer.state} – {customer.pincode}
                </p>
              </div>
            </Section>

            {/* ── Shipment Details (admin-filled) ── */}
            {shipment.adminConfirmed ? (
              <Section icon={Truck} title="Shipment Details">
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"12px 20px" }}>
                  <Field label="Tracking No."   value={shipment.trackingNumber} gold />
                  <Field label="Courier Name"   value={shipment.courierName} />
                  <Field label="Courier Phone"  value={shipment.courierPhone} link={`tel:${shipment.courierPhone}`} />
                  <Field label="Courier Service" value={shipment.courierService} />
                  <Field label="Shipping Method" value={shipment.shippingMethod} />
                  <Field label="Shipped On"     value={shipment.shipmentDate} />
                  <Field label="Arriving"       value={shipment.estimatedArrival} />
                </div>
                {shipment.shippingNote && (
                  <p style={{ margin:"12px 0 0", fontSize:12.5, color:"#A89272",
                    padding:"8px 14px", background:"#F7F3EE", borderRadius:10 }}>
                    ℹ️ {shipment.shippingNote}
                  </p>
                )}
              </Section>
            ) : (
              <Section icon={Truck} title="Shipment Details">
                <div style={{ display:"flex", alignItems:"center", gap:10,
                  padding:"14px 18px", background:"rgba(37,99,235,.06)",
                  borderRadius:12, border:"1px solid rgba(37,99,235,.15)" }}>
                  <Clock3 size={16} color="#2563eb" style={{ flexShrink:0 }} />
                  <div>
                    <p style={{ margin:0, fontSize:13.5, fontWeight:700, color:"#2563eb" }}>
                      Shipment details not yet available
                    </p>
                    <p style={{ margin:0, fontSize:12, color:"#7A9FD4" }}>
                      Our team will update courier and tracking information after confirming your order.
                    </p>
                  </div>
                </div>
              </Section>
            )}

            {/* ── Need Help ── */}
            <div style={{ padding:"22px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <div style={{ width:30, height:30, borderRadius:9, background:"#FDF9F0",
                  border:"1px solid rgba(201,168,76,.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Sparkles size={14} color="#C9A84C" />
                </div>
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:".18em",
                  textTransform:"uppercase", color:"#7A6A50" }}>Need Help?</span>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center",
                justifyContent:"space-between", gap:16 }}>
                <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
                  <a href="tel:+910000000000" style={{ display:"flex", alignItems:"center", gap:9,
                    textDecoration:"none", color:"#5A4A35", fontSize:13.5, fontWeight:600 }}>
                    <Phone size={14} color="#C9A84C"/> +91 0000 000 000
                  </a>
                  <a href="mailto:support@banishq.com" style={{ display:"flex", alignItems:"center", gap:9,
                    textDecoration:"none", color:"#5A4A35", fontSize:13.5, fontWeight:600 }}>
                    <Mail size={14} color="#C9A84C"/> support@banishq.com
                  </a>
                </div>
                <button onClick={() => alert("Opening support…")} style={{
                  display:"flex", alignItems:"center", gap:8,
                  padding:"12px 24px", borderRadius:12, border:"none",
                  background:"linear-gradient(120deg,#1A1205,#3a2408)",
                  color:"#F5EDE0", fontSize:13, fontWeight:700, cursor:"pointer",
                  boxShadow:"0 5px 20px rgba(26,18,5,.22)",
                  transition:"transform .2s, box-shadow .2s",
                }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(26,18,5,.3)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="0 5px 20px rgba(26,18,5,.22)"; }}
                >
                  Contact Support <ArrowRight size={13}/>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}