import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-sm font-semibold text-gold">404</p>
      <h1 className="mt-2 text-3xl font-bold text-ink">Page not found</h1>
      <p className="mt-3 text-muted">That page doesn&apos;t exist. Try one of these:</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/gold-price-today" className="rounded-lg bg-gold px-4 py-2.5 font-semibold text-white">Gold price today</Link>
        <Link href="/stock-price-today" className="rounded-lg border border-line bg-surface px-4 py-2.5 font-semibold text-ink">Stock prices</Link>
      </div>
    </div>
  );
}
