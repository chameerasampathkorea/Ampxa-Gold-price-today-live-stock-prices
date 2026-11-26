import { GOLD_SYMBOL } from "./gold";
import { getFxRate, getHistory, getIntraday, getLongHistory } from "./market";

export async function loadGold(currency = "USD") {
  const [intraday, history, long, fx] = await Promise.all([
    getIntraday(GOLD_SYMBOL),
    getHistory(GOLD_SYMBOL),
    getLongHistory(GOLD_SYMBOL),
    getFxRate(currency),
  ]);
  return { quote: intraday?.quote ?? null, intraday: intraday?.series ?? { t: [], c: [] }, history, long, fx };
}

export type GoldData = Awaited<ReturnType<typeof loadGold>>;

/** Daily rows (newest first) with day-over-day change, for "last 10/30 days" tables. */
export function dailyRows(history: GoldData["history"], days: number) {
  const rows: { t: number; close: number; change: number; pct: number }[] = [];
  for (let i = history.c.length - 1; i > 0 && rows.length < days; i--) {
    const close = history.c[i];
    const prev = history.c[i - 1];
    rows.push({ t: history.t[i], close, change: close - prev, pct: ((close - prev) / prev) * 100 });
  }
  return rows;
}

/** Closing price closest to `daysAgo` days before the last point. */
export function closeDaysAgo(series: GoldData["history"], daysAgo: number) {
  if (!series.t.length) return null;
  const target = series.t[series.t.length - 1] - daysAgo * 86400;
  let best = 0;
  for (let i = 0; i < series.t.length; i++) {
    if (Math.abs(series.t[i] - target) < Math.abs(series.t[best] - target)) best = i;
  }
  return Math.abs(series.t[best] - target) < 45 * 86400 ? series.c[best] : null;
}
