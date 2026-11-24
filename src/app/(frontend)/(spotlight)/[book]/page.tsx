import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Book3D } from "@/components/Book3D";
import { BookTile } from "@/components/BookTile";
import { BuyButtons } from "@/components/BuyButtons";
import { CopyButton } from "@/components/CopyButton";
import { JsonLd } from "@/components/JsonLd";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import { authorsOfBook, bookAuthorLabel, booksByAuthor, getCatalog, seriesSiblings, visibleBooks, type Book, type Catalog } from "@/lib/content";
import { LostContent } from "../../not-found";
import { textOf } from "@/lib/richtext";
import { lostMetadata, resolvePage } from "@/lib/resolve";
import { bookFacts, metaFor, pageMetadata } from "@/lib/seo";
import { bookSchema, breadcrumbSchema, graph } from "@/lib/schema";
import { site } from "@/lib/site";

// Every book has a standalone page at the site root, named title-then-author the way the
// WordPress book pages were (/spirits-adopted-alice-duncan/). Unknown root paths get a real
// 404 from src/proxy.ts.
export async function generateStaticParams() {
  const c = await getCatalog();
  const books = visibleBooks(c);
  // Cache Components needs at least one param to prerender the route shape.
  return books.length ? books.map((b) => ({ book: b.slug })) : [{ book: "_placeholder" }];
}

const seriesLine = (b: Pick<Book, "series" | "seriesNumber">) => (b.series ? (b.seriesNumber !== null ? `${b.series}, Book ${b.seriesNumber}` : b.series) : "");

export async function generateMetadata({ params }: PageProps<"/[book]">): Promise<Metadata> {
  const { book: segment } = await params;
  const { c, item: book } = await resolvePage(`/${segment}/`, "book");
  if (!book) return lostMetadata;
  const by = bookAuthorLabel(c, book);
  const byline = by ? ` by ${by}` : "";
  const named = `${book.title}${book.subtitle && book.seriesNumber === null ? `: ${book.subtitle}` : ""}`;
  // Over 60 characters the byline goes first, never the subtitle: box sets differ only by it.
  const title = `${named}${byline}`.length > 60 && named !== book.title ? named : `${named}${byline}`;
  const meta = metaFor({ title, summary: book.summary || bookFacts(book, by), seo: book.seo }, book.cover);
  const ownImage = meta.image === book.cover;
  return pageMetadata({
    title: meta.title,
    description: meta.description,
    path: book.url,
    type: "book",
    images: [ownImage ? { url: book.cover, width: book.coverWidth, height: book.coverHeight, alt: `Cover of ${book.title}` } : { url: meta.image }],
    openGraph: { title: book.seo.title || `${named}${byline}` },
  });
}

const tile = (c: Catalog, b: Book) => ({
  slug: b.slug,
  title: b.title,
  author: bookAuthorLabel(c, b),
  series: seriesLine(b),
  cover: b.cover,
  coverWidth: b.coverWidth,
  coverHeight: b.coverHeight,
  href: b.url,
});

