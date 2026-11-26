import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GoldBoard } from "@/components/gold/GoldBoard";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import {
  CURRENCY_NAMES,
  GRAMS_PER_OZ,
  KARATS,
  LOCATIONS,
  UNITS,
  goldValue,
  resolveGoldSlug,
  type Karat,
  type Location,
  type Unit,
} from "@/lib/gold";
import { loadGold, type GoldData } from "@/lib/gold-data";
import { getFxRate } from "@/lib/market";
import { fmtMoney, fmtPct } from "@/lib/format";
import { pageMetadata, webPageLd, type FaqItem } from "@/lib/seo";

/** Rendered per request so prices are always current; data itself is cached for a minute. */
export const dynamic = "force-dynamic";

const LOCAL_KARAT: Record<string, string> = { "saudi-arabia": "21k", egypt: "21k", jordan: "21k" };

function locationKarat(l: Location) {
  return LOCAL_KARAT[l.slug] ?? LOCAL_KARAT[l.parent ?? ""] ?? (l.region === "south-asia" || l.region === "middle-east" ? "22k" : "24k");
}

/** "9ct" is how the UK searches; elsewhere "18 carat". */
function caratWord(k: Karat) {
  return k.k === 9 ? "9ct" : `${k.k} Carat`;
}

function displayName(l: Location) {
  return l.short ? `${l.name} (${l.short})` : l.name;
}

/**
 * Titles lead with the exact query wording from Search Console and include today's
 * price, which makes the result stand out and lifts click-through rate.
 */
function metaFor(slug: string, data?: GoldData) {
  const r = resolveGoldSlug(slug);
  if (!r) return null;
  const path = `/gold-price-today/${slug}`;
  const spot = data?.quote?.price;
  const fx = data?.fx;
  const price = (grams: number, purity: number, currency = "USD") =>
    spot && fx ? fmtMoney(goldValue(spot, fx, grams, purity), currency) : null;

  if (r.kind === "karat") {
    const k = r.karat;
    const g = price(1, k.purity);
    return {
      path,
      title: g ? `${k.label} Gold Price Today Per Gram: ${g} (${caratWord(k)}, ${k.hallmark})` : `${k.label} Gold Price Today Per Gram (${caratWord(k)}, ${k.hallmark})`,
      description: `${k.label} gold price today${g ? ` is ${g} per gram and ${price(GRAMS_PER_OZ, k.purity)} per ounce` : " per gram and per ounce"} (${caratWord(k).toLowerCase()}, ${k.hallmark}). Live ${k.label} gold rate in USD, CAD and GBP with calculator, chart and 30-day history.`,
      keywords: [`gold price today ${k.slug}`, `gold price today per gram ${k.slug}`, `${k.slug} gold price per gram`, `${k.k} carat gold rate`, ...k.phrases.map((p) => `gold price today ${p}`)],
    };
  }
  if (r.kind === "unit") {
    const u = r.unit;
    const p = price(u.grams, 1);
    return {
      path,
      title: p ? `Gold Price Today ${cap(u.label)}: ${p} (24K) — 22K, 18K, 14K` : `Gold Price Today ${cap(u.label)} — 24K, 22K, 18K, 14K`,
      description: `How much is gold today ${u.label}? 24K gold is ${p ?? "updated live"}, with 22K, 21K, 18K, 14K and 10K rates in US and Canadian dollars, a price chart and history.`,
      keywords: u.phrases.map((p) => `gold price today ${p}`),
    };
  }
  const l = r.location;
  const k = KARATS.find((x) => x.slug === locationKarat(l))!;
  const name = displayName(l);
  const p24 = price(1, 1, l.currency);
  const pk = price(1, k.purity, l.currency);
  const lower = l.name.toLowerCase();
  return {
    path,
    title: p24 ? fit(`Gold Price in ${name} Today: ${p24}/g 24K`, " — Gold Rate") : `Gold Price in ${name} Today — 24K, 22K Gold Rate`,
    description: `Today's gold rate in ${l.inName}: 24K ${p24 ?? ""} per gram${k.slug !== "24k" && pk ? `, ${k.label} ${pk} per gram` : ""}, plus 22K, 21K, 18K and 14K rates ${l.units.includes("per-tola") ? "per tola" : "per ounce"} in ${CURRENCY_NAMES[l.currency]}. Live chart and history.`,
    keywords: [`gold price today ${lower}`, `gold price in ${lower}`, `gold rate today ${lower}`, `today gold rate in ${lower}`, `24k gold price in ${lower}`, ...(l.short ? [`gold price in ${l.short.toLowerCase()}`, `today gold price in ${l.short.toLowerCase()}`] : [])],
  };
}

