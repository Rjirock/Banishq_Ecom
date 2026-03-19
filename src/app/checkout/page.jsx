// app/checkout/page.jsx
"use client";

import { useState } from "react";
import Stepper       from "../../components/checkout/Stepper";
import BagStep       from "../../components/checkout/BagStep";
import AddressStep   from "../../components/checkout/AddressStep";
import PaymentStep   from "../../components/checkout/PaymentStep";
import PriceSummary  from "../../components/checkout/PriceSummary";
import SuccessOverlay from "../../components/checkout/SuccessOverlay";

export default function CheckoutPage() {
  const [step,    setStep]    = useState("bag");
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    setStep("bag");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600;700&display=swap');

        * { font-family: 'Jost', sans-serif; }

        @keyframes fadeSlide {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes stepIn {
          from { opacity:0; transform:translateX(18px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes successIn {
          from { opacity:0; transform:scale(0.88); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes popIn {
          0%   { transform:scale(0); opacity:0; }
          70%  { transform:scale(1.15); }
          100% { transform:scale(1); opacity:1; }
        }

        .step-panel   { animation: stepIn 0.35s ease both; }
        .payment-form { animation: fadeSlide 0.25s ease both; }

        .place-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        .place-btn:hover::after { transform: translateX(100%); }
      `}</style>

      <div className="min-h-screen" style={{ background: "#F4EFE6" }}>

        {/* ── PAGE HEADER ────────────────────────── */}
        <div className="bg-[#F0E9DB] border-b border-[#E5D9C8] py-7 text-center
                        animate-[fadeSlide_0.4s_ease_both]">
          <h1 className="text-[32px] font-bold text-gray-900"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Checkout
          </h1>
          <p className="text-[12px] text-gray-400 mt-1 tracking-wide">
            <span className="hover:text-gray-600 cursor-pointer transition-colors">Home</span>
            {" / "}
            <span className="text-gray-600 font-medium">Checkout</span>
          </p>
        </div>

        {/* ── STEPPER ─────────────────────────────── */}
        <Stepper current={step} />

        {/* ── TWO-COLUMN LAYOUT ───────────────────── */}
        <div className="max-w-[960px] mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">

            {/* LEFT — active step panel */}
            <div>
              {step === "bag" && (
                <BagStep onNext={() => setStep("address")} />
              )}
              {step === "address" && (
                <AddressStep
                  onNext={() => setStep("payment")}
                  onBack={() => setStep("bag")}
                />
              )}
              {step === "payment" && (
                <PaymentStep onBack={() => setStep("address")} />
              )}
            </div>

            {/* RIGHT — price summary (sticky) */}
            <PriceSummary
              step={step}
              onPlaceOrder={handleSuccess}
            />
          </div>
        </div>
      </div>

      {/* ── SUCCESS MODAL ───────────────────────── */}
      {success && <SuccessOverlay onClose={handleClose} />}
    </>
  );
}