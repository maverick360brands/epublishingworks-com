import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BookTile } from "@/components/BookTile";
import { HeroBookWall, type WallBook } from "@/components/HeroBookWall";
import { ClosingCta, FaqSection, ThreeSteps } from "@/components/Sections";
import { PostCard } from "@/components/PostCard";
import { StarsHeading, Testimonial } from "@/components/Testimonial";
import { ArrowRight, CheckCircle, Coins, Diamond, Globe, Hourglass, Megaphone, Palette, TrendUp } from "@/components/icons";
import { bookAuthorLabel, getCatalog, heroBooks, publishedPosts, showDrafts } from "@/lib/content";
import { wallColumns } from "@/lib/hero";
import { homeTestimonials, site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: site.homeTitle },
  description: site.description,
  alternates: { canonical: "/" },
};

// Copy is the WordPress home page's, section for section; the featured-books row and the
// latest articles are new.

const pillars = ["Focus on Writing", "Bigger Royalties", "Enhance Visibility", "Sell More Books"];

const reasons: { title: string; text: string; icon: ReactNode }[] = [
  { title: "High Royalty Payouts", text: "We offer some of the industry's most competitive royalty payouts for our authors. Why? Because when you win, we win.", icon: <Coins className="h-7 w-7" /> },
  { title: "Expert Sales Copy and Covers", text: "We craft compelling sales copy and test cover designs with focus groups to ensure your book grabs attention.", icon: <Palette className="h-7 w-7" /> },
  { title: "Preorders That Work for You", text: "Our one-year assetless preorder system lets your book start earning before it's even finished.", icon: <Hourglass className="h-7 w-7" /> },
  {
    title: "Worldwide Reach Without Limitations",
    text: "Your books are distributed globally through well-negotiated eRetailer partnerships. We even place your books in Kindle Unlimited without locking you into Amazon exclusivity or restrictive terms.",
    icon: <Globe className="h-7 w-7" />,
  },
  {
    title: "Marketing That Drives Results",
    text: "From gathering reviews to building strategic promotion campaigns, including securing coveted BookBub features, our team actively boosts your book's visibility and sales.",
    icon: <Megaphone className="h-7 w-7" />,
  },
  {
    title: "Adapting to the Future",
    text: "The publishing world moves fast, and we stay ahead of the curve. Whether it's changes in algorithms or new promotional opportunities, we position your books for success now and in the future.",
    icon: <TrendUp className="h-7 w-7" />,
  },
];

