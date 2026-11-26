import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbLd, type Crumb } from "@/lib/seo";

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          {crumbs.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === crumbs.length - 1 ? (
                <span aria-current="page" className="text-ink">{c.name}</span>
              ) : (
                <Link href={c.path} className="hover:text-ink">{c.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(crumbs)} />
    </>
  );
}
