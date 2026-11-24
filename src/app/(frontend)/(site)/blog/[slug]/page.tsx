import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArticleToc } from "@/components/ArticleToc";
import { CopyLink } from "@/components/CopyLink";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ArrowRight, Plus } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { PostCard } from "@/components/PostCard";
import { PostCover } from "@/components/PostCover";
import { InlineCta } from "@/components/InlineCta";
import { ReadingProgress } from "@/components/ReadingProgress";
import { getCatalog, postModified, publishedPosts, showDrafts } from "@/lib/content";
import { LostContent } from "../../../not-found";
import { lostMetadata, resolvePage } from "@/lib/resolve";
import { metaFor, pageMetadata } from "@/lib/seo";
import { inlineCtaFor, splitAfterSection } from "@/lib/inline-cta";
import { articleSchema, breadcrumbSchema, faqSchema, graph } from "@/lib/schema";
import { site, testimonials } from "@/lib/site";

export async function generateStaticParams() {
  const posts = publishedPosts(await getCatalog(), showDrafts);
  // Cache Components needs at least one param to prerender the route shape.
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "_placeholder" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { item: post } = await resolvePage(`/blog/${slug}/`, "post");
  if (!post) return lostMetadata;
  const meta = metaFor({ title: post.title, summary: post.description, seo: post.seo }, post.image);
  return {
    ...pageMetadata({
      title: meta.title,
      description: meta.description,
      path: `/blog/${post.slug}/`,
      type: "article",
      // Posts without their own image share the site image.
      ...(meta.image ? { images: [meta.image] } : {}),
      openGraph: { publishedTime: post.date ?? undefined, modifiedTime: postModified(post) ?? undefined },
    }),
    robots: post.status === "draft" ? { index: false, follow: false } : undefined,
  };
}

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

