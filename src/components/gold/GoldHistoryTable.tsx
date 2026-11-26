import { dailyRows, type GoldData } from "@/lib/gold-data";
import { GRAMS_PER_OZ } from "@/lib/gold";
import { fmtDate, fmtMoney } from "@/lib/format";
import { Change } from "../Change";

export function GoldHistoryTable({
  history,
  fx,
  currency,
  days = 30,
  purity = 1,
}: {
  history: GoldData["history"];
  fx: number;
  currency: string;
  days?: number;
  purity?: number;
}) {
  const rows = dailyRows(history, days);
  if (!rows.length) return null;
  return (
    <div className="max-h-[28rem] overflow-auto rounded-xl border border-line bg-surface">
      <table className="w-full text-sm">
        <caption className="sr-only">Gold price history, last {days} trading days</caption>
        <thead className="sticky top-0 bg-surface-2 text-left text-xs uppercase tracking-wide text-muted">
          <tr>
            <th scope="col" className="px-3 py-2.5 font-semibold">Date</th>
            <th scope="col" className="px-3 py-2.5 text-right font-semibold">Per oz</th>
            <th scope="col" className="px-3 py-2.5 text-right font-semibold">Per gram</th>
            <th scope="col" className="px-3 py-2.5 text-right font-semibold">Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={r.t}>
              <td className="whitespace-nowrap px-3 py-2 text-ink">{fmtDate(r.t)}</td>
              <td className="tabular px-3 py-2 text-right">{fmtMoney(r.close * fx * purity, currency)}</td>
              <td className="tabular px-3 py-2 text-right">{fmtMoney((r.close / GRAMS_PER_OZ) * fx * purity, currency)}</td>
              <td className="px-3 py-2 text-right"><Change pct={r.pct} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
