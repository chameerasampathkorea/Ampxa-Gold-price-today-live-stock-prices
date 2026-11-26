export const SITE = {
  name: "AmpXa",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ampxa.com").replace(/\/$/, ""),
  tagline: "Live gold prices & stock prices today for the USA and Canada",
  description:
    "AmpXa tracks the gold price today per gram, per ounce and by karat (24K, 22K, 18K, 14K, 10K) in USD, CAD and 20+ currencies, plus live stock prices for NVIDIA, Apple, Tesla, the S&P 500 and more.",
  locale: "en_US",
  twitter: "@ampxa",
} as const;

export const NAV = [
  { href: "/gold-price-today", label: "Gold Price" },
  { href: "/silver-price-today", label: "Silver" },
  { href: "/stock-price-today", label: "Stocks" },
  { href: "/gold-price-today/canada", label: "Canada" },
  { href: "/gold-price-today/calculator", label: "Calculator" },
] as const;

export function absoluteUrl(path = "/") {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
