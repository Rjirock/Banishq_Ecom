// components/checkout/Stepper.jsx
"use client";

import { ShoppingBag, MapPin, CreditCard, Check } from "lucide-react";

const STEPS = [
  { key: "bag",     label: "BAG",     Icon: ShoppingBag },
  { key: "address", label: "ADDRESS", Icon: MapPin      },
  { key: "payment", label: "PAYMENT", Icon: CreditCard  },
];

const STYLES = `
  @keyframes stepPop {
    0%   { transform: scale(0.7); opacity: 0; }
    70%  { transform: scale(1.12); }
    100% { transform: scale(1);   opacity: 1; }
  }
  @keyframes goldGlow {
    0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
    50%      { box-shadow: 0 0 0 6px rgba(201,168,76,0.18); }
  }
  @keyframes lineFill {
    from { width: 0%; }
    to   { width: 100%; }
  }
  .step-active-circle {
    animation: goldGlow 2.8s ease infinite, stepPop 0.4s ease both;
  }
  .step-done-circle {
    animation: stepPop 0.4s ease both;
  }
  .connector-fill {
    animation: lineFill 0.6s ease forwards;
  }
`;

export default function Stepper({ current }) {
  const ci = STEPS.findIndex((s) => s.key === current);

  return (
    <>
      <style>{STYLES}</style>

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        background: "#F0E9DB",
        borderBottom: "1.5px solid #E5D9C8",
      }}>
        {STEPS.map((step, i) => {
          const done   = i < ci;
          const active = i === ci;
          const { Icon } = step;

          return (
            <div key={step.key} style={{ display: "flex", alignItems: "center" }}>

              {/* ── CONNECTOR LINE ──────────────── */}
              {i > 0 && (
                <div style={{
                  position: "relative",
                  width: 100,
                  height: 2,
                  margin: "0 4px",
                  background: "#DDD0BE",
                  borderRadius: 2,
                  overflow: "hidden",
                  marginBottom: 22, /* align with circle center */
                }}>
                  {(done || active) && (
                    <div
                      className="connector-fill"
                      style={{
                        position: "absolute",
                        top: 0, left: 0, bottom: 0,
                        background: "linear-gradient(90deg, #C9A84C, #e8c96a)",
                        borderRadius: 2,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  )}
                </div>
              )}

              {/* ── STEP CIRCLE + LABEL ─────────── */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>

                {/* circle */}
                <div
                  className={done ? "step-done-circle" : active ? "step-active-circle" : ""}
                  style={{
                    width: 46, height: 46,
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `2px solid ${done ? "#C9A84C" : active ? "#C9A84C" : "#DDD0BE"}`,
                    background: done
                      ? "linear-gradient(135deg, #C9A84C, #e8c96a)"
                      : active
                        ? "#fff"
                        : "#fff",
                    transition: "border-color 0.4s, background 0.4s",
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {done ? (
                    <Check size={17} color="#fff" strokeWidth={2.8} />
                  ) : (
                    <Icon
                      size={17}
                      color={active ? "#C9A84C" : "#C0B09A"}
                      strokeWidth={1.8}
                    />
                  )}
                </div>

                {/* label */}
                <span style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: active ? "#C9A84C" : done ? "#7a6030" : "#C0B09A",
                  transition: "color 0.3s",
                  whiteSpace: "nowrap",
                }}>
                  {step.label}
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </>
  );
}