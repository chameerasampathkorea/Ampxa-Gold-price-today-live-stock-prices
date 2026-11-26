import Link from "next/link";
import { AutoRefresh } from "@/components/AutoRefresh";
import { Change } from "@/components/Change";
import { Faq } from "@/components/Faq";
import { FlashValue } from "@/components/FlashValue";
import { QuoteTable } from "@/components/QuoteTable";
import { GoldPriceGrid } from "@/components/gold/GoldPriceGrid";
import { GOLD_SYMBOL, GRAMS_PER_OZ, KARATS, LOCATIONS, SILVER_SYMBOL } from "@/lib/gold";
import { getFxRate, getQuote } from "@/lib/market";
import { fmtMarketTime, fmtMoney } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { ASSETS, INDEX_ASSETS, MAG7, assetsBySymbols } from "@/lib/stocks";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "AmpXa — Gold Price Today & Live Stock Prices (USA, Canada)",
  description:
    "Live gold price today per gram and per ounce in USD and CAD, 24K to 10K gold rates, plus real-time stock prices for the S&P 500, Nasdaq, TSX, NVIDIA, Apple, Tesla and more.",
  path: "/",
  keywords: ["gold price today", "stock price today", "gold price today in usa", "gold price today canada", "stock price today live"],
});

export default async function Home() {
  const [gold, silver, cad] = await Promise.all([getQuote(GOLD_SYMBOL), getQuote(SILVER_SYMBOL), getFxRate("CAD")]);
  const perGram = gold ? gold.price / GRAMS_PER_OZ : null;
  const countries = LOCATIONS.filter((l) => !l.parent);
  const naCities = LOCATIONS.filter((l) => l.parent === "usa" || l.parent === "canada");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <section aria-labelledby="hero-h">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 id="hero-h" className="text-3xl font-bold tracking-tight text-ink sm:text-5xl">
              Gold price today &amp; <span className="text-gold">live stock prices</span>
            </h1>
            <p className="mt-3 max-w-2xl text-muted">
              Real-time gold rates per gram and per ounce in US and Canadian dollars, plus live quotes for the stocks, ETFs and indices people search for most.
            </p>
          </div>
          <AutoRefresh />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HeroCard href="/gold-price-today" label="Gold per ounce (USD)" value={gold?.price} text={fmtMoney(gold?.price)} pct={gold?.changePercent} highlight />
          <HeroCard href="/gold-price-today/per-gram" label="24K gold per gram (USD)" value={perGram} text={fmtMoney(perGram)} pct={gold?.changePercent} />
          <HeroCard href="/gold-price-today/canada" label="Gold per ounce (CAD)" value={gold && cad ? gold.price * cad : null} text={fmtMoney(gold && cad ? gold.price * cad : null, "CAD")} pct={gold?.changePercent} />
          <HeroCard href="/silver-price-today" label="Silver per ounce (USD)" value={silver?.price} text={fmtMoney(silver?.price)} pct={silver?.changePercent} />
        </div>
        <p className="mt-2 text-xs text-muted">Gold updated {fmtMarketTime(gold?.time)}</p>
      </section>

      {gold && (
        <section className="mt-10" aria-labelledby="karat-h">
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 id="karat-h" className="text-xl font-bold text-ink">Gold price today by karat (USD)</h2>
            <Link href="/gold-price-today" className="text-sm font-medium text-accent hover:underline">Full gold page →</Link>
          </div>
          <GoldPriceGrid spot={gold.price} fx={1} currency="USD" unitSlugs={["per-gram", "per-ounce"]} caption="Gold price today by karat in US dollars" />
        </section>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="idx-h">
          <div className="mb-3 flex items-end justify-between">
            <h2 id="idx-h" className="text-xl font-bold text-ink">Stock market today</h2>
            <Link href="/stock-price-today" className="text-sm font-medium text-accent hover:underline">All stocks →</Link>
          </div>
          <QuoteTable assets={INDEX_ASSETS} caption="Stock market indices today" />
        </section>
        <section aria-labelledby="m7-h">
          <h2 id="m7-h" className="mb-3 text-xl font-bold text-ink">Magnificent 7 stock prices</h2>
          <QuoteTable assets={assetsBySymbols(MAG7)} caption="Magnificent 7 stock prices today" />
        </section>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-3" aria-label="Browse">
        <LinkList title="Gold price in the USA & Canada" links={[{ slug: "usa", name: "USA" }, { slug: "canada", name: "Canada" }, ...naCities].map((l) => ({ href: `/gold-price-today/${l.slug}`, label: `Gold price today in ${l.name}` }))} />
        <LinkList title="Gold price worldwide" links={countries.filter((l) => l.region !== "north-america").map((l) => ({ href: `/gold-price-today/${l.slug}`, label: `Gold price in ${l.name} (${l.currency})` }))} />
        <LinkList title="Trending stock prices" links={ASSETS.filter((a) => a.popular && a.kind !== "index").map((a) => ({ href: `/stock-price-today/${a.slug}`, label: `${a.ticker} stock price today` }))} />
      </section>

      <article className="prose-ax mt-12 max-w-3xl">
        <h2>Gold price today in the USA and Canada</h2>
        <p>
          The gold price today is {fmtMoney(gold?.price)} per troy ounce and {fmtMoney(perGram)} per gram in US dollars
          {cad && gold ? `, or ${fmtMoney(gold.price * cad, "CAD")} per ounce in Canadian dollars` : ""}. AmpXa shows live rates for{" "}
          {KARATS.map((k, i) => (
            <span key={k.slug}>
              {i > 0 && ", "}
              <Link href={`/gold-price-today/${k.slug}`}>{k.label}</Link>
            </span>
          ))}{" "}
          gold, by gram, ounce, tola and kilo, and converts them to more than 20 currencies.
        </p>
        <h2>Live stock prices today</h2>
        <p>
          Follow the <Link href="/stock-price-today/sp-500">S&amp;P 500</Link>, <Link href="/stock-price-today/dow-jones">Dow Jones</Link>,{" "}
          <Link href="/stock-price-today/nasdaq">Nasdaq</Link> and <Link href="/stock-price-today/tsx">TSX</Link>, and get a live quote, chart and 52-week range for stocks
          like <Link href="/stock-price-today/nvda">NVIDIA</Link>, <Link href="/stock-price-today/aapl">Apple</Link>, <Link href="/stock-price-today/tsla">Tesla</Link> and{" "}
          <Link href="/stock-price-today/ry-to">Royal Bank of Canada</Link>.
        </p>
      </article>

      <Faq
        items={[
          { q: "What is the gold price today?", a: gold ? `Gold is ${fmtMoney(gold.price)} per ounce and ${fmtMoney(perGram)} per gram (24K) in US dollars right now.` : "Live gold data is temporarily unavailable." },
          { q: "Where does AmpXa get its data?", a: "Gold and silver prices are based on COMEX futures, and stock, ETF, index, crypto and currency quotes come from Yahoo Finance market data. Prices refresh about every minute and may be delayed." },
          { q: "Is AmpXa free?", a: "Yes. All prices, charts and calculators on AmpXa are free to use on mobile and desktop." },
        ]}
      />
    </div>
  );
}

function HeroCard({ href, label, value, text, pct, highlight }: { href: string; label: string; value: number | null | undefined; text: string; pct?: number; highlight?: boolean }) {
  return (
    <Link href={href} className={`block rounded-xl border p-4 transition hover:shadow-md ${highlight ? "border-gold/40 bg-gold-soft" : "border-line bg-surface"}`}>
      <span className="block text-xs font-medium text-muted">{label}</span>
      <span className="mt-1 block text-2xl font-bold text-ink sm:text-3xl">{value != null ? <FlashValue value={value} text={text} /> : "—"}</span>
      <span className="mt-1 block text-sm"><Change pct={pct} /></span>
    </Link>
  );
}

function LinkList({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <h2 className="text-base font-bold text-ink">{title}</h2>
      <ul className="mt-3 max-h-72 space-y-1.5 overflow-auto text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-muted hover:text-ink">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
