import { isPreviewBuild } from "./scripts/lib/build-env.mjs";

/** @type {import('next').NextConfig} */
// Static export: every page, OG image and transcript is a file on the CDN (Cloudflare Workers static assets),
// so visitors and crawlers cost no server CPU. The security headers live in vercel.json, which
// scripts/cloudflare-headers.mjs carries to Cloudflare's _headers.
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: { unoptimized: true },
  // Preview builds (Vercel or Cloudflare) ship without Google Analytics, so they never count as visits.
  env: {
    NEXT_PUBLIC_GA_ID: isPreviewBuild() ? "" : (process.env.NEXT_PUBLIC_GA_ID?.trim() ?? ""),
  },
};

export default nextConfig;
