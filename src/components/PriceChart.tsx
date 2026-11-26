"use client";

import { useState } from "react";

export type ChartRange = { label: string; t: number[]; c: number[]; intraday?: boolean };

const W = 640;
const H = 240;
const PAD = { top: 12, right: 8, bottom: 8, left: 8 };

function formatValue(v: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: v >= 100000 ? 0 : v < 1 ? 4 : 2,
  }).format(v);
}

function formatTime(unix: number, intraday: boolean, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", intraday ? { hour: "numeric", minute: "2-digit", timeZone } : { month: "short", day: "numeric", year: "2-digit", timeZone }).format(new Date(unix * 1000));
}

function geometry(closes: number[], scale: number) {
  const vals = closes.map((v) => v * scale);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const x = (i: number) => PAD.left + (i / (vals.length - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + (1 - (v - min) / span) * (H - PAD.top - PAD.bottom);
  const pts = vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
  return { vals, min, max, x, y, line: `M${pts.join("L")}`, area: `M${x(0)},${H - PAD.bottom}L${pts.join("L")}L${x(vals.length - 1)},${H - PAD.bottom}Z` };
}

export function PriceChart({
  ranges,
  currency = "USD",
  scale = 1,
  timeZone = "America/New_York",
  title,
}: {
  ranges: ChartRange[];
  currency?: string;
  /** Multiplier applied to every point (e.g. USD/oz → CAD/gram). */
  scale?: number;
  timeZone?: string;
  title: string;
}) {
  const usable = ranges.filter((r) => r.c.length > 1);
  const [active, setActive] = useState(Math.min(1, Math.max(usable.length - 1, 0)));
  const [hover, setHover] = useState<number | null>(null);
  const range = usable[active];

  const geo = range ? geometry(range.c, scale) : null;

  if (!range || !geo) {
    return <div className="flex h-60 items-center justify-center rounded-xl border border-line bg-surface text-sm text-muted">Chart data is temporarily unavailable.</div>;
  }

  const first = geo.vals[0];
  const last = geo.vals[geo.vals.length - 1];
  const up = last >= first;
  const color = up ? "var(--up)" : "var(--down)";
  const idx = hover ?? geo.vals.length - 1;
  const pct = ((geo.vals[idx] - first) / first) * 100;

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((rel - PAD.left) / (W - PAD.left - PAD.right)) * (geo!.vals.length - 1));
    setHover(Math.max(0, Math.min(geo!.vals.length - 1, i)));
  }

  return (
    <figure className="rounded-xl border border-line bg-surface p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <figcaption className="min-w-0">
          <span className="block text-xs text-muted">{title}</span>
          <span className="tabular text-lg font-semibold text-ink">{formatValue(geo.vals[idx], currency)}</span>{" "}
          <span className={`tabular text-sm font-medium ${pct >= 0 ? "text-up" : "text-down"}`}>
            {pct >= 0 ? "+" : ""}
            {pct.toFixed(2)}%
          </span>{" "}
          <span className="text-xs text-muted">{formatTime(range.t[idx], !!range.intraday, timeZone)}</span>
        </figcaption>
        <div role="tablist" aria-label="Chart range" className="flex rounded-lg bg-surface-2 p-1">
          {usable.map((r, i) => (
            <button
              key={r.label}
              role="tab"
              type="button"
              aria-selected={i === active}
              onClick={() => {
                setActive(i);
                setHover(null);
              }}
              className={`min-h-8 min-w-10 rounded-md px-2.5 text-xs font-semibold ${i === active ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-3 h-56 w-full touch-none sm:h-64"
        preserveAspectRatio="none"
        role="img"
        aria-label={`${title}: ${range.label} change ${((last - first) / first * 100).toFixed(2)}%`}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="ax-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={PAD.left} x2={W - PAD.right} y1={geo.y(first)} y2={geo.y(first)} stroke="var(--line)" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
        <path d={geo.area} fill="url(#ax-fill)" />
        <path d={geo.line} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        {hover != null && (
          <>
            <line x1={geo.x(idx)} x2={geo.x(idx)} y1={PAD.top} y2={H - PAD.bottom} stroke="var(--muted)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <circle cx={geo.x(idx)} cy={geo.y(geo.vals[idx])} r="4" fill={color} />
          </>
        )}
      </svg>
      <div className="flex justify-between text-xs text-muted">
        <span>{formatTime(range.t[0], !!range.intraday, timeZone)}</span>
        <span>{formatTime(range.t[range.t.length - 1], !!range.intraday, timeZone)}</span>
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted">
        <span>Low {formatValue(geo.min, currency)}</span>
        <span>High {formatValue(geo.max, currency)}</span>
      </div>
    </figure>
  );
}
