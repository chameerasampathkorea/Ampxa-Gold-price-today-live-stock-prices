export function Sparkline({ values, width = 96, height = 28 }: { values: number[]; width?: number; height?: number }) {
  if (values.length < 2) return <span className="inline-block" style={{ width, height }} />;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = values.length > 60 ? Math.ceil(values.length / 60) : 1;
  const pts = values
    .filter((_, i) => i % step === 0 || i === values.length - 1)
    .map((v, i, arr) => `${((i / (arr.length - 1)) * width).toFixed(1)},${(height - 2 - ((v - min) / span) * (height - 4)).toFixed(1)}`);
  const up = values[values.length - 1] >= values[0];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline points={pts.join(" ")} fill="none" stroke={up ? "var(--up)" : "var(--down)"} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
