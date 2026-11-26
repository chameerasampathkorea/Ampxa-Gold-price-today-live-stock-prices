import Link from "next/link";
import { AutoRefresh } from "@/components/AutoRefresh";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { QuoteTable } from "@/components/QuoteTable";
import { getQuote } from "@/lib/market";
import { fmtMarketTime, fmtPct } from "@/lib/format";
import { pageMetadata, webPageLd } from "@/lib/seo";
import { ASSETS, INDEX_ASSETS, MAG7, assetsBySymbols } from "@/lib/stocks";

export const dynamic = "force-dynamic";

const META = {
  title: "Stock Prices Today: Live US & Canadian Stock Quotes",
  description:
    "Live stock prices today for the S&P 500, Dow Jones, Nasdaq and TSX, the Magnificent 7 (NVIDIA, Apple, Microsoft, Tesla…), popular ETFs and crypto, with charts and daily change.",
  path: "/stock-price-today",
};

export const metadata = pageMetadata({ ...META, keywords: ["stock price today", "stock price today live", "stock prices today", "stock market today", "mag 7 stock price today"] });

const groups = [
  { id: "stocks-us", title: "Popular US stocks", assets: ASSETS.filter((a) => a.kind === "stock" && a.country === "US" && a.popular && !MAG7.includes(a.symbol)) },
  { id: "stocks-ca", title: "Canadian stocks (TSX)", assets: ASSETS.filter((a) => a.kind === "stock" && a.country === "CA") },
  { id: "etfs", title: "Popular ETFs", assets: ASSETS.filter((a) => a.kind === "etf" && a.popular).concat(ASSETS.filter((a) => ["DIA", "GLD", "QQQM"].includes(a.symbol))) },
  { id: "crypto", title: "Crypto prices", assets: ASSETS.filter((a) => a.kind === "crypto") },
];

export default async function StocksHub() {
  const spx = await getQuote("^GSPC");
  const letters = Array.from(new Set(ASSETS.filter((a) => a.kind !== "index").map((a) => a.ticker[0].toUpperCase()))).sort();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <Breadcrumbs crumbs={[{ name: "Home", path: "/" }, { name: "Stock prices today", path: META.path }]} />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-4xl">Stock Prices Today — Live Market Data</h1>
          <p className="mt-2 text-sm text-muted">
            {spx ? <>S&amp;P 500 {fmtPct(spx.changePercent)} · as of {fmtMarketTime(spx.time)}</> : "Live quotes"}
          </p>
        </div>
        <AutoRefresh />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="idx-h">
          <h2 id="idx-h" className="mb-3 text-xl font-bold text-ink">Market indices</h2>
          <QuoteTable assets={INDEX_ASSETS} caption="Major US and Canadian stock market indices today" />
        </section>
        <section aria-labelledby="m7-h">
          <h2 id="m7-h" className="mb-3 text-xl font-bold text-ink">Magnificent 7 stock prices today</h2>
          <QuoteTable assets={assetsBySymbols(MAG7)} caption="Magnificent 7 stock prices today" />
        </section>
        {groups.map((g) => (
          <section key={g.id} aria-labelledby={`${g.id}-h`}>
            <h2 id={`${g.id}-h`} className="mb-3 text-xl font-bold text-ink">{g.title}</h2>
            <QuoteTable assets={g.assets} caption={g.title} />
          </section>
        ))}
      </div>

      <section className="mt-12" aria-labelledby="az-h">
        <h2 id="az-h" className="text-xl font-bold text-ink">All stocks A–Z</h2>
        <nav aria-label="Jump to letter" className="mt-3 flex flex-wrap gap-1">
          {letters.map((l) => (
            <a key={l} href={`#letter-${l}`} className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface text-sm font-semibold text-ink hover:bg-surface-2">
              {l}
            </a>
          ))}
        </nav>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {letters.map((l) => (
            <div key={l} id={`letter-${l}`} className="scroll-mt-20">
              <h3 className="text-sm font-bold text-gold">{l}</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {ASSETS.filter((a) => a.kind !== "index" && a.ticker[0].toUpperCase() === l).map((a) => (
                  <li key={a.slug}>
                    <Link href={`/stock-price-today/${a.slug}`} className="text-muted hover:text-ink">
                      <span className="font-semibold text-ink">{a.ticker}</span> {a.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <article className="prose-ax mt-12 max-w-3xl">
        <h2>How to read stock prices today</h2>
        <p>
          Each quote shows the latest trade price, the change from yesterday&apos;s close in dollars and percent, and a mini chart of today&apos;s
          session. US markets (NYSE and Nasdaq) and the Toronto Stock Exchange trade from 9:30 a.m. to 4:00 p.m. Eastern Time, Monday to Friday.
          Crypto trades 24/7.
        </p>
        <p>
          Gold investors can also follow the <Link href="/gold-price-today">gold price today</Link>, gold ETFs like{" "}
          <Link href="/stock-price-today/gld">GLD</Link> and miners like <Link href="/stock-price-today/nem">Newmont</Link>.
        </p>
      </article>
      <Faq
        items={[
          { q: "Are these stock prices live?", a: "Quotes refresh about every minute during market hours and may be delayed by up to 15 minutes depending on the exchange." },
          { q: "What are the Magnificent 7 stocks?", a: "NVIDIA (NVDA), Apple (AAPL), Microsoft (MSFT), Amazon (AMZN), Alphabet/Google (GOOGL), Meta Platforms (META) and Tesla (TSLA)." },
          { q: "Why are stocks up or down today?", a: "Broad daily moves are usually driven by economic data (jobs, inflation), Federal Reserve interest-rate expectations, bond yields, earnings reports and geopolitical news." },
        ]}
      />
      <JsonLd data={webPageLd(META)} />
    </div>
  );
}
