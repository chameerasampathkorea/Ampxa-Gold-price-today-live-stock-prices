import Link from "next/link";
import { KARATS, UNITS, goldValue } from "@/lib/gold";
import { fmtMoney } from "@/lib/format";
import { FlashValue } from "../FlashValue";

export function GoldPriceGrid({
  spot,
  fx,
  currency,
  unitSlugs,
  highlightKarat,
  caption,
}: {
  spot: number;
  fx: number;
  currency: string;
  unitSlugs: string[];
  highlightKarat?: string;
  caption: string;
}) {
  const units = unitSlugs.map((s) => UNITS.find((u) => u.slug === s)!).filter(Boolean);
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[22rem] text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-surface-2 text-left text-xs uppercase tracking-wide text-muted">
          <tr>
            <th scope="col" className="px-3 py-2.5 font-semibold">Purity</th>
            {units.map((u) => (
              <th key={u.slug} scope="col" className="px-3 py-2.5 text-right font-semibold">
                {u.label.replace("per troy ounce", "per oz")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {KARATS.map((k) => (
            <tr key={k.slug} className={k.slug === highlightKarat ? "bg-gold-soft" : "hover:bg-surface-2"}>
              <th scope="row" className="px-3 py-2.5 text-left font-medium">
                <Link href={`/gold-price-today/${k.slug}`} className="text-ink hover:underline">
                  {k.label} gold
                </Link>
                <span className="block text-xs font-normal text-muted">{k.hallmark} · {k.purity === 1 ? "99.9%+" : `${(k.purity * 100).toFixed(1)}%`}</span>
              </th>
              {units.map((u) => {
                const v = goldValue(spot, fx, u.grams, k.purity);
                return (
                  <td key={u.slug} className="px-3 py-2.5 text-right font-medium text-ink">
                    <FlashValue value={v} text={fmtMoney(v, currency)} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
