import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageBanner } from "@/components/PageBanner";
import { ThreeSteps } from "@/components/Sections";
import { ArrowRight } from "@/components/icons";
import { breadcrumbSchema, graph, ids } from "@/lib/schema";
import { site, testimonial } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: site.seo.about.title },
  description: site.seo.about.description,
  alternates: { canonical: "/about/" },
};

// Copy is the WordPress page's, verbatim; the milestones it mentions in passing are set out as figures.
const milestones = [
  { figure: "2011", label: "Founded by two national bestselling authors and an entrepreneur" },
  { figure: "3×", label: "Tripled in size by 2013" },
  { figure: "1M+", label: "Books sold in 2019 alone" },
  { figure: "3", label: "Titles on the NYT/USA Today bestseller lists in 2019" },
];

export default function AboutPage() {
  const jillian = testimonial("jillian-david");
  return (
    <>
      <PageBanner kicker="About us">About ePublishingWorks!</PageBanner>

      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <h2 className="type-section">Created by authors for authors, because ePublishing Works!</h2>
            <div className="type-lead mt-6 max-w-[640px] space-y-4">
              <p className="font-bold text-navy">ePublishingWorks! was born out of a shared vision: to create a publishing house that puts authors first.</p>
              <p>
                Founded in 2011 by two national bestselling authors and a passionate entrepreneur with a love for books, we set out to change the way indie publishing
                works&mdash;starting with empowering writers to focus on what they do best: writing.
              </p>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[540px]">
            <span aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-4 rounded-[32px] bg-gold" />
            <Image
              src="/images/site/author-writing-book.jpg"
              alt="An author writing in a notebook at a café table"
              width={1600}
              height={932}
              sizes="(min-width: 1024px) 540px, 90vw"
              className="relative aspect-[4/3] w-full rounded-[32px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Milestones. */}
      <section className="bg-brand px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1320px]">
          <h2 className="font-display text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] text-white md:text-[36px]">
            What began as a bold idea quickly grew into a thriving community.
          </h2>
          <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m) => (
              <div key={m.label} className="border-t-2 border-white/15 pt-6">
                <dt className="sr-only">{m.label}</dt>
                <dd>
                  <span className="block font-display text-[56px] font-extrabold leading-none tracking-[-0.04em] text-gold">{m.figure}</span>
                  <span className="mt-3 block text-[16px] leading-[1.5] text-white/85">{m.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="type-lead space-y-4">
            <p className="font-bold text-navy">By 2013, we tripled in size, becoming one of the most trusted and sought-after names in next-generation indie publishing.</p>
            <p className="font-bold text-navy">Since then, we&rsquo;ve achieved milestones that speak to the success of our authors.</p>
            <p>
              In 2019 alone, we sold over 1 million books, landed three titles on the NYT/USA Today Bestsellers lists, and helped numerous authors reach the Top 100 charts on
              platforms like Amazon, Barnes &amp; Noble, iBooks, and Kobo. And we&rsquo;re just getting started.
            </p>
          </div>
          <div>
            <h2 className="type-section !text-[30px] md:!text-[38px]">We do more than publish books. We champion authors.</h2>
            <div className="type-lead mt-6 space-y-4">
              <p>
                <strong className="font-bold text-navy">Our approach is simple yet revolutionary:</strong> we prioritize your success by offering higher royalties, taking
                the weight of promotion off your shoulders, and supporting you every step of the way. Whether it&rsquo;s crafting strategies to increase your sales or
                amplifying your voice to reach new readers, we&rsquo;re here to help you thrive in a competitive industry.
              </p>
              <p>
                If you&rsquo;re a career-driven author looking for more than just a publishing partner&mdash;if you want representation that values your work and your
                vision&mdash;you&rsquo;ve found the right place. At ePublishingWorks!, your stories are our purpose, and your success is our mission.
              </p>
            </div>
            <Link href="/the-advantage/" className="btn btn-blue btn-lg mt-9">
              Our Signature Advantage <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {jillian ? (
        <section className="bg-mist px-5 py-20 lg:px-8 lg:py-24">
          <figure className="mx-auto grid max-w-[1100px] items-center gap-10 md:grid-cols-[220px_1fr]">
            {jillian.photo ? (
              <Image src={jillian.photo} alt={`Photo of ${jillian.name}`} width={220} height={220} className="mx-auto h-[200px] w-[200px] rounded-full object-cover ring-8 ring-white md:h-[220px] md:w-[220px]" />
            ) : null}
            <div>
              <h2 className="type-section !text-[28px] md:!text-[34px]">Let&rsquo;s write the next chapter of your career, together.</h2>
              <blockquote className="mt-6 space-y-3 text-[18px] leading-[1.65] text-navy">
                {jillian.quote.split(/\n\n+/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </blockquote>
              <figcaption className="mt-5 text-[16px]">
                <Link href={`/authors/${jillian.authorSlug}/`} className="font-display font-bold text-navy">
                  {jillian.name}
                </Link>
                {jillian.role ? <span className="text-gold-ink">, {jillian.role}</span> : null}
              </figcaption>
            </div>
          </figure>
        </section>
      ) : null}

      <ThreeSteps kicker="Get started" heading="Three steps to your published book." className="!bg-white" />

      <JsonLd
        data={graph(
          { "@type": "AboutPage", url: `${site.url}/about/`, about: { "@id": ids.org }, mainEntity: { "@id": ids.org } },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about/" },
          ]),
        )}
      />
    </>
  );
}
