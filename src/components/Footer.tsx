import Link from "next/link";
import { Logo } from "./Header";
import { KARATS, LOCATIONS } from "@/lib/gold";
import { ASSETS } from "@/lib/stocks";
import { SITE } from "@/lib/site";

const footerLocations = LOCATIONS.filter((l) => !l.parent).slice(0, 12);
const footerStocks = ASSETS.filter((a) => a.popular).slice(0, 12);

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 text-sm leading-6 text-muted">{SITE.tagline}.</p>
        </div>
        <FooterCol title="Gold by karat" links={KARATS.map((k) => ({ href: `/gold-price-today/${k.slug}`, label: `${k.label} gold price today` }))} />
        <FooterCol title="Gold by country" links={footerLocations.map((l) => ({ href: `/gold-price-today/${l.slug}`, label: `Gold price in ${l.name}` }))} />
        <FooterCol title="Popular stocks" links={footerStocks.map((a) => ({ href: `/stock-price-today/${a.slug}`, label: `${a.ticker} stock price today` }))} />
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. Market data may be delayed and is for information only — not financial advice.
          </p>
          <ul className="flex gap-4">
            <li><Link href="/about" className="hover:text-ink">About</Link></li>
            <li><Link href="/disclaimer" className="hover:text-ink">Disclaimer</Link></li>
            <li><Link href="/privacy" className="hover:text-ink">Privacy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-muted hover:text-ink">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
