const moneyCache = new Map<string, Intl.NumberFormat>();

export function fmtMoney(value: number | null | undefined, currency = "USD", digits?: number) {
  if (value == null || !Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  const max = digits ?? (abs >= 100000 ? 0 : abs < 1 ? 4 : 2);
  const key = `${currency}:${max}`;
  let f = moneyCache.get(key);
  if (!f) {
    f = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: Math.min(max, 2),
      maximumFractionDigits: max,
    });
    moneyCache.set(key, f);
  }
  return f.format(value);
}

export function fmtNumber(value: number | null | undefined, digits = 2) {
  if (value == null || !Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function fmtCompact(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(value);
}

export function fmtPct(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function fmtSigned(value: number | null | undefined, digits = 2) {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${value > 0 ? "+" : ""}${fmtNumber(value, digits)}`;
}

/** Unix seconds → "Nov 3, 2026, 4:00 PM ET" (market time, deterministic for prerendering). */
export function fmtMarketTime(unix: number | null | undefined, timeZone = "America/New_York") {
  if (!unix) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
    timeZoneName: "short",
  }).format(new Date(unix * 1000));
}

export function fmtDate(unix: number, timeZone = "America/New_York") {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone }).format(
    new Date(unix * 1000),
  );
}

export function isoDate(unix: number) {
  return new Date(unix * 1000).toISOString();
}

export function trendClass(value: number | null | undefined) {
  if (value == null || value === 0) return "text-muted";
  return value > 0 ? "text-up" : "text-down";
}
