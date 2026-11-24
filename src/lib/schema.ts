// JSON-LD builders. Entities share stable @id values so search engines and AI
// answer engines can connect the publisher, its authors, and its books.
import { site } from "./site";
import { absoluteUrl } from "./urls";
import type { Author, Book, Catalog, Post } from "./catalog";
import { authorsOfBook, postModified } from "./catalog";
import type { Faq } from "./site";

const abs = absoluteUrl;
export const ids = {
  org: `${site.url}/#organization`,
  website: `${site.url}/#website`,
  person: (a: Author) => `${site.url}${a.url}#person`,
  book: (b: Book) => `${site.url}${b.url}#book`,
};

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ids.org,
    name: site.name,
    alternateName: ["ePublishing Works", "ePublishingWorks!"],
    url: site.url,
    logo: { "@type": "ImageObject", url: abs(site.logo.src), width: site.logo.width, height: site.logo.height },
    description: site.description,
    foundingDate: site.foundingDate,
    email: site.email,
    telephone: "+1-866-846-5123",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    contactPoint: { "@type": "ContactPoint", telephone: "+1-866-846-5123", email: site.email, contactType: "customer service", areaServed: "Worldwide", availableLanguage: ["English"] },
    knowsAbout: ["Book publishing", "Ebook publishing", "Backlist republishing", "Mystery and cozy mystery", "Historical romance", "Crime fiction", "Book marketing"],
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
  };
}

export function websiteSchema() {
  return { "@type": "WebSite", "@id": ids.website, url: site.url, name: site.name, publisher: { "@id": ids.org }, inLanguage: "en-US" };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function bookSchema(c: Catalog, book: Book) {
  const authors = authorsOfBook(c, book, { visibleOnly: true });
  return {
    "@type": "Book",
    "@id": ids.book(book),
    name: book.title,
    ...(book.subtitle ? { alternativeHeadline: book.subtitle } : {}),
    url: abs(book.url),
    image: abs(book.cover),
    description: book.summary,
    inLanguage: book.language,
    ...(book.genre ? { genre: book.genre } : {}),
    // The ISBN comes from the cover file the publisher uploaded (a checked ISBN-13), so it
    // describes the book itself rather than one retailer's edition.
    ...(book.isbn ? { isbn: book.isbn } : {}),
    publisher: { "@id": ids.org },
    author: authors.map((a) => ({ "@type": "Person", "@id": ids.person(a), name: a.name, url: abs(a.url) })),
    ...(book.updatedAt ? { dateModified: book.updatedAt } : {}),
    ...(book.series ? { isPartOf: { "@type": "BookSeries", name: book.series }, ...(book.seriesNumber !== null ? { position: book.seriesNumber } : {}) } : {}),
    ...(book.formats.length
      ? {
          workExample: book.formats.map((f) => ({
            "@type": "Book",
            bookFormat: f === "eBook" ? "https://schema.org/EBook" : f === "Audiobook" ? "https://schema.org/AudiobookFormat" : f === "Hardcover" ? "https://schema.org/Hardcover" : "https://schema.org/Paperback",
          })),
        }
      : {}),
    sameAs: book.retailers.filter((r) => /amazon|barnesandnoble|books\.apple|play\.google|kobo/.test(r.url)).map((r) => r.url),
  };
}

export function personSchema(author: Author, bookList: Book[]) {
  return {
    "@type": "Person",
    "@id": ids.person(author),
    name: author.name,
    url: abs(author.url),
    ...(author.photo ? { image: abs(author.photo) } : {}),
    ...(author.role ? { jobTitle: author.role } : {}),
    description: author.summary,
    ...(author.website ? { sameAs: [author.website] } : {}),
    mainEntityOfPage: abs(author.url),
    workExample: bookList.map((b) => ({ "@id": ids.book(b) })),
  };
}

export function faqSchema(items: Faq[] | { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function articleSchema(post: Post) {
  return {
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: abs(`/blog/${post.slug}/`),
    mainEntityOfPage: abs(`/blog/${post.slug}/`),
    ...(post.date ? { datePublished: post.date } : {}),
    dateModified: postModified(post) ?? undefined,
    ...(post.image ? { image: abs(post.image) } : {}),
    author: post.authorName === site.name ? { "@id": ids.org } : { "@type": "Person", name: post.authorName },
    publisher: { "@id": ids.org },
    articleSection: post.category,
    keywords: post.tags.join(", "),
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
