import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(_request: NextRequest) {
  // CSP — compatible with static/SSG pages on Vercel.
  // @constitutional Section 8: "No tracking" — CSP blocks unauthorized scripts
  const isDev = process.env.NODE_ENV === "development";

  const csp = [
    "default-src 'self'",
    isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com" : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https://cdn.our.one https://lh3.googleusercontent.com https://avatars.githubusercontent.com data: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    isDev ? "connect-src 'self' ws://localhost:* http://localhost:* https://api.stripe.com https://*.r2.cloudflarestorage.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com" : "connect-src 'self' https://api.stripe.com https://*.r2.cloudflarestorage.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
    "frame-src 'self' https://js.stripe.com",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next|favicon.ico).*)",
  ],
};
