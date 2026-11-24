import type { MetadataRoute } from "next";
import { booksByAuthor, directoryAuthors, getCatalog, postModified, publishedPosts, visibleBooks } from "@/lib/content";
import { absoluteUrl } from "@/lib/urls";

// When each page written in code (not in the CMS) last changed. Update a date when you edit that page.
const PAGE_UPDATED = {
  about: "2026-11-24",
  advantage: "2026-11-24",
  guidelines: "2026-11-24",
  submit: "2026-11-24",
  faq: "2026-11-24",
  contact: "2026-11-24",
  reviews: "2026-11-24",
  privacyPolicy: "2026-11-24",
};

const latest = (dates: (string | null | undefined)[]) => dates.filter((d): d is string => Boolean(d)).sort().pop();

// URLs keep the WordPress structure, including trailing slashes.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getCatalog();
  const u = absoluteUrl;
  const books = latest(visibleBooks(c).map((b) => b.updatedAt));
  const authors = latest([books, ...directoryAuthors(c).map((a) => a.updatedAt)]);
  const posts = latest(publishedPosts(c, false).map(postModified));
  return [
    // The home page shows the newest books and posts; each list page, its newest item.
    { url: u("/"), lastModified: latest([books, posts]), changeFrequency: "monthly", priority: 1 },
    { url: u("/books/"), lastModified: books, changeFrequency: "monthly", priority: 0.8 },
    { url: u("/authors/"), lastModified: authors, changeFrequency: "monthly", priority: 0.8 },
    { url: u("/blog/"), lastModified: posts, changeFrequency: "weekly", priority: 0.8 },
    { url: u("/the-advantage/"), lastModified: PAGE_UPDATED.advantage, changeFrequency: "yearly", priority: 0.8 },
    { url: u("/submission-guidelines/"), lastModified: PAGE_UPDATED.guidelines, changeFrequency: "yearly", priority: 0.8 },
    { url: u("/submit-your-manuscript/"), lastModified: PAGE_UPDATED.submit, changeFrequency: "yearly", priority: 0.8 },
    { url: u("/frequently-asked-questions/"), lastModified: PAGE_UPDATED.faq, changeFrequency: "yearly", priority: 0.7 },
    { url: u("/contact/"), lastModified: PAGE_UPDATED.contact, changeFrequency: "yearly", priority: 0.7 },
    { url: u("/about/"), lastModified: PAGE_UPDATED.about, changeFrequency: "yearly", priority: 0.6 },
    { url: u("/reviews/"), lastModified: PAGE_UPDATED.reviews, changeFrequency: "yearly", priority: 0.6 },
    { url: u("/privacy-policy/"), lastModified: PAGE_UPDATED.privacyPolicy, changeFrequency: "yearly", priority: 0.2 },
    ...visibleBooks(c).map((b) => ({ url: u(b.url), lastModified: b.updatedAt || undefined, changeFrequency: "yearly" as const, priority: 0.7, images: [u(b.cover)] })),
    ...directoryAuthors(c).map((a) => ({
      url: u(a.url),
      lastModified: [a.updatedAt, ...booksByAuthor(c, a.slug).map((b) => b.updatedAt)].sort().pop() || undefined,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      images: a.photo ? [u(a.photo)] : [],
    })),
    ...publishedPosts(c, false).map((p) => ({
      url: u(`/blog/${p.slug}/`),
      lastModified: postModified(p) ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: p.cover ? [u(p.cover.url)] : [],
    })),
  ];
}
