import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";

export function StaticPage({ title, path, children }: { title: string; path: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs crumbs={[{ name: "Home", path: "/" }, { name: title, path }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">{title}</h1>
      <div className="prose-ax mt-6">{children}</div>
    </div>
  );
}
