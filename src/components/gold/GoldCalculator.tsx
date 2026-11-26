"use client";

import { useId, useMemo, useState } from "react";

type Option = { value: string; label: string };

const KARATS: (Option & { purity: number })[] = [
  { value: "24", label: "24K (999)", purity: 1 },
  { value: "22", label: "22K (916)", purity: 0.916 },
  { value: "21", label: "21K (875)", purity: 0.875 },
  { value: "18", label: "18K (750)", purity: 0.75 },
  { value: "14", label: "14K (585)", purity: 0.585 },
  { value: "10", label: "10K (417)", purity: 0.417 },
  { value: "9", label: "9K (375)", purity: 0.375 },
];

const UNITS: (Option & { grams: number })[] = [
  { value: "g", label: "grams", grams: 1 },
  { value: "oz", label: "troy ounces", grams: 31.1034768 },
  { value: "tola", label: "tola", grams: 11.6638038 },
  { value: "dwt", label: "pennyweight (dwt)", grams: 1.55517384 },
  { value: "kg", label: "kilograms", grams: 1000 },
];

export function GoldCalculator({
  spotUsdOz,
  rates,
  defaultCurrency = "USD",
  defaultKarat = "24",
}: {
  spotUsdOz: number;
  /** USD → currency rates. */
  rates: Record<string, number>;
  defaultCurrency?: string;
  defaultKarat?: string;
}) {
  const id = useId();
  const [weight, setWeight] = useState("10");
  const [unit, setUnit] = useState("g");
  const [karat, setKarat] = useState(defaultKarat);
  const [currency, setCurrency] = useState(rates[defaultCurrency] ? defaultCurrency : "USD");
  const [premium, setPremium] = useState("0");

  const result = useMemo(() => {
    const w = Number.parseFloat(weight);
    const k = KARATS.find((x) => x.value === karat)!;
    const u = UNITS.find((x) => x.value === unit)!;
    const p = Number.parseFloat(premium) || 0;
    if (!Number.isFinite(w) || w < 0) return null;
    const grams = w * u.grams;
    const melt = (spotUsdOz / 31.1034768) * grams * k.purity * (rates[currency] ?? 1);
    return { grams, melt, total: melt * (1 + p / 100) };
  }, [weight, unit, karat, currency, premium, spotUsdOz, rates]);

  const money = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: v >= 100000 ? 0 : 2 }).format(v);

  const field = "mt-1 block min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-base text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

  return (
    <section aria-labelledby={`${id}-h`} className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <h2 id={`${id}-h`} className="text-lg font-bold text-ink">Gold value calculator</h2>
      <p className="mt-1 text-sm text-muted">Work out the melt value of any gold item from today&apos;s live price.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-sm font-medium text-ink">
          Weight
          <input inputMode="decimal" type="number" min="0" step="any" value={weight} onChange={(e) => setWeight(e.target.value)} className={field} />
        </label>
        <label className="text-sm font-medium text-ink">
          Unit
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className={field}>
            {UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-ink">
          Purity
          <select value={karat} onChange={(e) => setKarat(e.target.value)} className={field}>
            {KARATS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-ink">
          Currency
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={field}>
            {Object.keys(rates).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-ink">
          Premium / making %
          <input inputMode="decimal" type="number" step="any" value={premium} onChange={(e) => setPremium(e.target.value)} className={field} />
        </label>
      </div>
      <output className="mt-4 grid gap-3 rounded-lg bg-gold-soft p-4 sm:grid-cols-3" aria-live="polite">
        <div>
          <span className="block text-xs text-muted">Pure gold content</span>
          <span className="tabular text-lg font-semibold text-ink">{result ? `${(result.grams * (KARATS.find((x) => x.value === karat)!.purity)).toFixed(3)} g` : "—"}</span>
        </div>
        <div>
          <span className="block text-xs text-muted">Melt value</span>
          <span className="tabular text-lg font-semibold text-ink">{result ? money(result.melt) : "—"}</span>
        </div>
        <div>
          <span className="block text-xs text-muted">With premium</span>
          <span className="tabular text-lg font-bold text-gold">{result ? money(result.total) : "—"}</span>
        </div>
      </output>
    </section>
  );
}