export default async function HomePage() {
  const c = await getCatalog();
  // The hero wall: books marked "Feature in home hero" in the admin, topped up with recent books.
  const wall = heroBooks(c);
  const covers: WallBook[] = wall.map((b) => ({ src: b.cover, alt: b.title, width: b.coverWidth, height: b.coverHeight, href: b.url }));
  const columns = wallColumns(covers);
  const featured = wall.slice(0, 10);
  const posts = publishedPosts(c, showDrafts).slice(0, 3);

  return (
    <>
      {/* Hero: the headline, with a tilted, parallax wall of our authors' covers. */}
      <section className="bg-brand relative isolate overflow-hidden">
        <HeroBookWall columns={columns} className="absolute -right-[20%] -top-[30%] hidden h-[170%] w-[64%] lg:block" />
        <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-[62%] bg-gradient-to-r from-navy-deep via-navy-deep/85 to-transparent lg:block" />
        <div className="relative mx-auto max-w-[1320px] px-5 pb-10 pt-14 sm:pt-20 lg:px-8 lg:pb-[120px] lg:pt-[110px]">
          <div className="max-w-[580px] xl:max-w-[620px]">
            <h1 className="font-display text-[48px] font-extrabold leading-[0.98] tracking-[-0.04em] text-white sm:text-[64px] lg:text-[80px]">
              Write, Publish, <span className="text-gold">Prosper</span>
            </h1>
            <p className="mt-5 font-display text-[20px] font-semibold leading-[1.35] text-white md:text-[23px]">
              Your path to publishing just got easier&nbsp;&mdash; <span className="text-[#ffeec4]">ePublishing<em>Works!</em></span>
            </p>
            <p className="mt-6 max-w-[540px] text-[18px] leading-[1.6] text-white/85 md:text-[19px]">
              At {site.name}, we handle the business of publishing (distribution, promotion, cover design, and marketing) so you can stay focused on your next
              book. <strong className="font-semibold text-white">Our authors earn 80% to 85% royalties.</strong>
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/submit-your-manuscript/" className="btn btn-gold btn-lg">
                Submit Your Manuscript to Start <ArrowRight />
              </Link>
              <Link href="/books/" className="btn btn-ghost-light btn-lg">
                Browse Our Books
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-2 text-[15px] text-white/75">
              {["80% to 85% royalties", "Backlist titles welcome", "Kindle Unlimited without exclusivity"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle className="h-[18px] w-[18px]" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* On phones and tablets the wall sits below the copy. */}
        <div className="relative h-[320px] overflow-hidden sm:h-[420px] lg:hidden">
          <HeroBookWall columns={columns.slice(0, 4).map((col) => col.slice(0, 4))} className="absolute -left-[10%] -top-[25%] h-[170%] w-[120%]" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-navy-deep/90 to-transparent" />
        </div>
      </section>

      {/* Benefits band. */}
      <section className="bg-gold px-5 py-[18px]">
        <ul className="mx-auto grid max-w-[1180px] grid-cols-2 gap-x-4 gap-y-2 text-center font-display text-[12px] font-bold uppercase tracking-[2px] text-navy sm:text-[13px] md:flex md:items-center md:justify-center md:gap-x-6 md:text-[16px] md:tracking-[3.5px]">
          {pillars.map((p, i) => (
            <li key={p} className="flex items-center justify-center gap-6">
              {i ? <Diamond className="hidden h-2.5 w-2.5 shrink-0 md:block" /> : null}
              {p}
            </li>
          ))}
        </ul>
      </section>

      {/* Author-first approach. */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div className="relative mx-auto w-full max-w-[560px]">
            <span aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-4 rounded-[32px] bg-gold" />
            <Image
              src={site.images.authorAtWork.src}
              alt={site.images.authorAtWork.alt}
              width={site.images.authorAtWork.width}
              height={site.images.authorAtWork.height}
              sizes="(min-width: 1024px) 560px, 90vw"
              className="relative aspect-[4/3] w-full rounded-[32px] object-cover"
            />
          </div>
          <div>
            <p className="type-kicker">The author-first publisher</p>
            <h2 className="type-section mt-3">Break free from publishing barriers with our author-first approach</h2>
            <p className="type-lead mt-6 max-w-[620px]">
              Navigating publishing is daunting when low royalties and constant promotional demands pull you away from writing. At {site.name}, we handle the
              business of publishing (distribution, promotion, cover design, and marketing) so you can stay focused on your next book. That&rsquo;s where your career
              grows.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/the-advantage/" className="btn btn-blue btn-lg">
                Our Signature Advantage <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us. */}
      <section className="bg-mist px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1320px]">
          <h2 className="type-section max-w-[760px]">Why choose {site.name}?</h2>
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r) => (
              <li key={r.title} className="group flex flex-col rounded-[28px] bg-white p-8 shadow-[0_1px_2px_rgba(13,31,60,0.06)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(13,31,60,0.45)]">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold text-navy transition-transform duration-300 group-hover:-rotate-6">{r.icon}</span>
                <h3 className="mt-6 font-display text-[22px] font-bold leading-[1.2] tracking-[-0.01em] text-navy">{r.title}</h3>
                <p className="mt-3 text-[16px] leading-[1.6]">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured books (new on this site). */}
      {featured.length ? (
        <section className="px-5 py-20 lg:px-8 lg:py-28" aria-labelledby="featured-books">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="type-kicker">From our authors</p>
                <h2 id="featured-books" className="type-section mt-3">
                  Featured books
                </h2>
              </div>
              <Link href="/books/" className="inline-flex items-center gap-2 text-[16px] font-bold text-navy no-underline hover:text-blue">
                All {c.books.filter((b) => !b.hidden).length} books <ArrowRight className="h-[0.9em] w-[1em]" />
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
              {featured.map((b) => (
                <li key={b.slug}>
                  <BookTile
                    book={{
                      slug: b.slug,
                      title: b.title,
                      author: bookAuthorLabel(c, b),
                      series: b.series ? (b.seriesNumber !== null ? `${b.series}, book ${b.seriesNumber}` : b.series) : "",
                      cover: b.cover,
                      coverWidth: b.coverWidth,
                      coverHeight: b.coverHeight,
                      href: b.url,
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Testimonials. */}
      {homeTestimonials.length ? (
        <section className="bg-mist px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-[1180px]">
            <StarsHeading text="Here's what our authors have been saying" />
            <div className="mx-auto mt-12 grid gap-12 md:grid-cols-2 md:gap-8">
              {homeTestimonials.map((t) => (
                <Testimonial key={t.id} t={t} />
              ))}
            </div>
            <p className="mt-12 flex flex-wrap justify-center gap-3">
              <Link href="/submit-your-manuscript/" className="btn btn-gold btn-lg">
                Join ePublishingWorks! <ArrowRight />
              </Link>
              <Link href="/reviews/" className="btn btn-blue btn-lg">
                Read More Author Reviews
              </Link>
            </p>
          </div>
        </section>
      ) : null}

      <ThreeSteps />

      {/* Signature advantage. */}
      <section className="bg-brand px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-20">
          <p className="font-display text-[88px] font-extrabold leading-none tracking-[-0.04em] text-gold sm:text-[120px] lg:text-[150px]">
            80<span className="text-white/90">–</span>85<span className="text-[0.5em] align-top">%</span>
          </p>
          <div>
            <p className="type-kicker !text-gold">Our Signature Advantage</p>
            <h2 className="mt-3 font-display text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] text-white md:text-[40px]">
              Authors deserve more: more time, more support, and more earnings
            </h2>
            <p className="mt-5 max-w-[640px] text-[18px] leading-[1.6] text-white/80">
              We offer an industry-leading royalty payout of 80% to 85%, putting more money in your pocket than other publishers.
            </p>
            <Link href="/the-advantage/" className="btn btn-gold btn-lg mt-8">
              Learn About the Advantage <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <FaqSection withSchema={false} />

      {/* Latest articles (new on this site). */}
      {posts.length ? (
        <section className="bg-mist px-5 py-20 lg:px-8 lg:py-28" aria-labelledby="latest-articles">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="latest-articles" className="type-section">
                From the blog
              </h2>
              <Link href="/blog/" className="inline-flex items-center gap-2 text-[16px] font-bold text-navy no-underline hover:text-blue">
                All articles <ArrowRight className="h-[0.9em] w-[1em]" />
              </Link>
            </div>
            <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <ClosingCta />
    </>
  );
}
