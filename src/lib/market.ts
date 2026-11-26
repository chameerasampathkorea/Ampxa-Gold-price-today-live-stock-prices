/**
 * Market data layer. Uses Yahoo Finance's public chart endpoint (no API key).
 * It is unofficial and rate-limited — swap `fetchChart` for a licensed feed
 * (Polygon, Twelve Data, Finnhub, Metals-API…) before going to production.
 */

export type Quote = {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  type: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  dayHigh: number | null;
  dayLow: number | null;
  high52: number | null;
  low52: number | null;
  volume: number | null;
  time: number;
  timezone: string;
};

export type Series = { t: number[]; c: number[] };

type ChartRange = "1d" | "5d" | "1mo" | "6mo" | "1y" | "5y" | "10y";
type ChartInterval = "5m" | "15m" | "1d" | "1wk" | "1mo";

type YahooMeta = {
  currency?: string;
  symbol: string;
  exchangeName?: string;
  fullExchangeName?: string;
  instrumentType?: string;
  regularMarketTime?: number;
  exchangeTimezoneName?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  longName?: string;
  shortName?: string;
  previousClose?: number;
  chartPreviousClose?: number;
};

type YahooChart = {
  meta: YahooMeta;
  timestamp?: number[];
  indicators?: { quote?: { close?: (number | null)[] }[] };
};

const BASE = "https://query1.finance.yahoo.com/v8/finance/chart/";

const MINUTE = 60_000;
const memo = new Map<string, { at: number; ttl: number; data: unknown }>();

/**
 * Per-instance TTL cache of resolved data. Promises are deliberately not shared:
 * on Workers, awaiting another request's in-flight I/O can hang the request.
 */
async function cached<T>(key: string, ttl: number, load: () => Promise<T>): Promise<T> {
  const hit = memo.get(key);
  if (hit && Date.now() - hit.at < hit.ttl) return hit.data as T;
  const data = await load();
  // Retry failures sooner than successes.
  memo.set(key, { at: Date.now(), ttl: data == null ? 10_000 : ttl, data });
  if (memo.size > 2000) memo.delete(memo.keys().next().value!);
  return data;
}

/** Edge-cache lifetime per range (seconds); shared by all Worker instances in a Cloudflare data centre. */
const EDGE_TTL: Record<ChartRange, number> = { "1d": 60, "5d": 300, "1mo": 3600, "6mo": 3600, "1y": 3600, "5y": 86400, "10y": 86400 };

async function fetchChart(symbol: string, range: ChartRange, interval: ChartInterval): Promise<YahooChart | null> {
  try {
    const res = await fetch(`${BASE}${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AmpXa/1.0; +https://ampxa.com)" },
      signal: AbortSignal.timeout(8000),
      // Cloudflare-only option; ignored by Node.
      cf: { cacheTtl: EDGE_TTL[range], cacheEverything: true },
    } as RequestInit);
    if (!res.ok) return null;
    const json = (await res.json()) as { chart?: { result?: YahooChart[] } };
    return json.chart?.result?.[0] ?? null;
  } catch {
    return null;
  }
}

function toSeries(chart: YahooChart | null): Series {
  const t: number[] = [];
  const c: number[] = [];
  const ts = chart?.timestamp ?? [];
  const closes = chart?.indicators?.quote?.[0]?.close ?? [];
  for (let i = 0; i < ts.length; i++) {
    const v = closes[i];
    if (v != null && Number.isFinite(v)) {
      t.push(ts[i]);
      c.push(v);
    }
  }
  return { t, c };
}

function toQuote(meta: YahooMeta): Quote | null {
  const price = meta.regularMarketPrice;
  if (price == null) return null;
  const prev =
    meta.previousClose ??
    (meta.regularMarketChangePercent != null ? price / (1 + meta.regularMarketChangePercent / 100) : null) ??
    meta.chartPreviousClose ??
    price;
  const change = price - prev;
  return {
    symbol: meta.symbol,
    name: meta.longName ?? meta.shortName ?? meta.symbol,
    currency: meta.currency ?? "USD",
    exchange: meta.fullExchangeName ?? meta.exchangeName ?? "",
    type: meta.instrumentType ?? "EQUITY",
    price,
    previousClose: prev,
    change,
    changePercent: prev ? (change / prev) * 100 : 0,
    dayHigh: meta.regularMarketDayHigh ?? null,
    dayLow: meta.regularMarketDayLow ?? null,
    high52: meta.fiftyTwoWeekHigh ?? null,
    low52: meta.fiftyTwoWeekLow ?? null,
    volume: meta.regularMarketVolume ?? null,
    time: meta.regularMarketTime ?? 0,
    timezone: meta.exchangeTimezoneName ?? "America/New_York",
  };
}

/** Latest quote plus today's intraday series. Refreshes every minute. */
export function getIntraday(symbol: string): Promise<{ quote: Quote; series: Series } | null> {
  return cached(`quote:${symbol}`, MINUTE, async () => {
    const chart = await fetchChart(symbol, "1d", "5m");
    const quote = chart ? toQuote(chart.meta) : null;
    return quote ? { quote, series: toSeries(chart) } : null;
  });
}

export async function getQuote(symbol: string): Promise<Quote | null> {
  return (await getIntraday(symbol))?.quote ?? null;
}

export async function getQuotes(symbols: readonly string[]): Promise<Record<string, Quote | null>> {
  const entries = await Promise.all(symbols.map(async (s) => [s, await getQuote(s)] as const));
  return Object.fromEntries(entries);
}

/** Daily closes for one year. Refreshes hourly. */
export function getHistory(symbol: string): Promise<Series> {
  return cached(`history:${symbol}`, 60 * MINUTE, async () => toSeries(await fetchChart(symbol, "1y", "1d")));
}

/** Monthly closes for ten years (long-range comparisons). */
export function getLongHistory(symbol: string): Promise<Series> {
  return cached(`history10y:${symbol}`, 24 * 60 * MINUTE, async () => toSeries(await fetchChart(symbol, "10y", "1mo")));
}

/** USD → currency rate. */
export async function getFxRate(currency: string): Promise<number | null> {
  if (currency === "USD") return 1;
  const q = await getQuote(`USD${currency}=X`);
  return q?.price ?? null;
}
