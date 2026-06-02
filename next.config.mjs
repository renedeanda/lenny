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

// Document/RSC responses (the App Router serves both from the SAME URL — they
// differ only by the `RSC` request header). This site is Cloudflare-proxied in
// front of Vercel. If Cloudflare edge-caches an HTML/RSC response, a cached RSC
// flight payload can later be served as the HTML document on a hard refresh
// (you see raw `:HL[...]`/`1:"$Sreact.fragment"...` text), and stale HTML can
// point at content-hashed chunks a newer deploy purged (unstyled FOUC + chunk
// errors). `Cloudflare-CDN-Cache-Control` is honored ONLY by Cloudflare, so we
// stop CF from edge-caching documents while Vercel keeps serving its per-deploy
// HTML. Immutable `/_next/static/*` bundles are excluded below and keep their
// long edge cache. Short-lived browser revalidate keeps repeat views cheap.
// Only the cache directives here — the `/:path*` rule above already applies the
// security headers to documents (Next.js applies every matching header rule), so
// repeating them would emit duplicates.
const docRevalidate = [
  { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
  { key: "Cloudflare-CDN-Cache-Control", value: "no-store" },
];

const nextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework via the `X-Powered-By` header.
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Security headers on every route (assets included).
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Homepage document (where the RSC-as-text issue showed up).
        source: "/",
        headers: docRevalidate,
      },
      {
        // Every other HTML document / RSC route. Excludes /_next/* (immutable
        // hashed bundles — keep their long edge cache) and static asset files
        // so only documents get the no-edge-cache treatment.
        source:
          "/:path((?!_next|og/|.*\\.(?:png|svg|jpg|jpeg|webp|avif|gif|ico|woff|woff2|ttf|otf|xml|txt|json|map)$).*)",
        headers: docRevalidate,
      },
    ];
  },
};

export default nextConfig;
