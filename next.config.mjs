/** @type {import('next').NextConfig} */

// Security headers applied to every route. These are safe defaults that don't
// affect caching/RSC behavior. A Content-Security-Policy is intentionally left
// out for now — it needs per-source tuning for Three.js, Framer Motion, and
// Google Analytics, so it should be added deliberately rather than by default.
const securityHeaders = [
  // Force HTTPS for two years. No `preload` so this stays reversible.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  // Don't let browsers MIME-sniff responses into a different content type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send origin (not full URL) on cross-origin navigations.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disallow this site being framed by other origins (clickjacking).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Opt out of powerful features the app never uses (incl. Topics API).
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework via the `X-Powered-By` header.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
