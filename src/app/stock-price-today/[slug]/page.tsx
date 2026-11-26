import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AutoRefresh } from "@/components/AutoRefresh";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Change } from "@/components/Change";
import { Faq } from "@/components/Faq";
import { FlashValue } from "@/components/FlashValue";
import { JsonLd } from "@/components/JsonLd";
import { PriceChart } from "@/components/PriceChart";
import { QuoteTable, priceText } from "@/components/QuoteTable";
import { closeDaysAgo } from "@/lib/gold-data";
import { getFxRate, getHistory, getIntraday, getQuote, type Quote } from "@/lib/market";
import { fmtCompact, fmtMarketTime, fmtMoney, fmtPct } from "@/lib/format";
import { pageMetadata, webPageLd, type FaqItem } from "@/lib/seo";
import { getAsset, kindLabel, relatedAssets, type Asset } from "@/lib/stocks";

/** Rendered per request so quotes are always current; data itself is cached for a minute. */
export const dynamic = "force-dynamic";

/** ETFs are searched as "share price"/"ETF", TSX names with "tsx", everything else as "stock price". */
function names(a: Asset) {
  const label = a.kind === "index" ? a.name : `${a.name} (${a.country === "CA" ? `TSX: ${a.ticker}` : a.ticker})`;
  const noun = a.kind === "index" ? "today" : a.kind === "crypto" ? "price today" : a.kind === "etf" ? "share price today" : "stock price today";
  const suffix = a.kind === "index" ? "Today — Live Index Level" : a.kind === "crypto" ? "Price Today in USD" : a.kind === "etf" ? "Share Price Today" : "Stock Price Today";
  return { label, h1: `${label} ${suffix}`, noun };
}

/** Google shows roughly 60 characters; only add the optional suffix when it fits. */
function fit(title: string, suffix: string) {
  return (title + suffix).length <= 60 ? title + suffix : title;
}

function metaFor(a: Asset, q?: Quote | null) {
  const path = `/stock-price-today/${a.slug}`;
  const t = a.ticker;
  const p = q ? priceText(a, q.price, q.currency) : null;
  const move = q ? ` (${fmtPct(q.changePercent)})` : "";
  if (a.kind === "index") {
    return { path, title: p ? `${a.name} Today: ${p}${move} — Live Index & Chart` : `${a.name} Today: Live Index Level, Chart & Change`, description: `Live ${a.name} index level today${p ? ` at ${p}` : ""} with points and percent change, intraday and 1-year chart, 52-week range and how the ${a.name} is moving now.`, keywords: [`stock price today ${a.name.toLowerCase()}`, `${a.name.toLowerCase()} today`, `${a.name.toLowerCase()} live`] };
  }
  if (a.kind === "crypto") {
    return { path, title: `${a.name} (${t}) Price Today${p ? `: ${p}` : ""} — USD & CAD Live Chart`, description: `Live ${a.name} (${t}) price today in US and Canadian dollars, 24-hour change, intraday and 1-year chart, and 52-week high and low.`, keywords: [`${a.name.toLowerCase()} price today`, `stock price for ${a.name.toLowerCase()} today`, `${t.toLowerCase()} price today usd`] };
  }
  const aliasKw = (a.aliases ?? []).flatMap((n) => [`${n} stock price`, `${n} stock price today`, `${n} stock quote`]);
  if (a.kind === "etf") {
    const arca = q?.exchange.toLowerCase().includes("arca") ? ` (NYSEARCA: ${t})` : "";
    return {
      path,
      title: `${t} Share Price Today${p ? `: ${p}` : ""} — ${a.name}`,
      description: `${a.name}${arca} share price today${p ? ` is ${p}${move}` : ""}. Live ${t} ETF quote, chart, day range, 52-week high/low and volume.`,
      keywords: [`${t.toLowerCase()} share price`, `${t.toLowerCase()} etf`, `${t.toLowerCase()} stock`, `${t.toLowerCase()} stocks`, `stock symbol ${t.toLowerCase()}`, `nysearca: ${t.toLowerCase()}`, ...aliasKw],
    };
  }
  const tsx = a.country === "CA" ? `TSX: ${t}` : t;
  return {
    path,
    title: fit(`${a.name} Stock Price Today (${tsx})${p ? `: ${p}` : ""}`, " — Live Quote"),
    description: `${a.name} (${tsx}) stock price today${p ? ` is ${p}${move}` : " per share"}. Live stock quote, chart, day range, 52-week high/low and volume — see if ${t} is up or down today and why.`,
    keywords: [`${a.name.toLowerCase()} stock price`, `${t.toLowerCase()} stock price`, `${t.toLowerCase()} stock quote`, `${t.toLowerCase()} chart stock`, `stock price today ${t.toLowerCase()}`, ...(a.country === "CA" ? [`${t.toLowerCase()} stock tsx`] : []), ...aliasKw],
  };
}

