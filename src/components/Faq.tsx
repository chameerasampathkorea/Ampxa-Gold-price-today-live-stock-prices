import { JsonLd } from "./JsonLd";
import { faqLd, type FaqItem } from "@/lib/seo";

export function Faq({ items, title = "Frequently asked questions" }: { items: FaqItem[]; title?: string }) {
  return (
    <section aria-labelledby="faq" className="mt-12">
      <h2 id="faq" className="text-xl font-bold text-ink">{title}</h2>
      <div className="mt-4 divide-y divide-line rounded-xl border border-line bg-surface">
        {items.map((f) => (
          <details key={f.q} className="group p-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-ink [&::-webkit-details-marker]:hidden">
              <h3 className="text-base">{f.q}</h3>
              <span aria-hidden="true" className="mt-1 text-muted transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 leading-7 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqLd(items)} />
    </section>
  );
}
