import type { Metadata } from "next";
import { SITE, absoluteUrl } from "./site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

/** Consistent per-page metadata: canonical, Open Graph, Twitter, keywords. */
export function pageMetadata({ title, description, path, keywords }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      locale: SITE.locale,
    },
    twitter: { card: "summary_large_image", title, description, site: SITE.twitter },
  };
}

export type Crumb = { name: string; path: string };
export type FaqItem = { q: string; a: string };

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function faqLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function webPageLd({ title, description, path, dateModified }: PageMeta & { dateModified?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(path),
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
    ...(dateModified ? { dateModified } : {}),
  };
}

export function organizationLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: absoluteUrl("/icon.svg"),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      inLanguage: "en-US",
    },
  ];
}
