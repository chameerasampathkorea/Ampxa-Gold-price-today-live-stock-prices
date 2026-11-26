import type { NextConfig } from "next";

/** Common search variants → the canonical page, so they consolidate ranking instead of competing. */
const goldAliases: Record<string, string> = {
  "999": "24k",
  "24-carat": "24k",
  "916": "22k",
  "22-carat": "22k",
  "875": "21k",
  "21-carat": "21k",
  "750": "18k",
  "18-carat": "18k",
  "585": "14k",
  "14-carat": "14k",
  "417": "10k",
  "10-carat": "10k",
  "375": "9k",
  "9ct": "9k",
  "per-oz": "per-ounce",
  ounce: "per-ounce",
  gram: "per-gram",
  tola: "per-tola",
  kilo: "per-kg",
  "10-grams": "per-10-grams",
  us: "usa",
  "united-states": "usa",
  "united-kingdom": "uk",
  ksa: "saudi-arabia",
  "new-york-city": "new-york",
  nyc: "new-york",
  bengaluru: "bangalore",
};

// Cache Components is off: it is not reliable on the Cloudflare Workers runtime.
// Market data is cached in memory instead (src/lib/market.ts).
const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      // One canonical host: www → apex.
      { source: "/:path*", has: [{ type: "host", value: "www.ampxa.com" }], destination: "https://ampxa.com/:path*", permanent: true },
      ...Object.entries(goldAliases).map(([from, to]) => ({
        source: `/gold-price-today/${from}`,
        destination: `/gold-price-today/${to}`,
        permanent: true,
      })),
      { source: "/gold-price", destination: "/gold-price-today", permanent: true },
      { source: "/gold", destination: "/gold-price-today", permanent: true },
      { source: "/stocks", destination: "/stock-price-today", permanent: true },
      { source: "/stocks/:slug", destination: "/stock-price-today/:slug", permanent: true },
      { source: "/silver", destination: "/silver-price-today", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
