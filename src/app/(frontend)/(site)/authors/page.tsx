import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageBanner } from "@/components/PageBanner";
import { StarsHeading, Testimonial } from "@/components/Testimonial";
import { ArrowRight } from "@/components/icons";
import { AUTHOR_GROUPS, authorGroups, booksByAuthor, directoryAuthors, getCatalog, visibleBooks } from "@/lib/content";
import { toAuthorCard } from "@/components/AuthorCard";
import { AuthorsBrowser, type DirectoryAuthor } from "@/components/AuthorsBrowser";
import { breadcrumbSchema, graph, ids } from "@/lib/schema";
import { authorsPageIntro, homeTestimonials, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: { absolute: site.seo.authors.title },
  description: site.seo.authors.description,
  path: "/authors/",
});

/** "Alice Duncan" → "Duncan"; used for the A–Z index. */
const lastName = (name: string) => name.trim().split(/\s+/).at(-1) ?? name;

export default async function AuthorsPage() {
  const c = await getCatalog();
  const authors = directoryAuthors(c);
  const az = [...authors].sort((a, b) => lastName(a.name).localeCompare(lastName(b.name)) || a.name.localeCompare(b.name));
  const letters = [...new Set(az.map((a) => lastName(a.name)[0]?.toUpperCase() ?? "#"))];
  const cards: DirectoryAuthor[] = authors.map((a) => {
    const books = booksByAuthor(c, a.slug);
    return { ...toAuthorCard(a, books), groups: authorGroups(books) };
  });
  const groups = Object.keys(AUTHOR_GROUPS).filter((g) => cards.some((a) => a.groups.includes(g)));
  return (
    <>
      <PageBanner intro={authorsPageIntro}>Our Authors</PageBanner>

      {/* A–Z index of every author, by last name. */}
      <section aria-labelledby="az-heading" className="border-b border-line px-5 py-10 lg:px-8">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="az-heading" className="type-card">
              Find an author
            </h2>
            <p className="text-[15px] text-body">
              {authors.length} authors · {visibleBooks(c).length} books
            </p>
          </div>
          <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {letters.map((l) => (
              <div key={l} className="flex gap-3">
                <dt className="w-6 shrink-0 font-display text-[18px] font-extrabold text-gold-ink">{l}</dt>
                <dd className="flex flex-wrap gap-x-3 gap-y-1 text-[15px] leading-[1.5]">
                  {az
                    .filter((a) => (lastName(a.name)[0]?.toUpperCase() ?? "#") === l)
                    .map((a) => (
                      <Link key={a.slug} href={a.url} className="font-semibold text-navy no-underline hover:text-blue hover:underline">
                        {a.name}
                      </Link>
                    ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="px-5 pb-20 pt-12 md:pt-14 lg:px-8">
        <div className="mx-auto max-w-[1320px]">
          <AuthorsBrowser authors={cards} groups={groups} />
        </div>
      </section>

      {homeTestimonials.length ? (
        <section className="bg-mist px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <StarsHeading text="Here's what our authors have been saying" />
            <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-8">
              {homeTestimonials.slice(0, 2).map((t) => (
                <Testimonial key={t.id} t={t} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-brand px-5 py-16 lg:px-8">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-[30px] font-extrabold uppercase leading-[1.05] tracking-[-0.5px] text-gold md:text-[40px]">Become one of our authors</h2>
            <p className="mt-3 max-w-[560px] text-[18px] text-white/80">New manuscripts and reverted backlist titles are welcome. Our authors earn 80% to 85% royalties.</p>
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
            name: `Authors published by ${site.name}`,
            url: `${site.url}/authors/`,
            publisher: { "@id": ids.org },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: authors.length,
              itemListElement: authors.map((a, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}${a.url}`, name: a.name })),
            },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Authors", path: "/authors/" },
          ]),
        )}
      />
    </>
  );
}