export async function generateMetadata({ params }: PageProps<"/stock-price-today/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = getAsset(slug);
  return a ? pageMetadata(metaFor(a, await getQuote(a.symbol))) : { title: "Not found", robots: { index: false } };
}

export default async function AssetPage({ params }: PageProps<"/stock-price-today/[slug]">) {
  const { slug } = await params;
  const a = getAsset(slug);
  if (!a) notFound();

  const meta = metaFor(a);
  const { label, h1 } = names(a);
  const [intraday, history, market] = await Promise.all([getIntraday(a.symbol), getHistory(a.symbol), a.symbol === "^GSPC" ? null : getQuote(a.country === "CA" ? "^GSPTSE" : "^GSPC")]);
  const q = intraday?.quote;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Stock prices today", path: "/stock-price-today" },
    { name: a.kind === "index" ? a.name : a.ticker, path: meta.path },
  ];

  if (!q) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="mt-4 text-3xl font-bold text-ink">{h1}</h1>
        <p className="mt-4 rounded-xl border border-line bg-surface p-4 text-muted">Live quotes for {a.ticker} are temporarily unavailable. Please refresh in a minute.</p>
      </div>
    );
  }

  const other = q.currency === "USD" ? "CAD" : q.currency === "CAD" ? "USD" : null;
  const otherFx = other === "CAD" ? await getFxRate("CAD") : other === "USD" ? 1 / ((await getFxRate("CAD")) ?? NaN) : null;
  const price = (v: number | null | undefined) => (v == null ? "—" : priceText(a, v, q.currency));
  const direction = q.change > 0 ? "up" : q.change < 0 ? "down" : "unchanged";
  const perf = (days: number) => {
    const old = closeDaysAgo(history, days);
    return old ? ((q.price - old) / old) * 100 : null;
  };
  const yearStart = (() => {
    const y = new Date(q.time * 1000).getUTCFullYear();
    const i = history.t.findIndex((t) => new Date(t * 1000).getUTCFullYear() === y);
    return i > 0 ? history.c[i - 1] : null;
  })();
  const ytd = yearStart ? ((q.price - yearStart) / yearStart) * 100 : null;
  const noun = a.kind === "index" ? "index" : a.kind === "crypto" ? "price" : "stock";
  const vsMarket =
    market && a.kind !== "index"
      ? Math.sign(market.changePercent) === Math.sign(q.changePercent)
        ? `in line with the broader market — the ${market.symbol === "^GSPTSE" ? "S&P/TSX Composite" : "S&P 500"} is ${fmtPct(market.changePercent)} today`
        : `against the broader market — the ${market.symbol === "^GSPTSE" ? "S&P/TSX Composite" : "S&P 500"} is ${fmtPct(market.changePercent)} today`
      : null;
  const related = relatedAssets(a, 8);

  const faq: FaqItem[] = [
    {
      q: a.kind === "index" ? `What is the ${a.name} today?` : `What is ${a.ticker} ${noun} price today per share?`,
      a: `${label} is at ${price(q.price)} as of ${fmtMarketTime(q.time, q.timezone)}, ${direction} ${price(Math.abs(q.change))} (${fmtPct(q.changePercent)}) from the previous close of ${price(q.previousClose)}.`,
    },
    {
      q: `Is ${a.kind === "index" ? a.name : a.ticker} up or down today?`,
      a: `${a.kind === "index" ? a.name : a.ticker} is ${direction} ${fmtPct(Math.abs(q.changePercent))} today${vsMarket ? `, ${vsMarket}` : ""}. Today's range is ${price(q.dayLow)} – ${price(q.dayHigh)}.`,
    },
    {
      q: `Why is ${a.kind === "index" ? `the ${a.name}` : `${a.name} ${noun}`} ${direction === "down" ? "down" : "up"} today?`,
      a: `Daily moves usually reflect company news (earnings, guidance, analyst rating changes, product or regulatory news), sector rotation and the overall market mood driven by interest rates, inflation data and the Federal Reserve. ${vsMarket ? `Today ${a.ticker} is moving ${vsMarket}.` : ""} Check the company's investor-relations page and recent filings for specific news.`,
    },
    {
      q: `What is the 52-week high and low for ${a.kind === "index" ? a.name : a.ticker}?`,
      a: `The 52-week range is ${price(q.low52)} to ${price(q.high52)}. The current price is ${q.high52 ? fmtPct(((q.price - q.high52) / q.high52) * 100) : "—"} from the 52-week high.`,
    },
  ];
  if (other && otherFx && a.kind !== "index") {
    faq.push({ q: `What is ${a.ticker} price in ${other === "CAD" ? "Canadian dollars" : "US dollars"}?`, a: `At today's exchange rate, ${a.ticker} at ${fmtMoney(q.price, q.currency)} equals about ${fmtMoney(q.price * otherFx, other)}.` });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <Breadcrumbs crumbs={crumbs} />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">
            {q.exchange} · {a.sector} · {q.currency}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-4xl">{h1}</h1>
        </div>
        <AutoRefresh />
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-4xl font-bold text-ink sm:text-5xl"><FlashValue value={q.price} text={price(q.price)} /></span>
        <span className="text-lg"><Change change={q.change} pct={q.changePercent} pill /></span>
        {other && otherFx && a.kind !== "index" && <span className="tabular text-sm text-muted">≈ {fmtMoney(q.price * otherFx, other)}</span>}
      </div>
      <p className="mt-1 text-xs text-muted">
        As of <time dateTime={new Date(q.time * 1000).toISOString()}>{fmtMarketTime(q.time, q.timezone)}</time>. Quotes may be delayed.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <PriceChart
          title={`${a.kind === "index" ? a.name : a.ticker} price`}
          currency={a.kind === "index" ? "USD" : q.currency}
          timeZone={q.timezone}
          ranges={[
            { label: "1D", t: intraday!.series.t, c: intraday!.series.c, intraday: true },
            { label: "1M", t: history.t.slice(-22), c: history.c.slice(-22) },
            { label: "6M", t: history.t.slice(-126), c: history.c.slice(-126) },
            { label: "1Y", t: history.t, c: history.c },
          ]}
        />
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line text-sm">
          <Stat k="Previous close" v={price(q.previousClose)} />
          <Stat k="Day range" v={`${price(q.dayLow)} – ${price(q.dayHigh)}`} />
          <Stat k="52-week low" v={price(q.low52)} />
          <Stat k="52-week high" v={price(q.high52)} />
          <Stat k="Volume" v={a.kind === "index" && !q.volume ? "—" : fmtCompact(q.volume)} />
          <Stat k="YTD" v={fmtPct(ytd)} tone={ytd} />
          <Stat k="1 month" v={fmtPct(perf(30))} tone={perf(30)} />
          <Stat k="1 year" v={fmtPct(perf(365))} tone={perf(365)} />
        </dl>
      </div>

      <article className="prose-ax mt-10 max-w-3xl">
        <h2>{a.kind === "index" ? `${a.name} today` : `${a.ticker} ${noun} price today`}</h2>
        <p>
          {a.kind === "index" ? `The ${a.name}` : `${label} ${noun}`} is trading at <strong>{price(q.price)}</strong>
          {a.kind === "stock" || a.kind === "etf" ? " per share" : ""}, {direction} <strong>{fmtPct(q.changePercent)}</strong> today
          {vsMarket ? `, ${vsMarket}` : ""}. Over the past year it has moved {fmtPct(perf(365))}, and it is {fmtPct(perf(30))} over the last month.
          {q.high52 ? ` It sits ${fmtPct(((q.price - q.high52) / q.high52) * 100)} below its 52-week high of ${price(q.high52)}.` : ""}
        </p>
        {a.country === "US" && a.kind !== "index" && (
          <p>
            Investors in Canada can buy {a.ticker} through most brokerages in US dollars; at today&apos;s exchange rate one share costs about{" "}
            {otherFx ? fmtMoney(q.price * otherFx, "CAD") : "—"}.
          </p>
        )}
        <h2>About {a.kind === "index" ? `the ${a.name}` : label}</h2>
        <p>
          {a.kind === "index" ? `The ${a.name} is a benchmark ${a.country === "CA" ? "Canadian" : "US"} stock market index.` : `${a.name} is listed on ${q.exchange} under the ticker ${a.ticker} and is classified in the ${a.sector} sector.`}{" "}
          This page shows a live {kindLabel(a.kind)} quote that refreshes about every minute while the market is open, plus intraday, 1-month, 6-month and 1-year charts.
        </p>
      </article>

      {related.length > 0 && (
        <section className="mt-10" aria-labelledby="rel-h">
          <h2 id="rel-h" className="mb-3 text-xl font-bold text-ink">Related {a.sector.toLowerCase()} and popular stocks</h2>
          <QuoteTable assets={related} caption={`Stocks related to ${a.ticker}`} />
        </section>
      )}

      <Faq items={faq} />
      <p className="mt-8 text-xs leading-5 text-muted">
        Data for information only and may be delayed. AmpXa is not a broker or financial adviser; nothing here is a recommendation to buy or sell. See our{" "}
        <Link href="/disclaimer" className="underline">disclaimer</Link>.
      </p>
      <JsonLd data={webPageLd({ ...meta, dateModified: new Date(q.time * 1000).toISOString() })} />
    </div>
  );
}

function Stat({ k, v, tone }: { k: string; v: string; tone?: number | null }) {
  return (
    <div className="bg-surface p-3">
      <dt className="text-xs text-muted">{k}</dt>
      <dd className={`tabular mt-0.5 font-semibold ${tone == null ? "text-ink" : tone >= 0 ? "text-up" : "text-down"}`}>{v}</dd>
    </div>
  );
}
