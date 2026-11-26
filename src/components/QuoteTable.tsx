import Link from "next/link";
import { getIntraday } from "@/lib/market";
import type { Asset } from "@/lib/stocks";
import { fmtMoney, fmtNumber } from "@/lib/format";
import { Change } from "./Change";
import { Sparkline } from "./Sparkline";
import { FlashValue } from "./FlashValue";

/** Indices are points, not money. */
export function priceText(asset: Asset, price: number, currency: string) {
  return asset.kind === "index" ? fmtNumber(price) : fmtMoney(price, currency);
}

export async function QuoteTable({ assets, caption }: { assets: Asset[]; caption: string }) {
  const rows = await Promise.all(assets.map(async (a) => ({ a, d: await getIntraday(a.symbol) })));
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-surface-2 text-left text-xs uppercase tracking-wide text-muted">
          <tr>
            <th scope="col" className="px-3 py-2.5 font-semibold">Name</th>
            <th scope="col" className="px-3 py-2.5 text-right font-semibold">Price</th>
            <th scope="col" className="px-3 py-2.5 text-right font-semibold">Change</th>
            <th scope="col" className="hidden px-3 py-2.5 text-right font-semibold sm:table-cell">Today</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map(({ a, d }) => (
            <tr key={a.slug} className="hover:bg-surface-2">
              <td className="px-3 py-2.5">
                <Link href={`/stock-price-today/${a.slug}`} className="block">
                  <span className="font-semibold text-ink">{a.ticker}</span>
                  <span className="block max-w-[11rem] truncate text-xs text-muted sm:max-w-xs">{a.name}</span>
                </Link>
              </td>
              <td className="px-3 py-2.5 text-right font-medium text-ink">
                {d ? <FlashValue value={d.quote.price} text={priceText(a, d.quote.price, d.quote.currency)} /> : "—"}
              </td>
              <td className="px-3 py-2.5 text-right">{d ? <Change pct={d.quote.changePercent} /> : "—"}</td>
              <td className="hidden px-3 py-2.5 text-right sm:table-cell">
                {d && <span className="inline-block align-middle"><Sparkline values={d.series.c} /></span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
