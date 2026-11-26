import { fmtPct, fmtSigned } from "@/lib/format";

export function Change({ change, pct, digits = 2, pill = false }: { change?: number | null; pct: number | null | undefined; digits?: number; pill?: boolean }) {
  const up = (pct ?? 0) > 0;
  const down = (pct ?? 0) < 0;
  const tone = up ? "text-up" : down ? "text-down" : "text-muted";
  const bg = pill ? (up ? "bg-up-soft" : down ? "bg-down-soft" : "bg-surface-2") : "";
  return (
    <span className={`tabular inline-flex items-center gap-1 font-medium ${tone} ${pill ? `rounded-md px-2 py-0.5 ${bg}` : ""}`}>
      <span aria-hidden="true">{up ? "▲" : down ? "▼" : "•"}</span>
      {change != null && <span>{fmtSigned(change, digits)}</span>}
      <span>{change != null ? `(${fmtPct(pct)})` : fmtPct(pct)}</span>
      <span className="sr-only">{up ? "up" : down ? "down" : "unchanged"}</span>
    </span>
  );
}