/** Google shows roughly 60 characters; only add the optional suffix when it fits. */
function fit(title: string, suffix: string) {
  return (title + suffix).length <= 60 ? title + suffix : title;
}

function cap(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: PageProps<"/gold-price-today/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = resolveGoldSlug(slug);
  if (!r) return { title: "Not found", robots: { index: false } };
  const data = await loadGold(r.kind === "location" ? r.location.currency : "USD");
  return pageMetadata(metaFor(slug, data)!);
}

export default async function GoldSlugPage({ params }: PageProps<"/gold-price-today/[slug]">) {
  const { slug } = await params;
  const r = resolveGoldSlug(slug);
  if (!r) notFound();

  const currency = r.kind === "location" ? r.location.currency : "USD";
  const data = await loadGold(currency);
  const meta = metaFor(slug, data)!;
  const dateModified = data.quote ? new Date(data.quote.time * 1000).toISOString() : undefined;

  let body: React.ReactNode;
  if (r.kind === "karat") body = await KaratPage({ karat: r.karat, data, path: meta.path });
  else if (r.kind === "unit") body = await UnitPage({ unit: r.unit, data, path: meta.path });
  else body = await LocationPage({ location: r.location, data, path: meta.path });

  return (
    <>
      {body}
      <JsonLd data={webPageLd({ ...meta, dateModified })} />
    </>
  );
}

const baseCrumbs = [
  { name: "Home", path: "/" },
  { name: "Gold price today", path: "/gold-price-today" },
];

/* ---------------- Karat pages: /gold-price-today/14k ---------------- */

