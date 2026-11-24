import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageBanner } from "@/components/PageBanner";
import { PostCard } from "@/components/PostCard";
import { PostCover } from "@/components/PostCover";
import { ArrowRight } from "@/components/icons";
import { getCatalog, publishedPosts, showDrafts } from "@/lib/content";
import { breadcrumbSchema, graph, ids } from "@/lib/schema";
import { site } from "@/lib/site";
import { SampleButton } from "@/components/SampleCta";

export const metadata: Metadata = pageMetadata({
  title: "Publishing Blog: Advice for Authors & Readers",
  description: "Practical advice for authors on publishing, royalties, backlist rights, submissions, and book marketing, plus reading guides for mystery and romance readers.",
  path: "/blog/",
});

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export default async function BlogIndex() {
  const posts = publishedPosts(await getCatalog(), showDrafts);
  const [featured, ...rest] = posts;
  return (
    <>
      <PageBanner
        intro="Straight answers for authors on publishing, royalties, rights, and marketing, plus reading guides for the mysteries and romances we publish."
        actions={
          <div className="flex flex-wrap gap-3">
            <Link href="/submit-your-manuscript/" className="btn btn-gold !px-5 !py-3 !text-[15px]">
              Submit Your Manuscript
            </Link>
            <SampleButton tone="dark" size="sm" />
          </div>
        }
      >
        The ePublishingWorks Blog
      </PageBanner>

      {featured ? (
        <section aria-label="Latest article" className="px-5 pt-14 lg:px-8 lg:pt-20">
          <Link href={`/blog/${featured.slug}/`} className="group mx-auto grid max-w-[1320px] items-center gap-8 no-underline lg:grid-cols-[1.2fr_1fr] lg:gap-14">
            <PostCover post={featured} large priority decorative sizes="(min-width: 1320px) 700px, (min-width: 1024px) 54vw, 100vw" />
            <div>
              <p className="text-[15px] text-body">
                {featured.date ? <time dateTime={featured.date}>{fmt(featured.date)}</time> : null}
                <span aria-hidden="true"> &nbsp;/&nbsp; </span>
                {featured.readingMinutes} min read
              </p>
              <h2 className="mt-3 text-balance font-display text-[32px] font-extrabold leading-[1.06] tracking-[-0.025em] text-navy transition-colors group-hover:text-blue md:text-[44px]">
                {featured.title}
              </h2>
              <p className="type-lead mt-4 text-body">{featured.description}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-[16px] font-bold text-navy">
                Read the Article <ArrowRight className="h-[0.9em] w-[1em] transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </section>
      ) : null}

      <section aria-labelledby="more-heading" className="px-5 pb-20 pt-20 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-[1320px]">
          {rest.length ? (
            <>
              <h2 id="more-heading" className="type-section !text-[28px] md:!text-[34px]">
                More articles
              </h2>
              <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <li key={p.slug}>
                    <PostCard post={p} />
                  </li>
                ))}
              </ul>
            </>
          ) : featured ? null : (
            <p id="more-heading" className="text-[18px]">
              Our first articles are on the way. In the meantime, read our <Link href="/frequently-asked-questions/">FAQ</Link> or <Link href="/contact/">contact us</Link>.
            </p>
          )}
        </div>
      </section>

      <JsonLd
        data={graph(
          {
            "@type": "CollectionPage",
            name: "The ePublishingWorks Blog",
            description: "Practical advice for authors on publishing, royalties, rights, and marketing, plus reading guides for readers.",
            url: `${site.url}/blog/`,
            publisher: { "@id": ids.org },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: posts.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/blog/${p.slug}/`, name: p.title })),
            },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog/" },
          ]),
        )}
      />
    </>
  );
}
