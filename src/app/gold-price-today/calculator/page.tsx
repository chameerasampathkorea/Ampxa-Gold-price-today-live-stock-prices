import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { AutoRefresh } from "@/components/AutoRefresh";
import { GoldCalculator } from "@/components/gold/GoldCalculator";
import { JsonLd } from "@/components/JsonLd";
import { CURRENCIES, GOLD_SYMBOL } from "@/lib/gold";
import { getFxRate, getQuote } from "@/lib/market";
import { fmtMarketTime, fmtMoney } from "@/lib/format";
import { pageMetadata, webPageLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

const META = {
  title: "Gold Price Calculator — Value Gold by Weight & Karat Today",
  description:
    "Free gold calculator using today's live gold price. Enter weight in grams, ounces, tola or pennyweight and purity (24K–9K) to get the melt value in USD, CAD and 20+ currencies.",
  path: "/gold-price-today/calculator",
};

export const metadata = pageMetadata({ ...META, keywords: ["gold price today calculator", "gold calculator", "gold melt value calculator", "scrap gold calculator"] });

export default async function CalculatorPage() {
  const [quote, ...fx] = await Promise.all([getQuote(GOLD_SYMBOL), ...CURRENCIES.map((c) => getFxRate(c))]);
  const rates = Object.fromEntries(CURRENCIES.map((c, i) => [c, fx[i]]).filter(([, r]) => r != null)) as Record<string, number>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs crumbs={[{ name: "Home", path: "/" }, { name: "Gold price today", path: "/gold-price-today" }, { name: "Calculator", path: META.path }]} />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-4xl">Gold Price Calculator</h1>
        <AutoRefresh />
      </div>
      <p className="mt-3 text-muted">
        Spot gold: <strong className="text-ink">{fmtMoney(quote?.price)}</strong> per ounce · updated {fmtMarketTime(quote?.time)}
      </p>
      <div className="mt-6">
        {quote ? <GoldCalculator spotUsdOz={quote.price} rates={rates} /> : <p className="text-muted">Live prices are temporarily unavailable.</p>}
      </div>
      <article className="prose-ax mt-10">
        <h2>How to use the gold calculator</h2>
        <ul>
          <li>Weigh your item on a kitchen or jeweller&apos;s scale (grams are the most accurate).</li>
          <li>Check the stamp: 999 = 24K, 916 = 22K, 750 = 18K, 585 = 14K, 417 = 10K, 375 = 9K.</li>
          <li>Pick your currency — USD, CAD, GBP, INR, AED and more use live exchange rates.</li>
          <li>Add a premium (buying) or a negative percentage (selling to a dealer) to estimate what you&apos;ll actually pay or receive.</li>
        </ul>
        <h2>Melt value vs selling price</h2>
        <p>
          Melt value is the worth of the pure gold inside your item. Gold buyers and pawn shops typically pay 70–90% of melt value, while jewellers charge
          making fees on top. Check the <Link href="/gold-price-today">live gold price today</Link> or the price for{" "}
          <Link href="/gold-price-today/14k">14K</Link> and <Link href="/gold-price-today/22k">22K</Link> gold.
        </p>
      </article>
      <Faq
        items={[
          { q: "How do I calculate the value of scrap gold?", a: "Multiply the weight in grams by the purity (e.g. 0.585 for 14K) and by today's price per gram of pure gold. The calculator above does this automatically." },
          { q: "What is a pennyweight (dwt)?", a: "A pennyweight is 1.555 grams, or 1/20 of a troy ounce. Many US scrap gold buyers quote prices per dwt." },
          { q: "Does the calculator include taxes?", a: "No. It shows the value of the gold content only. Use the premium field to add sales tax, GST/HST or making charges." },
        ]}
      />
      <JsonLd data={webPageLd(META)} />
    </div>
  );
}
