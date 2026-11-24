import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ArrowRight, CheckCircle } from "@/components/icons";

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
      <section className="bg-brand px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[860px] text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold">
            <CheckCircle className="h-9 w-9 [&_circle]:fill-navy [&_path]:stroke-white" />
          </span>
          <h1 className="type-display mt-6 text-[44px] text-white md:text-[60px]">Success!</h1>
          <p className="mt-5 font-display text-[22px] font-bold text-white md:text-[26px]">Thank you for your submission to ePublishingWorks!</p>
          <p className="type-lead mx-auto mt-4 max-w-[560px] text-white/85">Our team will review your information and reach out within 48 hours.</p>
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