async function KaratPage({ karat: k, data, path }: { karat: Karat; data: GoldData; path: string }) {
  const spot = data.quote?.price ?? 0;
  const g = (fx: number, grams = 1) => goldValue(spot, fx, grams, k.purity);
  const others = ["CAD", "GBP", "AUD", "EUR", "INR", "AED"];
  const fxs = await Promise.all(others.map(async (c) => [c, await getFxRate(c)] as const));
  const cad = fxs[0][1];
  const gbp = fxs[1][1];

  const faq: FaqItem[] = [
    { q: `What is the ${k.label} gold price today per gram?`, a: `${k.label} gold is worth about ${fmtMoney(g(1))} per gram today in US dollars${cad ? ` (${fmtMoney(g(cad), "CAD")} in Canada)` : ""}, based on a spot price of ${fmtMoney(spot)} per ounce and ${(k.purity * 100).toFixed(1)}% gold content.` },
    { q: `How much is 1 gram of ${k.label} gold worth today?`, a: `1 gram of ${k.label} (${caratWord(k).toLowerCase()}) gold is worth ${fmtMoney(g(1))} today. That's the melt value of the gold it contains; jewellery and coins sell for more.` },
    ...(gbp ? [{ q: `What is ${caratWord(k).toLowerCase()} gold price per gram in the UK?`, a: `${k.label} (${caratWord(k).toLowerCase()}) gold is about ${fmtMoney(g(gbp), "GBP")} per gram in the UK today, at the live GBP exchange rate.` }] : []),
    { q: `How much is ${k.label} gold worth per ounce?`, a: `One troy ounce of ${k.label} gold contains ${(GRAMS_PER_OZ * k.purity).toFixed(2)} g of pure gold, worth about ${fmtMoney(g(1, GRAMS_PER_OZ))} at today's price.` },
    { q: `What does ${k.hallmark} mean on gold?`, a: `${k.hallmark} is the millesimal fineness stamp for ${k.label} gold — it means ${k.hallmark} parts per thousand (${(k.purity * 100).toFixed(1)}%) are pure gold.` },
    { q: `How do I calculate the value of my ${k.label} gold?`, a: `Weigh the item in grams and multiply by today's ${k.label} price per gram (${fmtMoney(g(1))}). A 10 g ${k.label} chain is worth about ${fmtMoney(g(1, 10))} in gold content. Buyers typically pay 70–90% of melt value; jewellers charge more for craftsmanship.` },
    { q: `Is ${k.label} gold price per gram the same everywhere?`, a: `The metal value is the same worldwide once converted to local currency, but retail prices differ because of local taxes, import duties and jeweller making charges.` },
  ];

  return (
    <GoldBoard
      data={data}
      currency="USD"
      karatSlug={k.slug}
      unitSlug="per-gram"
      h1={`${k.label} Gold Price Today Per Gram (${caratWord(k)})`}
      crumbs={[...baseCrumbs, { name: `${k.label} gold`, path }]}
      lead={
        <p>
          The <strong>{k.label} gold price today</strong> is <strong>{fmtMoney(g(1))} per gram</strong>, {fmtMoney(g(1, GRAMS_PER_OZ))} per ounce and{" "}
          {fmtMoney(g(1, 10))} per 10 grams. {k.note} {k.label} gold is also sold as &quot;{k.phrases[0]}&quot; or stamped <strong>{k.hallmark}</strong>.
        </p>
      }
    >
      <article className="prose-ax mt-12 max-w-3xl">
        <h2>{k.label} gold price today in other currencies</h2>
        <div className="not-prose overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs uppercase text-muted">
              <tr><th className="px-3 py-2">Currency</th><th className="px-3 py-2 text-right">Per gram</th><th className="px-3 py-2 text-right">Per ounce</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr><td className="px-3 py-2">USD</td><td className="tabular px-3 py-2 text-right">{fmtMoney(g(1))}</td><td className="tabular px-3 py-2 text-right">{fmtMoney(g(1, GRAMS_PER_OZ))}</td></tr>
              {fxs.map(([c, fx]) => fx && (
                <tr key={c}><td className="px-3 py-2">{c}</td><td className="tabular px-3 py-2 text-right">{fmtMoney(g(fx), c)}</td><td className="tabular px-3 py-2 text-right">{fmtMoney(g(fx, GRAMS_PER_OZ), c)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2>How much is {k.label} gold worth? Common weights</h2>
        <ul>
          {[1, 2, 5, 8, 10, 20, 50, 100].map((w) => (
            <li key={w}>{w} gram{w > 1 ? "s" : ""} of {k.label} gold: <strong>{fmtMoney(g(1, w))}</strong></li>
          ))}
          <li>1 pennyweight (dwt, 1.555 g): <strong>{fmtMoney(g(1, 1.55517384))}</strong></li>
          <li>1 tola (11.66 g): <strong>{fmtMoney(g(1, 11.6638038))}</strong></li>
        </ul>
        <h2>Compare other gold purities</h2>
        <ul>
          {KARATS.filter((x) => x.slug !== k.slug).map((x) => (
            <li key={x.slug}><Link href={`/gold-price-today/${x.slug}`}>{x.label} gold price today</Link> — {fmtMoney(goldValue(spot, 1, 1, x.purity))}/g</li>
          ))}
        </ul>
      </article>
      <Faq items={faq} />
    </GoldBoard>
  );
}

/* ---------------- Unit pages: /gold-price-today/per-gram ---------------- */

const UNIT_STEPS: Record<string, { label: string; grams: number }[]> = {
  "per-gram": [1, 2, 3, 4, 5, 8, 10, 20, 50, 100].map((n) => ({ label: `${n} g`, grams: n })),
  "per-ounce": [0.1, 0.25, 0.5, 1, 2, 5, 10].map((n) => ({ label: `${n} oz`, grams: n * GRAMS_PER_OZ })),
  "per-10-grams": [10, 20, 50, 100].map((n) => ({ label: `${n} g`, grams: n })),
  "per-tola": [1, 2, 3, 4, 5, 10].map((n) => ({ label: `${n} tola`, grams: n * 11.6638038 })),
  "per-kg": [0.1, 0.25, 0.5, 1].map((n) => ({ label: `${n} kg`, grams: n * 1000 })),
};

async function UnitPage({ unit: u, data, path }: { unit: Unit; data: GoldData; path: string }) {
  const spot = data.quote?.price ?? 0;
  const cad = await getFxRate("CAD");
  const v = (grams: number, purity = 1, fx = 1) => goldValue(spot, fx, grams, purity);

  const faq: FaqItem[] = [
    ...(u.slug === "per-gram"
      ? [
          { q: "How much is 1 gram of 24K gold worth today?", a: `1 gram of 24K gold is worth ${fmtMoney(v(1))} today in US dollars${cad ? ` (${fmtMoney(v(1, 1, cad), "CAD")} in Canada)` : ""}. 1 gram of 22K is ${fmtMoney(v(1, 0.916))} and 18K is ${fmtMoney(v(1, 0.75))}.` },
          { q: "How much is gold today?", a: `Gold is ${fmtMoney(spot)} per troy ounce and ${fmtMoney(v(1))} per gram (24K) right now.` },
        ]
      : []),
    { q: `What is the gold price today ${u.label}?`, a: `24K gold is ${fmtMoney(v(u.grams))} ${u.label} today in US dollars${cad ? ` and ${fmtMoney(v(u.grams, 1, cad), "CAD")} in Canadian dollars` : ""}. 22K gold is ${fmtMoney(v(u.grams, 0.916))} and 14K gold is ${fmtMoney(v(u.grams, 0.585))} ${u.label}.` },
    { q: `How many grams are in one ${u.short === "g" ? "troy ounce" : u.short}?`, a: u.slug === "per-tola" ? "One tola equals 11.6638 grams, or about 0.375 troy ounces." : u.slug === "per-kg" ? "One kilogram equals 1,000 grams, or 32.15 troy ounces." : "One troy ounce equals 31.1035 grams. A regular (avoirdupois) ounce is 28.35 g, but precious metals always use troy ounces." },
    { q: "Why do gold prices differ between dealers?", a: "Dealers add a premium over spot to cover fabrication, shipping and margin. Small coins and bars carry higher premiums per gram than large bars." },
  ];

  return (
    <GoldBoard
      data={data}
      currency="USD"
      unitSlug={u.slug}
      h1={`Gold Price Today ${cap(u.label)} — Live 24K, 22K & 14K Rates`}
      crumbs={[...baseCrumbs, { name: cap(u.label), path }]}
      lead={
        <p>
          The <strong>gold price today {u.label}</strong> is <strong>{fmtMoney(v(u.grams))}</strong> for 24K gold, {fmtMoney(v(u.grams, 0.916))} for 22K,{" "}
          {fmtMoney(v(u.grams, 0.75))} for 18K and {fmtMoney(v(u.grams, 0.585))} for 14K. {cad ? <>In Canada, 24K gold is {fmtMoney(v(u.grams, 1, cad), "CAD")} {u.label}.</> : null}
        </p>
      }
    >
      <article className="prose-ax mt-12 max-w-3xl">
        <h2>Gold price today by weight</h2>
        <div className="not-prose overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs uppercase text-muted">
              <tr><th className="px-3 py-2">Weight</th><th className="px-3 py-2 text-right">24K</th><th className="px-3 py-2 text-right">22K</th><th className="px-3 py-2 text-right">18K</th><th className="px-3 py-2 text-right">14K</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(UNIT_STEPS[u.slug] ?? []).map((s) => (
                <tr key={s.label}>
                  <td className="px-3 py-2">{s.label}</td>
                  {[1, 0.916, 0.75, 0.585].map((p) => <td key={p} className="tabular px-3 py-2 text-right">{fmtMoney(v(s.grams, p))}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2>Other ways to check the gold price</h2>
        <ul>
          {UNITS.filter((x) => x.slug !== u.slug).map((x) => (
            <li key={x.slug}><Link href={`/gold-price-today/${x.slug}`}>Gold price today {x.label}</Link></li>
          ))}
          <li><Link href="/gold-price-today/calculator">Gold price calculator</Link></li>
        </ul>
      </article>
      <Faq items={faq} />
    </GoldBoard>
  );
}

/* ---------------- Location pages: /gold-price-today/canada ---------------- */

async function LocationPage({ location: l, data, path }: { location: Location; data: GoldData; path: string }) {
  const spot = data.quote?.price ?? 0;
  const fx = data.fx ?? 0;
  const karatSlug = locationKarat(l);
  const k = KARATS.find((x) => x.slug === karatSlug)!;
  const k22 = KARATS.find((x) => x.slug === "22k")!;
  const v = (grams: number, purity = 1) => goldValue(spot, fx, grams, purity);
  const cur = l.currency;
  const parent = l.parent ? LOCATIONS.find((x) => x.slug === l.parent) : null;
  const siblings = LOCATIONS.filter((x) => x.slug !== l.slug && (x.parent === (l.parent ?? l.slug) || x.slug === l.parent));
  const regional = LOCATIONS.filter((x) => !x.parent && x.region === l.region && x.slug !== l.slug && x.slug !== l.parent);
  const mainUnit = UNITS.find((u) => u.slug === l.units[0])!;
  const usd = cur === "USD";

  const uk = l.country === "United Kingdom";
  const faq: FaqItem[] = [
    { q: `What is today's gold rate in ${displayName(l)}?`, a: `Today's gold rate in ${l.inName} is ${fmtMoney(v(1), cur)} per gram for 24K${k.slug !== "24k" ? ` and ${fmtMoney(v(1, k.purity), cur)} per gram for ${k.label}` : ""}, updated every minute.` },
    ...(uk ? [{ q: "What is the 9ct gold price per gram in the UK?", a: `9ct gold is about ${fmtMoney(v(1, 0.375), cur)} per gram today, 18ct is ${fmtMoney(v(1, 0.75), cur)} and 22ct is ${fmtMoney(v(1, 0.916), cur)}.` }] : []),
    { q: `What is the gold price today in ${l.name} per gram?`, a: `24K gold is about ${fmtMoney(v(1), cur)} per gram in ${l.inName} today, 22K is ${fmtMoney(v(1, k22.purity), cur)} and 18K is ${fmtMoney(v(1, 0.75), cur)}${usd ? "" : `, based on the international spot price converted to ${CURRENCY_NAMES[cur]}`}.` },
    { q: `What is the ${k.label} gold rate in ${l.name} today?`, a: `${k.label} gold is ${fmtMoney(v(mainUnit.grams, k.purity), cur)} ${mainUnit.label} and ${fmtMoney(v(1, k.purity), cur)} per gram in ${l.inName}.` },
    l.units.includes("per-tola")
      ? { q: `What is the gold price per tola in ${l.name}?`, a: `One tola (11.66 g) of 24K gold is worth about ${fmtMoney(v(11.6638038), cur)} and 22K about ${fmtMoney(v(11.6638038, k22.purity), cur)} at international prices.` }
      : { q: `What is the gold price per ounce in ${l.name}?`, a: `One troy ounce of gold is ${fmtMoney(spot * fx, cur)} in ${l.inName} today${usd ? "" : ` (${fmtMoney(spot)} in US dollars)`}.` },
    { q: `Is gold cheaper in ${l.name} than in other countries?`, a: `The underlying metal costs the same everywhere once converted at market exchange rates. ${l.blurb} Differences in local prices come from taxes, import duties, dealer premiums and making charges.` },
    { q: `Is gold going up or down in ${l.name} today?`, a: data.quote ? `Gold is ${data.quote.change >= 0 ? "up" : "down"} ${fmtPct(Math.abs(data.quote.changePercent))} today in US-dollar terms. In ${CURRENCY_NAMES[cur]} the move also depends on the ${usd ? "dollar" : `USD/${cur}`} exchange rate.` : "Live data is temporarily unavailable." },
  ];

  return (
    <GoldBoard
      data={data}
      currency={cur}
      karatSlug={k.slug}
      unitSlug={mainUnit.slug}
      gridUnits={Array.from(new Set([...l.units, "per-gram", "per-ounce"]))}
      h1={`Gold Price in ${displayName(l)} Today (${cur})`}
      crumbs={[...baseCrumbs, ...(parent ? [{ name: parent.name, path: `/gold-price-today/${parent.slug}` }] : []), { name: l.name, path }]}
      lead={
        <>
          <p>
            The <strong>gold price today in {l.inName}</strong> is <strong>{fmtMoney(v(1), cur)} per gram</strong> for 24K gold and{" "}
            <strong>{fmtMoney(v(1, k.purity), cur)} per gram</strong> for {k.label}. {mainUnit.slug !== "per-gram" && <>{cap(mainUnit.label)}, 24K gold is {fmtMoney(v(mainUnit.grams), cur)}. </>}
            {!usd && <>Rates use the live USD/{cur} exchange rate of {fx.toFixed(4)}.</>}
          </p>
          <p>{l.blurb}</p>
        </>
      }
    >
      <article className="prose-ax mt-12 max-w-3xl">
        {uk && (
          <>
            <h2>Gold price per gram in the UK by carat (9ct, 14ct, 18ct, 22ct, 24ct)</h2>
            <p>UK jewellers and buyers quote gold in carats (ct). Today&apos;s per-gram melt values in pounds:</p>
            <ul>
              {[...KARATS].reverse().map((x) => (
                <li key={x.slug}>
                  <strong>{x.k}ct gold ({x.hallmark})</strong>: {fmtMoney(v(1, x.purity), cur)} per gram
                </li>
              ))}
            </ul>
          </>
        )}
        <h2>{k.label} and 24K gold price in {l.name} by weight</h2>
        <div className="not-prose overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs uppercase text-muted">
              <tr><th className="px-3 py-2">Weight</th><th className="px-3 py-2 text-right">24K</th><th className="px-3 py-2 text-right">22K</th><th className="px-3 py-2 text-right">18K</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[1, 4, 8, 10, 11.6638038, 20, 31.1034768, 50, 100].map((gr) => (
                <tr key={gr}>
                  <td className="px-3 py-2">{gr === 11.6638038 ? "1 tola" : gr === 31.1034768 ? "1 oz" : `${gr} g`}</td>
                  {[1, 0.916, 0.75].map((p) => <td key={p} className="tabular px-3 py-2 text-right">{fmtMoney(v(gr, p), cur)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!usd && (
          <>
            <h2>Gold price in {l.name} vs USA</h2>
            <p>
              In the USA, 24K gold is {fmtMoney(spot / GRAMS_PER_OZ)} per gram ({fmtMoney(spot)} per ounce). At today&apos;s exchange rate that equals{" "}
              {fmtMoney(v(1), cur)} per gram in {CURRENCY_NAMES[cur]}. See the <Link href="/gold-price-today/usa">gold price today in the USA</Link>.
            </p>
          </>
        )}
        {(siblings.length > 0 || regional.length > 0) && (
          <>
            <h2>Gold price in nearby {siblings.length ? "cities" : "countries"}</h2>
            <ul>
              {[...siblings, ...regional].slice(0, 12).map((x) => (
                <li key={x.slug}><Link href={`/gold-price-today/${x.slug}`}>Gold price today in {x.name}</Link></li>
              ))}
            </ul>
          </>
        )}
        <h2>Gold rates by purity</h2>
        <ul>
          {KARATS.map((x) => <li key={x.slug}><Link href={`/gold-price-today/${x.slug}`}>{x.label} gold price today</Link></li>)}
        </ul>
      </article>
      <Faq items={faq} />
    </GoldBoard>
  );
}
