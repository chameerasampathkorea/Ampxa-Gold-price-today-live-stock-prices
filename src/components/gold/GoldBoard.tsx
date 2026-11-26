import type { ReactNode } from "react";
import { GOLD_SYMBOL, GRAMS_PER_OZ, KARATS, UNITS, goldValue } from "@/lib/gold";
import { closeDaysAgo, type GoldData } from "@/lib/gold-data";
import { getFxRate } from "@/lib/market";
import { fmtMarketTime, fmtMoney, fmtPct } from "@/lib/format";
import type { Crumb } from "@/lib/seo";
import { AutoRefresh } from "../AutoRefresh";
import { Breadcrumbs } from "../Breadcrumbs";
import { Change } from "../Change";
import { FlashValue } from "../FlashValue";
import { PriceChart } from "../PriceChart";
import { GoldPriceGrid } from "./GoldPriceGrid";
import { GoldHistoryTable } from "./GoldHistoryTable";
import { GoldCalculator } from "./GoldCalculator";

export type GoldBoardProps = {
  data: GoldData;
  currency: string;
  h1: string;
  lead: ReactNode;
  crumbs: Crumb[];
  karatSlug?: string;
  unitSlug?: string;
  gridUnits?: string[];
  children?: ReactNode;
};

export async function GoldBoard({ data, currency, h1, lead, crumbs, karatSlug = "24k", unitSlug = "per-gram", gridUnits, children }: GoldBoardProps) {
  const { quote, fx } = data;
  const karat = KARATS.find((k) => k.slug === karatSlug)!;
  const unit = UNITS.find((u) => u.slug === unitSlug)!;
  const cad = currency === "CAD" ? fx : await getFxRate("CAD");

  if (!quote || fx == null) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="mt-4 text-3xl font-bold text-ink">{h1}</h1>
        <p className="mt-4 rounded-xl border border-line bg-surface p-4 text-muted">Live gold prices are temporarily unavailable. Please refresh in a minute.</p>
        {children}
      </div>
    );
  }

  const spot = quote.price;
  const headline = goldValue(spot, fx, unit.grams, karat.purity);
  const perOz = spot * fx;
  const perGram24 = goldValue(spot, fx, 1, 1);
  const weekAgo = closeDaysAgo(data.history, 7);
  const yearAgo = closeDaysAgo(data.history, 365);
  const fiveYearsAgo = closeDaysAgo(data.long, 365 * 5);
  const pctFrom = (old: number | null) => (old ? ((spot - old) / old) * 100 : null);

  const chartScale = (unit.grams / GRAMS_PER_OZ) * karat.purity * fx;
  const rates: Record<string, number> = { USD: 1, ...(cad ? { CAD: cad } : {}), [currency]: fx };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <Breadcrumbs crumbs={crumbs} />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-4xl">{h1}</h1>
          <p className="mt-2 text-sm text-muted">
            Updated <time dateTime={new Date(quote.time * 1000).toISOString()}>{fmtMarketTime(quote.time)}</time> · Source: COMEX gold futures ({GOLD_SYMBOL})
          </p>
        </div>
        <AutoRefresh />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={`${karat.label} gold ${unit.label}`} big>
          <FlashValue value={headline} text={fmtMoney(headline, currency)} />
          <span className="mt-1 block text-sm"><Change pct={quote.changePercent} /></span>
        </Stat>
        <Stat label="Gold spot price per ounce">
          <FlashValue value={perOz} text={fmtMoney(perOz, currency)} />
          <span className="mt-1 block text-sm"><Change change={quote.change * fx} pct={quote.changePercent} /></span>
        </Stat>
        <Stat label="24K gold per gram">
          <FlashValue value={perGram24} text={fmtMoney(perGram24, currency)} />
          <span className="mt-1 block text-xs text-muted">
            Day range {fmtMoney(((quote.dayLow ?? spot) / GRAMS_PER_OZ) * fx, currency)} – {fmtMoney(((quote.dayHigh ?? spot) / GRAMS_PER_OZ) * fx, currency)}
          </span>
        </Stat>
        <Stat label="Gold price vs history">
          <dl className="grid grid-cols-3 gap-1 text-xs">
            <Delta label="1 week" pct={pctFrom(weekAgo)} />
            <Delta label="1 year" pct={pctFrom(yearAgo)} />
            <Delta label="5 years" pct={pctFrom(fiveYearsAgo)} />
          </dl>
        </Stat>
      </div>

      <div className="mt-6 prose-ax max-w-3xl">{lead}</div>

      <section className="mt-6" aria-labelledby="grid-h">
        <h2 id="grid-h" className="mb-3 text-xl font-bold text-ink">Gold rate today by karat ({currency})</h2>
        <GoldPriceGrid
          spot={spot}
          fx={fx}
          currency={currency}
          unitSlugs={gridUnits ?? ["per-gram", "per-10-grams", "per-tola", "per-ounce"]}
          highlightKarat={karat.slug}
          caption={`Gold price today by karat in ${currency}`}
        />
      </section>

      <section className="mt-8" aria-labelledby="chart-h">
        <h2 id="chart-h" className="mb-3 text-xl font-bold text-ink">Gold price chart — live, 1 month, 1 year, 10 years</h2>
        <PriceChart
          title={`${karat.label} gold ${unit.label} (${currency})`}
          currency={currency}
          scale={chartScale}
          ranges={[
            { label: "1D", t: data.intraday.t, c: data.intraday.c, intraday: true },
            { label: "1M", t: data.history.t.slice(-22), c: data.history.c.slice(-22) },
            { label: "6M", t: data.history.t.slice(-126), c: data.history.c.slice(-126) },
            { label: "1Y", t: data.history.t, c: data.history.c },
            { label: "10Y", t: data.long.t, c: data.long.c },
          ]}
        />
        {currency !== "USD" && <p className="mt-2 text-xs text-muted">Historical values converted at today&apos;s USD/{currency} rate ({fx.toFixed(4)}).</p>}
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <section aria-labelledby="hist-h">
          <h2 id="hist-h" className="mb-3 text-xl font-bold text-ink">Gold price last 30 days ({karat.label})</h2>
          <GoldHistoryTable history={data.history} fx={fx} currency={currency} purity={karat.purity} />
        </section>
        <div>
          <GoldCalculator spotUsdOz={spot} rates={rates} defaultCurrency={currency} defaultKarat={String(karat.k)} />
          <p className="mt-3 text-xs leading-5 text-muted">
            Prices shown are the international spot-based value of the metal. Dealer, jeweller and local retail rates add premiums, making charges,
            import duty and taxes, so they are usually higher. Today&apos;s move: {fmtPct(quote.changePercent)}.
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

function Stat({ label, children, big }: { label: string; children: ReactNode; big?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${big ? "border-gold/40 bg-gold-soft" : "border-line bg-surface"}`}>
      <span className="block text-xs font-medium text-muted">{label}</span>
      <div className={`mt-1 font-bold text-ink ${big ? "text-3xl" : "text-2xl"}`}>{children}</div>
    </div>
  );
}

function Delta({ label, pct }: { label: string; pct: number | null }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className={`tabular text-sm font-semibold ${pct == null ? "text-muted" : pct >= 0 ? "text-up" : "text-down"}`}>{fmtPct(pct)}</dd>
    </div>
  );
}
