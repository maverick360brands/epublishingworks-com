import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ArrowRight } from "@/components/icons";

// Where the manuscript form sends authors after a successful submission. A confirmation page,
// so it stays out of search results and the sitemap (it was indexable on WordPress).
export const metadata: Metadata = pageMetadata({
  title: "Thank You for Your Submission",
  description: "Thank you for your submission to ePublishingWorks! Our team will review your information and reach out within 48 hours.",
  noindex: true,
  path: "/thank-you/",
});

const next = [
  { href: "/the-advantage/", t: "The ePublishingWorks advantage", d: "80% to 85% royalties, and what we take off your plate." },
  { href: "/books/", t: "Browse our books", d: "See the covers and sales copy we create for our authors." },
  { href: "/blog/", t: "Read the blog", d: "Royalties, backlists, book descriptions, and more." },
];

export default function ThankYouPage() {
  return (
    <>
      {/* Sending a manuscript is a big step for an author, so the page marks it: the check draws
          itself once and the manuscript (the blog's cut-paper illustration) settles into view. */}
      <section className="bg-brand overflow-hidden px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-[1fr_440px] lg:gap-16">
          <div className="text-center lg:text-left">
            <span className="sent-badge mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold lg:mx-0">
              <svg aria-hidden="true" viewBox="0 0 30 30" className="h-9 w-9">
                <path d="M8.5 15.5l4.2 4.2 8.8-9.2" pathLength={1} className="sent-check" fill="none" stroke="var(--color-navy)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h1 className="type-display mt-6 text-[44px] text-white md:text-[60px]">Success!</h1>
            <p className="mt-5 font-display text-[22px] font-bold text-white md:text-[26px]">Thank you for your submission to ePublishingWorks!</p>
            <p className="type-lead mx-auto mt-4 max-w-[560px] text-white/85 lg:mx-0">Our team will review your information and reach out within 48 hours.</p>
          </div>
          <div className="sent-art mx-auto w-full max-w-[440px] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(5,15,35,0.7)]">
            <Image
              src="/images/blog/how-to-submit-a-manuscript-to-a-publisher.webp"
              alt=""
              width={2048}
              height={1152}
              sizes="(min-width: 1024px) 440px, 90vw"
              priority
              className="aspect-[4/3] h-auto w-full object-cover"
              style={{ objectPosition: "74% 50%" }}
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="type-card">While you wait</h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {next.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="group block h-full rounded-[24px] bg-mist p-7 no-underline transition-transform hover:-translate-y-1">
                  <span className="flex items-center justify-between gap-3 font-display text-[19px] font-bold text-navy">
                    {l.t}
                    <ArrowRight className="h-[0.9em] w-[1em] shrink-0 text-blue transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="mt-2 block text-[15px] text-body">{l.d}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
