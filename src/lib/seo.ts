import type { Seo } from "./catalog";

/** Search title, description, and social image: the editor's SEO overrides, or sensible defaults. */
export function metaFor(item: { title: string; summary: string; seo: Seo }, fallbackImage: string) {
  return {
    title: item.seo.title || item.title,
    description: item.seo.description || item.summary,
    image: item.seo.image || fallbackImage,
  };
}
