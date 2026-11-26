import Link from "next/link";
import { StaticPage } from "@/components/StaticPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About AmpXa",
  description: "AmpXa is a free market-data site for the USA and Canada showing the live gold price today, silver prices and stock quotes.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <StaticPage title="About AmpXa" path="/about">
      <p>
        AmpXa helps people in the USA, Canada and around the world check the <Link href="/gold-price-today">gold price today</Link> and{" "}
        <Link href="/stock-price-today">live stock prices</Link> quickly on any device.
      </p>
      <h2>Our data</h2>
      <ul>
        <li>Gold and silver: COMEX front-month futures (GC=F, SI=F), which track the spot price closely.</li>
        <li>Stocks, ETFs, indices, crypto and exchange rates: Yahoo Finance market data.</li>
        <li>Karat prices are calculated from the spot price using standard fineness (e.g. 22K = 91.6%).</li>
        <li>Prices refresh about every minute and can be delayed by up to 15 minutes.</li>
      </ul>
      <h2>Methodology</h2>
      <p>
        Local-currency gold prices convert the US-dollar spot price at the live exchange rate. They show the value of the metal only — they do not include
        dealer premiums, jeweller making charges, import duties or sales taxes.
      </p>
    </StaticPage>
  );
}