export default async function BookSpotlightPage({ params }: PageProps<"/[book]">) {
  const { book: segment } = await params;
  const { c, item: book } = await resolvePage(`/${segment}/`, "book");
  if (!book) return <LostContent />;
  const authors = authorsOfBook(c, book, { visibleOnly: true });
  const author = authors[0];
  const es = book.language === "es";
  const series = seriesSiblings(c, book);
  const inSeries = series.length > 1;
  const more = authors
    .flatMap((a) => booksByAuthor(c, a.slug))
    .filter((b) => b.slug !== book.slug && !(inSeries && series.some((s) => s.slug === b.slug)))
    .slice(0, 10);
  const hasLinks = book.retailers.length > 0;
  const hasDescription = textOf(book.descriptionHtml).trim().length > 0;

  return (
    <>
      {/* Hero: the book, its title, and the buy buttons. */}
      <section className="bg-brand relative overflow-hidden" lang={es ? "es" : undefined}>
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-5 pb-16 pt-10 md:grid-cols-[minmax(0,400px)_1fr] md:gap-16 md:pb-24 md:pt-16 lg:px-8">
          <div className="mx-auto w-full max-w-[320px] md:max-w-none">
            <Book3D src={book.cover} alt={`Cover of ${book.title}${authors.length ? ` by ${bookAuthorLabel(c, book)}` : ""}`} width={book.coverWidth} height={book.coverHeight} priority />
          </div>
          <div>
            <p className="type-kicker !text-gold">{seriesLine(book) || book.genre}</p>
            <h1 className="mt-3 font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.02em] text-white sm:text-[52px] lg:text-[60px]">{book.title}</h1>
            {book.subtitle && book.seriesNumber === null ? <p className="mt-3 text-[20px] leading-[1.35] text-white/80 md:text-[24px]">{book.subtitle}</p> : null}
            {authors.length ? (
              <p className="mt-5 text-[18px] text-white/85">
                {es ? "por" : "by"}{" "}
                {authors.map((a, i) => (
                  <span key={a.slug}>
                    {i > 0 ? " & " : ""}
                    <Link href={a.url} className="font-semibold text-white underline decoration-gold decoration-2 underline-offset-[6px] hover:text-gold">
                      {a.name}
                    </Link>
                  </span>
                ))}
              </p>
            ) : null}
            <ul className="mt-5 flex flex-wrap gap-2">
              {book.genre ? (
                <li>
                  <Link
                    href={`/books/?genre=${encodeURIComponent(book.genre)}`}
                    className="inline-block rounded-full border border-white/25 px-3 py-1 text-[13px] font-semibold text-white/85 no-underline hover:border-gold hover:text-gold"
                  >
                    {book.genre}
                  </Link>
                </li>
              ) : null}
              {book.formats.map((f) => (
                <li key={f} className="rounded-full border border-white/25 px-3 py-1 text-[13px] font-semibold text-white/80">
                  {f}
                </li>
              ))}
            </ul>
            {hasLinks ? (
              <div id="get-your-copy" className="mt-8 scroll-mt-24">
                <BuyButtons retailers={book.retailers} lang={book.language} />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Description with a details sidebar. */}
      <section className="px-5 py-16 md:py-20 lg:px-8" lang={es ? "es" : undefined}>
        {/* A book without a description (TODO(dustin), see migration/catalog-report.md) shows only its details. */}
        <div className={`mx-auto grid gap-12 lg:gap-16 ${hasDescription ? "max-w-[1320px] lg:grid-cols-[1fr_340px]" : "max-w-[560px]"}`}>
          {hasDescription ? (
            <div>
              <h2 className="type-section !text-[28px] md:!text-[34px]">{es ? "Sobre el libro" : "About the book"}</h2>
              <div className="rich-text book-copy mt-6 max-w-[68ch]" dangerouslySetInnerHTML={{ __html: book.descriptionHtml }} />
            </div>
          ) : null}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[24px] bg-mist p-6">
              <h2 className="type-card !text-[18px]">{es ? "Detalles" : "Book details"}</h2>
              <dl className="mt-4 space-y-3 text-[15px]">
                {author ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-body">Author</dt>
                    <dd className="text-right font-semibold text-navy">{bookAuthorLabel(c, book)}</dd>
                  </div>
                ) : null}
                {book.series ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-body">Series</dt>
                    <dd className="text-right font-semibold text-navy">{seriesLine(book)}</dd>
                  </div>
                ) : null}
                {book.genre ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-body">Genre</dt>
                    <dd className="text-right font-semibold text-navy">{book.genre}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4">
                  <dt className="text-body">Publisher</dt>
                  <dd className="text-right font-semibold text-navy">
                    <Link href="/" className="text-navy no-underline hover:text-blue">
                      {site.name}
                    </Link>
                  </dd>
                </div>
                {book.formats.length ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-body">Formats</dt>
                    <dd className="text-right font-semibold text-navy">{book.formats.join(", ")}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4">
                  <dt className="text-body">Language</dt>
                  <dd className="text-right font-semibold text-navy">{es ? "Spanish" : "English"}</dd>
                </div>
                {book.isbn ? (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-body">ISBN</dt>
                    <dd className="flex items-center gap-2 font-semibold tabular-nums text-navy">
                      {book.isbn}
                      <CopyButton value={book.isbn} label="ISBN" />
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
            {author ? (
              <Link href={author.url} className="group flex items-center gap-4 rounded-[24px] border border-line p-4 no-underline transition-colors hover:border-blue">
                {author.photo ? (
                  <Image src={author.photo} alt="" width={author.photoWidth} height={author.photoHeight} sizes="72px" className="h-[72px] w-[72px] shrink-0 rounded-full object-cover object-top" />
                ) : null}
                <span>
                  <span className="block text-[13px] text-body">{es ? "Sobre el autor" : "About the author"}</span>
                  <span className="block font-display text-[17px] font-bold text-navy group-hover:text-blue">{author.name}</span>
                  {author.role ? <span className="block text-[14px] text-gold-ink">{author.role}</span> : null}
                </span>
              </Link>
            ) : null}
          </aside>
        </div>
      </section>

      {/* The series in reading order, with this book marked. */}
      {inSeries ? (
        <section className="bg-mist px-5 py-16 lg:px-8" aria-labelledby="series-order">
          <div className="mx-auto max-w-[1320px]">
            <p className="type-kicker">Reading order</p>
            <h2 id="series-order" className="type-section mt-2 !text-[26px] md:!text-[32px]">
              {book.series} in order
            </h2>
            <ol className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
              {series.map((b) => (
                <li key={b.slug} className="relative">
                  <span
                    className={`absolute -left-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full font-display text-[15px] font-extrabold shadow ${
                      b.slug === book.slug ? "bg-gold text-navy" : "bg-navy text-white"
                    }`}
                    aria-hidden="true"
                  >
                    {b.seriesNumber}
                  </span>
                  {b.slug === book.slug ? (
                    <div aria-current="page">
                      <BookTile book={{ ...tile(c, b), series: "You're viewing this book" }} />
                    </div>
                  ) : (
                    <BookTile book={tile(c, b)} />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {more.length ? (
        <section className={`px-5 py-16 lg:px-8 ${inSeries ? "" : "bg-mist"}`}>
          <div className="mx-auto max-w-[1320px]">
            <h2 className="type-section !text-[26px] md:!text-[30px]">More from {bookAuthorLabel(c, book)}</h2>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
              {more.map((b) => (
                <li key={b.slug}>
                  <BookTile book={tile(c, b)} />
                </li>
              ))}
            </ul>
            {author ? (
              <Link href={`${author.url}#books`} className="btn btn-blue mt-10">
                All books by {author.name}
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      {hasLinks ? <StickyBuyBar targetId="get-your-copy" title={book.title} /> : null}

      <JsonLd
        data={graph(
          bookSchema(c, book),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            ...(author ? [{ name: "Authors", path: "/authors/" }, { name: author.name, path: author.url }] : [{ name: "Books", path: "/books/" }]),
            { name: book.title, path: book.url },
          ]),
        )}
      />
    </>
  );
}
