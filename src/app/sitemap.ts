import type { MetadataRoute } from "next";
import { allGoldSlugs } from "@/lib/gold";
import { ASSETS } from "@/lib/stocks";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number, changeFrequency: "always" | "hourly" | "daily" | "monthly" = "hourly") => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1, "always"),
    entry("/gold-price-today", 1, "always"),
    entry("/stock-price-today", 0.9, "always"),
    entry("/silver-price-today", 0.8),
    entry("/gold-price-today/calculator", 0.7, "daily"),
    ...allGoldSlugs().map((s) => entry(`/gold-price-today/${s}`, 0.8)),
    ...ASSETS.map((a) => entry(`/stock-price-today/${a.slug}`, a.popular ? 0.8 : 0.6)),
    entry("/about", 0.3, "monthly"),
    entry("/disclaimer", 0.2, "monthly"),
    entry("/privacy", 0.2, "monthly"),
  ];
}
