// app/admin/data/coupons.data.js

export const INITIAL_COUPONS = [
    {
      id:          "cpn-001",
      code:        "WELCOME20",
      type:        "percent",        // "percent" | "flat"
      value:       20,               // 20% off
      minOrder:    500,
      maxUses:     null,             // null = unlimited
      usedCount:   134,
      validFrom:   "2026-01-01",
      validTo:     "2026-12-31",
      description: "20% off for all new customers",
      active:      true,
    },
    {
      id:          "cpn-002",
      code:        "FLAT200",
      type:        "flat",
      value:       200,              // ₹200 off
      minOrder:    999,
      maxUses:     500,
      usedCount:   312,
      validFrom:   "2026-03-01",
      validTo:     "2026-03-31",
      description: "₹200 flat off — March special",
      active:      true,
    },
    {
      id:          "cpn-003",
      code:        "BANISHQ10",
      type:        "percent",
      value:       10,
      minOrder:    0,
      maxUses:     null,
      usedCount:   89,
      validFrom:   "2026-01-01",
      validTo:     "2026-06-30",
      description: "10% off sitewide",
      active:      false,
    },
  ];