import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { AuthorsHero } from "@/components/AuthorsHero";
import { StarsHeading, Testimonial } from "@/components/Testimonial";
import { ArrowRight } from "@/components/icons";
import { AUTHOR_GROUPS, authorGroups, booksByAuthor, directoryAuthors, getCatalog, visibleBooks } from "@/lib/content";
import { toAuthorCard } from "@/components/AuthorCard";
import { AuthorsBrowser, type DirectoryAuthor } from "@/components/AuthorsBrowser";
import { breadcrumbSchema, graph, ids } from "@/lib/schema";
import { authorsPageIntro, homeTestimonials, site } from "@/lib/site";
import { SampleButton } from "@/components/SampleCta";

export const metadata: Metadata = pageMetadata({
  title: { absolute: site.seo.authors.title },
  description: site.seo.authors.description,
  path: "/authors/",
});

/** "Alice Duncan" → ["Duncan"]; "Eileen Dreyer / Kathleen Korbel" → ["Dreyer", "Korbel"]. Used for the A–Z index,
 *  so an author who writes under two names is found under both letters. */
const surnames = (name: string) =>
  name
    .split("/")
    .map((part) => part.trim().split(/\s+/).at(-1) ?? "")
    .filter(Boolean);

export default async function AuthorsPage() {
  const c = await getCatalog();
  const authors = directoryAuthors(c);
  const cards: DirectoryAuthor[] = authors.map((a) => {
    const books = booksByAuthor(c, a.slug);
    return { ...toAuthorCard(a, books), groups: authorGroups(books), surnames: surnames(a.name) };
  });
  const faces = authors.filter((a) => a.photo).map((a) => ({ slug: a.slug, name: a.name, url: a.url, photo: a.photo }));
  const groups = Object.keys(AUTHOR_GROUPS).filter((g) => cards.some((a) => a.groups.includes(g)));
  return (
    <>
      <AuthorsHero title="Our Authors" intro={authorsPageIntro} faces={faces} authorCount={authors.length} bookCount={visibleBooks(c).length} />

      <section aria-labelledby="every-author" className="relative px-5 pb-24 lg:px-8">
        <h2 id="every-author" className="sr-only">
          Find an author
        </h2>
        <div className="relative mx-auto -mt-8 max-w-[1320px] md:-mt-10">
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
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/submit-your-manuscript/" className="btn btn-gold btn-lg">
              Submit Your Manuscript <ArrowRight />
            </Link>
            <SampleButton tone="dark" />
          </div>
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
