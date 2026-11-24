import type { Metadata } from "next";
import type { Book, Seo } from "./catalog";
import { site } from "./site";

/** Search title, description, and social image: the editor's SEO overrides, or sensible defaults. */
export function metaFor(item: { title: string; summary: string; seo: Seo }, fallbackImage: string) {
  return {
    title: item.seo.title || item.title,
    description: item.seo.description || item.summary,
    image: item.seo.image || fallbackImage,
  };
}

/** The site-wide share image, for pages that have no image of their own. */
export const SHARE_IMAGE = { url: "/images/site/social-share.jpg", width: 1200, height: 675, alt: site.name };

const SUFFIX = " | ePublishingWorks";

/**
 * Metadata for a page: search title and description, canonical, and the Open Graph tags
 * (including og:url) that a page-level openGraph would otherwise drop from the layout.
 * A plain `title` gets the site suffix; `{ absolute }` is used as is.
 */
export function pageMetadata(o: {
  title: string | { absolute: string };
  description?: string;
  path: string;
  type?: "website" | "article" | "book" | "profile";
  images?: NonNullable<Metadata["openGraph"]>["images"];
  noindex?: boolean;
  openGraph?: Record<string, unknown>;
}): Metadata {
  const full = typeof o.title === "string" ? o.title + SUFFIX : o.title.absolute;
  return {
    title: o.title,
    ...(o.description ? { description: o.description } : {}),
    alternates: { canonical: o.path },
    ...(o.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: o.type ?? "website",
      siteName: site.name,
      locale: "en_US",
      url: o.path,
      title: full,
      ...(o.description ? { description: o.description } : {}),
      images: o.images ?? [SHARE_IMAGE],
      ...o.openGraph,
    } as Metadata["openGraph"],
  };
}

const list = (xs: string[]) => (xs.length < 3 ? xs.join(" and ") : `${xs.slice(0, -1).join(", ")}, and ${xs[xs.length - 1]}`);

/**
 * A search description built only from the book's own record, for the few books whose
 * WordPress page had no description (TODO(dustin): real copy; see migration/catalog-report.md).
 */
export function bookFacts(book: Pick<Book, "title" | "genre" | "series" | "seriesNumber" | "retailers">, by: string): string {
  const series = book.series ? (book.seriesNumber !== null ? `, ${book.series} Book ${book.seriesNumber}` : `, ${book.series}`) : "";
  const stores = [...new Set(book.retailers.map((r) => r.name).filter((n) => n !== "Other"))].slice(0, 4);
  const lead = `${book.title}${by ? ` by ${by}` : ""}. ${book.genre || "Fiction"}${series}, published by ePublishingWorks.`;
  return stores.length ? `${lead} Available from ${list(stores)}.` : lead;
}
