import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { BooksBrowser, type CatalogBook } from "@/components/BooksBrowser";
import { JsonLd } from "@/components/JsonLd";
import { PageBanner } from "@/components/PageBanner";
import { ArrowRight } from "@/components/icons";
import { authorsOfBook, bookAuthorLabel, booksPageOrder, directoryAuthors, getCatalog } from "@/lib/content";
import { breadcrumbSchema, graph, ids } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Books: Mystery, Cozy Mystery & Historical Romance",
  description: "Browse every ePublishingWorks book: cozy and historical mysteries, crime fiction, historical and contemporary romance, and more, with links to buy at major retailers.",
  path: "/books/",
});

/** "Alice Duncan" → "duncan alice", so Author A–Z sorts by last name. */
const lastFirst = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return `${parts.at(-1)} ${parts.slice(0, -1).join(" ")}`.toLowerCase();
};

export default async function BooksPage() {
  // Featured books first (same order as the home page wall), then the rest A to Z.
  const c = await getCatalog();
  const books = booksPageOrder(c);
  const catalog: CatalogBook[] = books.map((b, rank) => ({
    slug: b.slug,
    title: b.title,
    author: bookAuthorLabel(c, b),
    authorSort: lastFirst(authorsOfBook(c, b, { visibleOnly: true })[0]?.name ?? ""),
    series: b.series ? (b.seriesNumber !== null ? `${b.series}, book ${b.seriesNumber}` : b.series) : "",
    seriesName: b.series,
    seriesNumber: b.seriesNumber,
    cover: b.cover,
    coverWidth: b.coverWidth,
    coverHeight: b.coverHeight,
    href: b.url,
    genre: b.genre,
    rank,
  }));
  const authorCount = directoryAuthors(c).length;

  return (
    <>
      <PageBanner
        intro={
          <>
            <strong className="font-semibold text-white">
              {books.length} books from {authorCount} authors.
            </strong>{" "}
            Search by title, author, or series, or browse by genre. Every book links straight to the major retailers.
          </>
        }
      >
        Books
      </PageBanner>

      <section className="px-5 pb-20 pt-10 md:pt-14 lg:px-8">
        <div className="mx-auto max-w-[1320px]">
          <BooksBrowser books={catalog} />
        </div>
      </section>

      <section className="bg-brand px-5 py-16 lg:px-8">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-[30px] font-extrabold uppercase leading-[1.05] tracking-[-0.5px] text-gold md:text-[40px]">Your book belongs here</h2>
            <p className="mt-3 max-w-[560px] text-[18px] text-white/80">
              Earn 80% to 85% royalties while we handle covers, sales copy, distribution, and promotion.
            </p>
          </div>
          <Link href="/submit-your-manuscript/" className="btn btn-gold btn-lg shrink-0">
            Submit Your Manuscript <ArrowRight />
          </Link>
        </div>
      </section>

      <JsonLd
        data={graph(
          {
            "@type": "CollectionPage",
            name: `Books published by ${site.name}`,
            url: `${site.url}/books/`,
            publisher: { "@id": ids.org },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: books.length,
              itemListElement: books.map((b, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}${b.url}`, name: b.title })),
            },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Books", path: "/books/" },
          ]),
        )}
      />
    </>
  );
}
