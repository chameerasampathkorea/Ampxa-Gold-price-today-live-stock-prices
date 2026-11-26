import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AutoRefresh } from "@/components/AutoRefresh";
import { Change } from "@/components/Change";
import { Faq } from "@/components/Faq";
import { FlashValue } from "@/components/FlashValue";
import { JsonLd } from "@/components/JsonLd";
import { PriceChart } from "@/components/PriceChart";
import { GOLD_SYMBOL, GRAMS_PER_OZ, SILVER_SYMBOL } from "@/lib/gold";
import { getFxRate, getHistory, getIntraday } from "@/lib/market";
import { fmtMarketTime, fmtMoney, fmtNumber } from "@/lib/format";
import { pageMetadata, webPageLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

const META = {
  title: "Silver Price Today: Live Per Ounce & Per Gram (USD, CAD)",
  description: "Live silver price today per ounce and per gram in US and Canadian dollars, with the gold-to-silver ratio, a 1-year silver chart and today's change.",
  path: "/silver-price-today",
};

export const metadata = pageMetadata({ ...META, keywords: ["silver price today", "gold price today and silver", "gold price today vs silver", "silver rate today", "xag"] });

export default async function SilverPage() {
  const [silver, gold, history, cad] = await Promise.all([getIntraday(SILVER_SYMBOL), getIntraday(GOLD_SYMBOL), getHistory(SILVER_SYMBOL), getFxRate("CAD")]);
  const q = silver?.quote;
  const ratio = q && gold ? gold.quote.price / q.price : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs crumbs={[{ name: "Home", path: "/" }, { name: "Silver price today", path: META.path }]} />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-4xl">Silver Price Today</h1>
          <p className="mt-2 text-sm text-muted">Updated {fmtMarketTime(q?.time)} · COMEX silver futures ({SILVER_SYMBOL})</p>
        </div>
        <AutoRefresh />
      </div>
      {q ? (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card label="Silver per ounce (USD)"><FlashValue value={q.price} text={fmtMoney(q.price)} /><span className="mt-1 block text-sm"><Change change={q.change} pct={q.changePercent} /></span></Card>
            <Card label="Silver per gram (USD)"><FlashValue value={q.price / GRAMS_PER_OZ} text={fmtMoney(q.price / GRAMS_PER_OZ)} /></Card>
            <Card label="Silver per ounce (CAD)">{cad ? fmtMoney(q.price * cad, "CAD") : "—"}</Card>
            <Card label="Gold/silver ratio">{ratio ? fmtNumber(ratio, 1) : "—"}</Card>
          </div>
          <div className="mt-8">
            <PriceChart
              title="Silver per ounce (USD)"
              ranges={[
                { label: "1D", t: silver!.series.t, c: silver!.series.c, intraday: true },
                { label: "1M", t: history.t.slice(-22), c: history.c.slice(-22) },
                { label: "6M", t: history.t.slice(-126), c: history.c.slice(-126) },
                { label: "1Y", t: history.t, c: history.c },
              ]}
            />
          </div>
        </>
      ) : (
        <p className="mt-6 text-muted">Live silver prices are temporarily unavailable.</p>
      )}
      <article className="prose-ax mt-10 max-w-3xl">
        <h2>Gold vs silver price today</h2>
        <p>
          Gold is trading at {fmtMoney(gold?.quote.price)} per ounce and silver at {fmtMoney(q?.price)}, so it takes about {ratio ? fmtNumber(ratio, 1) : "—"} ounces
          of silver to buy one ounce of gold. Historically the ratio has ranged from roughly 40 to over 100; a high ratio means silver is cheap relative to gold.
          See the <Link href="/gold-price-today">live gold price today</Link>.
        </p>
      </article>
      <Faq
        items={[
          { q: "What is the silver price today per ounce?", a: q ? `Silver is ${fmtMoney(q.price)} per troy ounce today in US dollars${cad ? ` (${fmtMoney(q.price * cad, "CAD")} in Canada)` : ""}.` : "Live data is temporarily unavailable." },
          { q: "What is the silver price per gram?", a: q ? `About ${fmtMoney(q.price / GRAMS_PER_OZ)} per gram of pure silver.` : "Live data is temporarily unavailable." },
          { q: "What is the gold to silver ratio?", a: "It's the number of ounces of silver needed to buy one ounce of gold — the gold price divided by the silver price." },
        ]}
      />
      <JsonLd data={webPageLd(META)} />
    </div>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <span className="block text-xs font-medium text-muted">{label}</span>
      <div className="mt-1 text-2xl font-bold text-ink">{children}</div>
    </div>
  );
}
