/**
 * Maps every keyword in keywords/*.csv to the page that targets it and writes
 * keywords/keyword-map.csv. Run: npm run keywords
 */
import { readFileSync, writeFileSync } from "node:fs";
import { KARATS, LOCATIONS, UNITS } from "../src/lib/gold.ts";
import { ASSETS } from "../src/lib/stocks.ts";

const dir = new URL("../keywords/", import.meta.url);

function readKeywords(file: string) {
  return readFileSync(new URL(file, dir), "utf8")
    .split(/\r?\n/)
    .slice(1)
    .map((l) => l.split(",")[1]?.trim())
    .filter((k): k is string => Boolean(k));
}

const has = (kw: string, phrase: string) => new RegExp(`(^|\\s)${phrase.replace(/[.*+?^${}()|[\]\\&]/g, "\\$&")}(\\s|$)`).test(kw);

const LOCATION_ALIASES: Record<string, string[]> = {
  usa: ["usa", "us", "united states"], "new-york": ["new york", "nyc"], "new-jersey": ["nj", "edison nj", "new jersey"],
  "los-angeles": ["los angeles"], "san-jose": ["san jose"], "san-antonio": ["san antonio"], "saudi-arabia": ["saudi arabia", "ksa", "riyadh", "jeddah"],
  uae: ["uae"], uk: ["uk"], europe: ["euro", "europe"], switzerland: ["zurich"], bangladesh: ["bangladesh", "bd"], "sri-lanka": ["sri lanka"],
  "south-africa": ["zar"], australia: ["australia", "aud"], canada: ["canada", "cad"], india: ["india", "inr", "rupees", "mcx"],
  china: ["china", "shanghai", "rmb"], kerala: ["kerala"], qatar: ["qatar", "qar"], pakistan: ["pakistan", "rawalpindi", "quetta"],
};

function goldUrl(kw: string): [string, string] {
  for (const l of LOCATIONS) {
    const names = LOCATION_ALIASES[l.slug] ?? [l.name.toLowerCase()];
    if (names.some((n) => has(kw, n))) return [`/gold-price-today/${l.slug}`, "location"];
  }
  if (/calculator/.test(kw)) return ["/gold-price-today/calculator", "tool"];
  if (/silver|xag/.test(kw) && !/vs silver/.test(kw)) return ["/silver-price-today", "silver"];
  for (const k of KARATS) {
    if ([k.slug, `${k.k} carat`, `${k.k}k`, k.hallmark, ...k.phrases].some((p) => has(kw, p))) return [`/gold-price-today/${k.slug}`, "karat"];
  }
  for (const u of UNITS) {
    if (u.phrases.some((p) => has(kw, p))) return [`/gold-price-today/${u.slug}`, "unit"];
  }
  if (/\b(oz|ounce)\b/.test(kw)) return ["/gold-price-today/per-ounce", "unit"];
  if (/\b(gram|grams|gm|g)\b/.test(kw)) return ["/gold-price-today/per-gram", "unit"];
  return ["/gold-price-today", "hub"];
}

function stockUrl(kw: string): [string, string] {
  const words = kw.replace(/\b(stock|share|shares|price|prices|today|live|per|of|for|usd)\b/g, " ").replace(/\s+/g, " ").trim();
  if (!words || words === "live") return ["/stock-price-today", "hub"];
  if (/^(gold|silver)( etf)?$/.test(words)) return [words.startsWith("gold") ? "/stock-price-today/gld" : "/stock-price-today/slv", "etf"];
  // Longest matching name wins ("nasdaq 100" beats "nasdaq").
  let best: { slug: string; kind: string; len: number } | null = null;
  for (const a of ASSETS) {
    for (const n of [a.ticker.toLowerCase(), a.symbol.toLowerCase(), a.name.toLowerCase(), ...(a.aliases ?? [])]) {
      const hit = n.length > 1 && (has(words, n) || (n.includes(" ") && has(kw, n)));
      if (hit && n.length > (best?.len ?? 0)) best = { slug: a.slug, kind: a.kind, len: n.length };
    }
  }
  if (best) return [`/stock-price-today/${best.slug}`, best.kind];
  if (/s&p 500/.test(kw)) return ["/stock-price-today/sp-500", "index"];
  if (/mag(nificent)? 7/.test(kw)) return ["/stock-price-today", "hub"];
  return ["/stock-price-today", "hub (not targeted)"];
}

const rows = [
  ...readKeywords("gold.csv").map((k) => ["gold", k, ...goldUrl(k)]),
  ...readKeywords("stock.csv").map((k) => ["stock", k, ...stockUrl(k)]),
];
writeFileSync(new URL("keyword-map.csv", dir), ["set,keyword,url,match", ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n"));

const tally = rows.reduce<Record<string, number>>((acc, r) => ((acc[`${r[0]}:${r[3]}`] = (acc[`${r[0]}:${r[3]}`] ?? 0) + 1), acc), {});
console.log(`Mapped ${rows.length} keywords → keywords/keyword-map.csv`);
console.table(tally);
