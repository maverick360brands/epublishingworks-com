import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { TiltCover } from "@/components/TiltCover";
import { JsonLd } from "@/components/JsonLd";
import { ArrowRight } from "@/components/icons";
import { booksByAuthor, getCatalog, visibleAuthors, type Book } from "@/lib/content";
import { LostContent } from "../../../not-found";
import { lostMetadata, resolvePage } from "@/lib/resolve";
import { metaFor } from "@/lib/seo";
import { breadcrumbSchema, graph, personSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  const authors = visibleAuthors(await getCatalog());
  return authors.length ? authors.map((a) => ({ author: a.slug })) : [{ author: "_placeholder" }];
}

export async function generateMetadata({ params }: PageProps<"/authors/[author]">): Promise<Metadata> {
  const { author: segment } = await params;
  const { c, item: author } = await resolvePage(`/authors/${segment}/`, "author");
  if (!author) return lostMetadata;
  const books = booksByAuthor(c, author.slug);
  const title = books.length === 1 ? `${author.name}, Author of ${books[0].title}` : `${author.name}: Books & Biography`;
  const meta = metaFor({ title, summary: author.summary, seo: author.seo }, author.photo);
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: author.url },
    openGraph: {
      type: "profile",
      title: author.seo.title || `${author.name} | ${site.name}`,
      description: meta.description,
      ...(meta.image === author.photo && author.photo
        ? { images: [{ url: author.photo, width: author.photoWidth, height: author.photoHeight, alt: author.name }] }
        : meta.image
          ? { images: [{ url: meta.image }] }
          : {}),
    },
  };
}

