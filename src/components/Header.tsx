import Link from "next/link";
import { NAV, SITE } from "@/lib/site";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-ink" aria-label={`${SITE.name} home`}>
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="var(--gold)" />
        <path d="M7 23 L13 11 L17 18 L20 14 L25 23" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <span className="text-lg">
        Amp<span className="text-gold">Xa</span>
      </span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm font-medium">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="rounded-md px-3 py-2 text-muted hover:bg-surface-2 hover:text-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* No-JS mobile menu */}
        <details className="group relative md:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md border border-line text-ink [&::-webkit-details-marker]:hidden" aria-label="Open menu">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="group-open:hidden">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="hidden group-open:block">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </summary>
          <nav aria-label="Mobile" className="absolute right-0 top-12 w-56 rounded-xl border border-line bg-surface p-2 shadow-lg">
            <ul className="text-sm font-medium">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="block rounded-md px-3 py-3 text-ink hover:bg-surface-2">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
