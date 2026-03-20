// middleware.js  (place at project ROOT, next to package.json)
// ─────────────────────────────────────────────────────────────
// Guards all /admin routes.
// Login page lives at /admin-login (outside /admin folder)
// so it is never caught by this guard.
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  /* ── Read auth cookie ── */
  const token = request.cookies.get("banishq_token")?.value;

  // No token → send to admin-login
  if (!token) {
    const loginUrl = new URL("/admin-login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* ── Verify token ────────────────────────────────────────────
     DEMO: base64 JSON decode (replace with real JWT in prod)

     Real JWT verification (requires: npm install jose):

       import { jwtVerify } from "jose";
       const secret = new TextEncoder().encode(process.env.JWT_SECRET);
       try {
         const { payload } = await jwtVerify(token, secret);
         if (payload.role !== "admin") throw new Error();
       } catch {
         return NextResponse.redirect(new URL("/admin-login", request.url));
       }
  ─────────────────────────────────────────────────────────────── */
  try {
    const payload = JSON.parse(atob(token));
    if (payload.role !== "admin") {
      // Logged in but not admin → homepage
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    // Malformed token → admin login
    const loginUrl = new URL("/admin-login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/* ── Only run on /admin paths ── */
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};