// One real author testimonial per post (quotes are verbatim), rotated by post so neighbouring
// posts don't repeat the same voice.
const voiceFor = (slug: string) => {
  if (!testimonials.length) return undefined;
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return testimonials[h % testimonials.length];
};

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const { item: post } = await resolvePage(`/blog/${slug}/`, "post");
  if (!post) return <LostContent />;

  const catalog = await getCatalog();
  const others = publishedPosts(catalog, showDrafts).filter((p) => p.slug !== post.slug);
  const related = [...others.filter((p) => p.category === post.category), ...others.filter((p) => p.category !== post.category)].slice(0, 3);
  const showToc = post.toc.length > 2;
  const cta = inlineCtaFor(post);
  const [bodyBefore, bodyAfter] = splitAfterSection(post.html, cta.after);
  const voice = voiceFor(post.slug);
  const voiceAuthor = voice?.authorSlug ? catalog.authors.find((a) => a.slug === voice.authorSlug && !a.hidden) : undefined;

  return (
    <>
      <ReadingProgress targetId="article" />

      <section aria-labelledby="post-title" className="bg-brand relative px-5 pt-12 text-white lg:px-8 lg:pt-16">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <div className="pb-2 lg:pb-20">
            <nav aria-label="Breadcrumb" className="text-[15px] font-semibold">
              <Link href="/blog/" className="text-white/75 no-underline hover:text-gold">
                Blog
              </Link>
              <span aria-hidden="true" className="mx-2 text-white/40">
                /
              </span>
              <span className="text-gold">{post.category}</span>
            </nav>
            <h1 id="post-title" className="mt-5 text-balance font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-white md:text-[52px] xl:text-[58px]">
              {post.title}
            </h1>
            <p className="mt-6 max-w-[640px] text-[19px] leading-[1.55] text-white/85 md:text-[20px]">{post.description}</p>
            <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-white/75">
              <span className="font-semibold text-white">{post.authorName}</span>
              {post.date ? (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <time dateTime={post.date}>{fmt(post.date)}</time>
                </>
              ) : null}
              {post.updated && post.updated !== post.date ? (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <span>
                    Updated <time dateTime={post.updated}>{fmt(post.updated)}</time>
                  </span>
                </>
              ) : null}
              <span aria-hidden="true">&middot;</span>
              <span>{post.readingMinutes} min read</span>
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-white/15 pt-7">
              <Link href={post.category === "For Readers" ? "/books/" : "/submit-your-manuscript/"} className="btn btn-gold !px-5 !py-3 !text-[15px]">
                {post.category === "For Readers" ? "Browse the Books" : "Submit Your Manuscript"}
              </Link>
              <Link href="/contact/" className="text-[15px] font-semibold text-white no-underline hover:text-gold">
                Questions? Talk to a publisher
              </Link>
            </div>
          </div>
          {/* The cover sits on the band and drops past its edge into the page below. */}
          <div className="relative -mb-24 lg:-mb-32 lg:self-end">
            <PostCover post={post} large priority chip={false} sizes="(min-width: 1280px) 560px, (min-width: 1024px) 45vw, 100vw" className="shadow-[0_30px_60px_-30px_rgba(5,15,35,0.65)] lg:aspect-[1/1.02] xl:aspect-square" />
          </div>
        </div>
      </section>

      <div className="px-5 pb-14 pt-36 lg:px-8 lg:pb-20 lg:pt-44">
        <div className={`mx-auto grid max-w-[1180px] gap-14 ${showToc ? "lg:grid-cols-[minmax(0,720px)_1fr] lg:gap-20" : ""}`}>
          <article id="article" className={`min-w-0 ${showToc ? "" : "mx-auto w-full max-w-[720px]"}`}>
            {post.summary ? (
              <aside aria-label="In short" className="mb-12 rounded-[24px] bg-sun-pale px-7 py-6 md:px-9 md:py-8">
                <p className="text-[19px] leading-[1.6] text-navy md:text-[20px]">
                  <strong className="font-display font-extrabold text-gold-ink">In short: </strong>
                  {post.summary}
                </p>
              </aside>
            ) : null}

            {showToc ? (
              <details className="group/toc mb-10 rounded-[20px] border border-line p-5 lg:hidden">
                <summary className="cursor-pointer list-none font-display text-[16px] font-bold text-navy [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between">
                    In this article
                    <span aria-hidden="true" className="text-blue transition-transform duration-300 group-open/toc:rotate-45">
                      <Plus />
                    </span>
                  </span>
                </summary>
                <ol className="mt-4 space-y-2 text-[16px]">
                  {post.toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-body no-underline hover:text-blue">
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            ) : null}

            <div className="article-body" dangerouslySetInnerHTML={{ __html: bodyBefore }} />
            {bodyAfter ? (
              <>
                <InlineCta cta={cta} />
                <div className="article-body article-body-cont" dangerouslySetInnerHTML={{ __html: bodyAfter }} />
              </>
            ) : null}

            {post.faqs.length ? (
              <section className="mt-16" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="mb-6 font-display text-[28px] font-extrabold tracking-[-0.025em] text-navy md:text-[34px]">
                  Frequently asked questions
                </h2>
                <FaqAccordion items={post.faqs} />
              </section>
            ) : null}

            {voice ? (
              <figure className="mt-16 rounded-[28px] bg-mist p-7 md:p-10">
                <svg aria-hidden="true" viewBox="0 0 48 36" className="h-8 w-10 text-gold">
                  <path
                    fill="currentColor"
                    d="M0 36V22C0 9.6 6.6 2.3 18.4 0l2.2 5.2C13.9 7.4 10.6 11.6 10.4 17H20v19H0zm27.6 0V22c0-12.4 6.6-19.7 18.4-22L48 5.2C41.5 7.4 38.2 11.6 38 17h9.6v19h-20z"
                  />
                </svg>
                <blockquote className="mt-5 font-alice text-[20px] leading-[1.55] text-navy md:text-[22px]">
                  {voice.quote.split(/\n\n+/).map((p, i) => (
                    <p key={i} className={i ? "mt-4" : ""}>
                      {p}
                    </p>
                  ))}
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-4">
                  {voice.photo ? <Image src={voice.photo} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" /> : null}
                  <span>
                    <span className="block font-display text-[16px] font-bold text-navy">{voice.name}</span>
                    {voiceAuthor ? (
                      <Link href={voiceAuthor.url} className="text-[15px] font-semibold text-blue underline decoration-blue/30 decoration-2 underline-offset-4 hover:decoration-gold">
                        {site.name} author
                      </Link>
                    ) : (
                      <span className="text-[15px] text-body">{site.name} author</span>
                    )}
                  </span>
                </figcaption>
              </figure>
            ) : null}

            <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
              <p className="text-[15px] text-body">Found this helpful? Share it with an author friend.</p>
              <CopyLink />
            </div>

            <aside className="mt-12 flex flex-col gap-6 rounded-[24px] bg-mist p-7 sm:flex-row sm:items-center md:p-8">
              <Image src={site.logoMark.src} alt="" width={site.logoMark.width} height={site.logoMark.height} className="h-16 w-16 shrink-0 object-contain" />
              <div>
                <p className="font-display text-[19px] font-bold text-navy">About {site.name}</p>
                <p className="mt-2 text-[16px] leading-[1.6] text-body">
                  {site.about}{" "}
                  <Link href="/about/" className="font-semibold underline decoration-gold decoration-2 underline-offset-4">
                    Learn more about us
                  </Link>
                  .
                </p>
              </div>
            </aside>
          </article>

          {showToc ? (
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-8">
                <ArticleToc items={post.toc} />
                <div className="bg-brand rounded-[24px] p-6 text-white">
                  <p className="font-display text-[20px] font-bold leading-[1.2]">Ready for a publisher?</p>
                  <p className="mt-2 text-[15px] leading-[1.55] text-white/80">Send us your manuscript or backlist for review. Our authors earn 80% to 85% royalties.</p>
                  <Link href="/submit-your-manuscript/" className="btn btn-gold mt-5 !px-5 !py-3 !text-[15px]">
                    Submit Your Manuscript
                  </Link>
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </div>

      {related.length ? (
        <section className="bg-mist px-5 py-16 lg:px-8 lg:py-24" aria-labelledby="related-heading">
          <div className="mx-auto max-w-[1180px]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="related-heading" className="type-section !text-[28px] md:!text-[34px]">
                Keep reading
              </h2>
              <Link href="/blog/" className="inline-flex items-center gap-2 text-[16px] font-bold text-navy no-underline hover:text-blue">
                All Articles <ArrowRight className="h-[0.9em] w-[1em]" />
              </Link>
            </div>
            <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="next-step-heading" className="bg-brand relative overflow-hidden px-5 py-16 text-white lg:px-8 lg:py-24">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[640px]">
            <h2 id="next-step-heading" className="font-display text-[32px] font-extrabold uppercase leading-[1.02] tracking-[-0.02em] md:text-[44px]">
              Write, publish, prosper
            </h2>
            <p className="mt-4 text-[18px] leading-[1.6] text-white/80">
              We handle the business of publishing (covers, sales copy, distribution, and promotion) so you can focus on your next book.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/submit-your-manuscript/" className="btn btn-gold">
              Submit Your Manuscript <ArrowRight className="h-[0.9em] w-[1em]" />
            </Link>
            <Link href="/the-advantage/" className="inline-flex items-center gap-2 text-[16px] font-semibold text-white no-underline hover:text-gold">
              See the ePublishingWorks advantage
            </Link>
          </div>
        </div>
      </section>

      <JsonLd
        data={graph(
          articleSchema(post),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog/" },
            { name: post.title, path: `/blog/${post.slug}/` },
          ]),
          ...(post.faqs.length ? [faqSchema(post.faqs)] : []),
        )}
      />
    </>
  );
}