export default async function AuthorPage({ params }: PageProps<"/authors/[author]">) {
  const { author: segment } = await params;
  const { c, item: author } = await resolvePage(`/authors/${segment}/`, "author");
  if (!author) return <LostContent />;
  const books = booksByAuthor(c, author.slug);
  // Authors without a portrait show their first cover in the hero instead.
  const fallbackCover = !author.photo ? books[0] : undefined;
  // Books grouped by series (each in reading order), then everything outside a series.
  const groups: { series: string; books: Book[] }[] = [];
  for (const b of books.filter((x) => x.series)) {
    const g = groups.find((x) => x.series === b.series);
    if (g) g.books.push(b);
    else groups.push({ series: b.series, books: [b] });
  }
  const standalone = books.filter((b) => !b.series);
  if (standalone.length) groups.push({ series: "", books: standalone });
  const grouped = groups.length > 1;
  const seriesCount = groups.filter((g) => g.series).length;

  return (
    <>
      <section className="bg-brand relative overflow-hidden">
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-5 pb-14 pt-8 md:grid-cols-[300px_1fr] md:gap-14 md:pb-20 md:pt-12 lg:px-8">
          <nav aria-label="Breadcrumb" className="md:col-span-2">
            <Link href="/authors/" className="inline-flex items-center gap-2 text-[14px] font-semibold text-white/75 no-underline hover:text-white">
              <ArrowRight className="h-3 w-3.5 rotate-180" /> All authors
            </Link>
          </nav>
          <div className="relative mx-auto w-[220px] md:w-full">
            <span aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-[28px] border-2 border-gold" />
            {author.photo ? (
              <Image
                src={author.photo}
                alt={`Portrait of ${author.name}`}
                width={author.photoWidth}
                height={author.photoHeight}
                sizes="300px"
                priority
                className="relative aspect-[4/5] w-full rounded-[28px] object-cover object-top"
              />
            ) : fallbackCover ? (
              <Image
                src={fallbackCover.cover}
                alt={`Cover of ${fallbackCover.title}`}
                width={fallbackCover.coverWidth}
                height={fallbackCover.coverHeight}
                sizes="300px"
                priority
                className="relative aspect-[4/5] w-full rounded-[28px] bg-white object-contain p-6"
              />
            ) : null}
          </div>
          <div>
            {author.role ? <p className="type-kicker !text-gold">{author.role}</p> : null}
            <h1 className="mt-3 font-display text-[40px] font-extrabold uppercase leading-[1] tracking-[-1px] text-white sm:text-[54px] lg:text-[64px]">{author.name}</h1>
            <p className="mt-4 text-[17px] text-white/75">
              {books.length} {books.length === 1 ? "book" : "books"} with {site.name}
              {seriesCount ? ` · ${seriesCount} series` : ""}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#books" className="btn btn-gold btn-lg">
                See {books.length === 1 ? "the Book" : `All ${books.length} Books`} <ArrowRight className="h-[1em] w-[1.15em] rotate-90" />
              </a>
              {author.website ? (
                <a href={author.website} target="_blank" rel="noopener" className="btn btn-ghost-light btn-lg">
                  Author Website
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:py-20 lg:px-8">
        <div className="mx-auto max-w-[1320px]">
          <h2 className="type-section">About {author.name}</h2>
          <div className="book-copy mt-6 max-w-[68ch] [&_a]:text-blue [&_a]:underline" dangerouslySetInnerHTML={{ __html: author.bioHtml }} />
        </div>
      </section>

      <section id="books" className="scroll-mt-24 bg-mist px-5 py-16 md:py-20 lg:px-8">
        <div className="mx-auto max-w-[1320px]">
          <h2 className="type-section">Books by {author.name}</h2>
          {grouped ? (
            <nav aria-label="Series" className="mt-6">
              <ul className="flex flex-wrap gap-2">
                {groups.map((g, i) => (
                  <li key={g.series || "standalone"}>
                    <a href={`#group-${i}`} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[14px] font-semibold text-navy no-underline hover:border-blue hover:text-blue">
                      {g.series || "Other books"} <span className="rounded-full bg-mist px-2 text-[12px] text-body">{g.books.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {groups.map((g, gi) => (
            <div key={g.series || "standalone"} id={`group-${gi}`} className="scroll-mt-28">
              {grouped ? (
                <h3 className="mt-12 font-display text-[22px] font-extrabold tracking-[-0.01em] text-navy md:text-[26px]">
                  {g.series || "Other books"}
                  {g.series && g.books.some((b) => b.seriesNumber !== null) ? <span className="ml-3 align-middle text-[14px] font-semibold text-gold-ink">in reading order</span> : null}
                </h3>
              ) : null}
              <ul className="mt-6 grid gap-6 lg:grid-cols-2">
                {g.books.map((b, i) => (
                  <li key={b.slug}>
                    <Link
                      href={b.url}
                      className="group grid h-full grid-cols-[110px_1fr] gap-6 rounded-[28px] bg-white p-5 no-underline shadow-[0_1px_2px_rgba(13,31,60,0.06)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(13,31,60,0.5)] sm:grid-cols-[150px_1fr] sm:p-7"
                    >
                      <TiltCover src={b.cover} alt={`Cover of ${b.title}`} width={b.coverWidth} height={b.coverHeight} sizes="150px" priority={gi === 0 && i < 2 && !author.photo} />
                      <span className="flex flex-col">
                        {b.series ? <span className="type-kicker">{b.seriesNumber !== null ? `${b.series}, Book ${b.seriesNumber}` : b.series}</span> : <span className="type-kicker">{b.genre}</span>}
                        <span className="mt-1 font-display text-[22px] font-bold leading-[1.15] tracking-[-0.01em] text-blue sm:text-[25px]">{b.title}</span>
                        {b.subtitle && b.seriesNumber === null ? <span className="mt-1.5 text-[15px] font-medium leading-[1.4] text-navy">{b.subtitle}</span> : null}
                        <span className="mt-3 line-clamp-3 text-[15px] leading-[1.6] text-body" lang={b.language === "es" ? "es" : undefined}>
                          {b.summary}
                        </span>
                        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[15px] font-bold text-navy">
                          {b.retailers.length ? "Read More & Get Your Copy" : "Read More"}
                          <ArrowRight className="h-[0.9em] w-[1em] transition-transform group-hover:translate-x-1" />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand px-5 py-16 lg:px-8">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-[640px] font-display text-[28px] font-extrabold uppercase leading-[1.05] tracking-[-0.5px] text-gold md:text-[36px]">
            Join {author.name} as an {site.name} author
          </h2>
          <Link href="/submit-your-manuscript/" className="btn btn-gold btn-lg shrink-0">
            Submit Your Manuscript <ArrowRight />
          </Link>
        </div>
      </section>

      <JsonLd
        data={graph(
          { "@type": "ProfilePage", mainEntity: personSchema(author, books), url: `${site.url}${author.url}`, ...(author.updatedAt ? { dateModified: author.updatedAt } : {}) },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Authors", path: "/authors/" },
            { name: author.name, path: author.url },
          ]),
        )}
      />
    </>
  );
}
