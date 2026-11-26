import Link from "next/link";
import { GoldBoard } from "@/components/gold/GoldBoard";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { KARATS, LOCATIONS, UNITS, GRAMS_PER_OZ } from "@/lib/gold";
import { loadGold, closeDaysAgo } from "@/lib/gold-data";
import { fmtMoney, fmtPct } from "@/lib/format";
import { pageMetadata, webPageLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

const META = {
  title: "Gold Price Today: Live Spot Price Per Gram & Ounce (USD)",
  description:
    "Live gold price today per gram, per ounce and per tola in US dollars, with 24K, 22K, 18K, 14K and 10K rates, a 10-year chart, last 30 days history and a gold calculator.",
  path: "/gold-price-today",
};

export async function generateMetadata() {
  const q = (await loadGold("USD")).quote;
  return pageMetadata({
    ...META,
    ...(q ? { title: `Gold Price Today: ${fmtMoney(q.price)}/oz, ${fmtMoney(q.price / GRAMS_PER_OZ)}/g — Live` } : {}),
    keywords: ["gold price today", "today's gold price", "how much is gold today", "live gold prices today", "gold price today per gram", "gold price today per ounce", "gold price today near me", "gold cost", "xauusd"],
  });
}

export default async function GoldHubPage() {
  const data = await loadGold("USD");
  const q = data.quote;
  const spot = q?.price ?? 0;
  const perGram = spot / GRAMS_PER_OZ;
  const yesterday = q?.previousClose ?? null;
  const yearAgo = closeDaysAgo(data.history, 365);
  const direction = q ? (q.change > 0 ? "up" : q.change < 0 ? "down" : "unchanged") : "unchanged";

  const faq = [
    { q: "How much is gold today?", a: `Today's gold price is ${fmtMoney(spot)} per troy ounce and ${fmtMoney(perGram)} per gram for 24K gold, ${direction} ${q ? fmtPct(Math.abs(q.changePercent)) : ""} from yesterday.` },
    { q: "What is the gold price near me?", a: `Shops near you start from the same live spot price (${fmtMoney(perGram)} per gram today) and add a premium or making charge. Check your city's page — e.g. New York, Houston, Seattle, Toronto or Montreal — for the rate converted to local currency, then compare dealer quotes against it.` },
    { q: "What is the gold price today per gram?", a: `The gold spot price today is about ${fmtMoney(perGram)} per gram of 24K (pure) gold in US dollars. 22K gold is about ${fmtMoney(perGram * 0.916)} per gram and 14K about ${fmtMoney(perGram * 0.585)} per gram.` },
    { q: "What is the gold price today per ounce?", a: `One troy ounce (31.1 g) of gold is trading at about ${fmtMoney(spot)} today, based on the COMEX front-month gold futures contract.` },
    { q: "Is gold up or down today?", a: q ? `Gold is ${direction} today: ${fmtMoney(Math.abs(q.change))} (${fmtPct(q.changePercent)}) versus yesterday's close of ${fmtMoney(yesterday)} per ounce.` : "Live data is temporarily unavailable." },
    { q: "Why is the gold price going up or down today?", a: "Day-to-day gold moves are driven mainly by the US dollar, real (inflation-adjusted) interest rates and Federal Reserve expectations, plus safe-haven demand during geopolitical stress and central-bank buying. A stronger dollar or rising yields usually push gold down; a weaker dollar, falling yields or market turmoil usually push it up." },
    { q: "How does today's gold price compare with last year?", a: yearAgo && q ? `A year ago gold was around ${fmtMoney(yearAgo)} per ounce, so today's price is ${fmtPct(((spot - yearAgo) / yearAgo) * 100)} versus one year ago.` : "See the 1Y and 10Y chart above for the long-term trend." },
    { q: "Why is the price at a dealer or Costco higher than spot?", a: "The spot price is the wholesale price of raw gold. Coins and bars sold by dealers, warehouse clubs and online shops include a premium for minting, distribution and profit — typically 2–8% for bars and more for small coins and jewellery." },
    { q: "How often is the gold price updated?", a: "Prices on AmpXa refresh about every minute during market hours. Gold futures trade nearly 24 hours a day, Sunday evening to Friday afternoon (New York time)." },
  ];

  return (
    <>
      <GoldBoard
        data={data}
        currency="USD"
        h1="Gold Price Today in USD — Live Per Gram & Per Ounce"
        unitSlug="per-ounce"
        crumbs={[{ name: "Home", path: "/" }, { name: "Gold price today", path: META.path }]}
        lead={
          <p>
            The <strong>gold price today</strong> is <strong>{fmtMoney(spot)} per ounce</strong> and <strong>{fmtMoney(perGram)} per gram</strong> for
            24K gold, {direction} {q ? fmtPct(q.changePercent) : ""} from yesterday. Below you&apos;ll find live gold rates by karat and weight, a gold price
            chart, the last 30 days of closing prices and a calculator to value your jewellery or bullion. Looking for local prices? See the{" "}
            <Link href="/gold-price-today/canada">gold price in Canada</Link>, <Link href="/gold-price-today/india">India</Link> or{" "}
            <Link href="/gold-price-today/dubai">Dubai</Link>.
          </p>
        }
      >
        <article className="prose-ax mt-12 max-w-3xl">
          <h2>Gold price today vs yesterday</h2>
          <p>
            Yesterday gold closed at {fmtMoney(yesterday)} per ounce. Today it is trading at {fmtMoney(spot)}, a move of{" "}
            {q ? `${fmtMoney(q.change)} (${fmtPct(q.changePercent)})` : "—"}. The 30-day table above shows each trading day&apos;s close so you can
            compare today&apos;s price with last week, the last 10 days or the last month.
          </p>
          <h2>How the gold price is calculated</h2>
          <p>
            Gold is priced worldwide in US dollars per <strong>troy ounce</strong> (31.1035 grams). To get the price per gram, divide the ounce price by
            31.1035. For lower purities, multiply by the gold content: 22K is 91.6% gold, 18K is 75%, 14K is 58.5% and 10K is 41.7%.
          </p>
          <ul>
            {KARATS.map((k) => (
              <li key={k.slug}>
                <Link href={`/gold-price-today/${k.slug}`}>{k.label} gold price today</Link> — {fmtMoney(perGram * k.purity)} per gram. {k.note}
              </li>
            ))}
          </ul>
          <h2>Gold price by weight</h2>
          <ul>
            {UNITS.map((u) => (
              <li key={u.slug}>
                <Link href={`/gold-price-today/${u.slug}`}>Gold price today {u.label}</Link>: {fmtMoney(perGram * u.grams)} (24K)
              </li>
            ))}
          </ul>
          <h2>Gold price today in your country or city</h2>
          <p>Gold rates converted to local currency with live exchange rates:</p>
          <ul className="!grid grid-cols-2 gap-x-6 sm:grid-cols-3">
            {LOCATIONS.map((l) => (
              <li key={l.slug}>
                <Link href={`/gold-price-today/${l.slug}`}>Gold price in {l.name}</Link>
              </li>
            ))}
          </ul>
          <h2>What is the gold spot price (XAU/USD)?</h2>
          <p>
            The spot price is the price for immediate delivery of one troy ounce of 99.5%+ pure gold in the wholesale market. It is often quoted as
            XAU/USD. AmpXa uses the COMEX front-month gold futures price, which tracks spot within a few dollars and updates continuously while
            markets are open.
          </p>
        </article>
        <Faq items={faq} />
      </GoldBoard>
      <JsonLd data={webPageLd({ ...META, dateModified: q ? new Date(q.time * 1000).toISOString() : undefined })} />
    </>
  );
}
