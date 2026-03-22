// app/admin/data/settings.data.js

export const INITIAL_SETTINGS = {
    store: {
      name: "BANISHQ",
      tagline: "Premium Curated Collections",
      email: "support@banishq.com",
      phone: "+91 00000 00000",
      address: "Studio 4, Lal Kothi, Jaipur, Rajasthan 302015",
      currency: "INR",
      gstNumber: "08AABCU9603R1ZX",
    },
    shipping: {
      freeShippingThreshold: 999,
      standardRate: 49,
      expressRate: 149,
      codAvailable: true,
      codCharge: 30,
    },
    notifications: {
      emailOnNewOrder: true,
      emailOnLowStock: true,
      lowStockThreshold: 10,
      smsOnOrderShipped: false,
      whatsappAlerts: true,
    },
    welecomecode: {
      activeCoupon: "SAVE10",
      discountPercent: 10,
      couponExpiry: "2024-12-31",
      showPromoBanner: true,
      promoText: "Use code SAVE10 for 10% off your first order!",
    },
    social: {
      instagram: "https://instagram.com/banishq",
      facebook:  "https://facebook.com/banishq",
      whatsapp:  "https://wa.me/910000000000",
      youtube:   "",
    },
  };