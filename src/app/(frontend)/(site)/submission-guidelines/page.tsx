import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { FaqSection, TestimonialsPair, ThreeSteps } from "@/components/Sections";
import { JsonLd } from "@/components/JsonLd";
import { PageBanner } from "@/components/PageBanner";
import { ArrowRight } from "@/components/icons";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { site, wantedGenres } from "@/lib/site";
import { SampleButton, SampleNote } from "@/components/SampleCta";

export const metadata: Metadata = pageMetadata({
  title: { absolute: site.seo.guidelines.title },
  description: site.seo.guidelines.description,
  path: "/submission-guidelines/",
});

// Copy is the WordPress page's, verbatim. Its second H1 ("Getting Started Is Simple") is an H2 here.
export default function SubmissionGuidelinesPage() {
  return (
    <>
      <PageBanner kicker="Submissions">Our Submission Guidelines</PageBanner>

      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <h2 className="type-section">Partnering with authors for success</h2>
            <div className="type-lead mt-6 max-w-[660px] space-y-4">
              <p>
                At ePublishingWorks!, we believe in empowering authors to achieve their goals without sacrificing their passion for storytelling. Whether you&rsquo;re
                breathing new life into your backlist or looking for the right partner for your latest manuscript, we&rsquo;re here to help you focus on what matters
                most: your writing.
              </p>
              <p className="rounded-[20px] bg-sun-pale px-6 py-5 font-bold text-navy">
                We&rsquo;re actively seeking <em>backlist</em> (previously published) and <em>frontlist</em> (not yet published) titles right now!
              </p>
              <p>
                Career-minded authors who have a minimum of three completed books (backlist and/or frontlist) in the same genre or sub-genre are best. If this sounds like
                you, we&rsquo;d love to hear from you.
              </p>
              <p>It&rsquo;s okay if some of your backlist titles are still in print as physical copies&mdash;our expertise can help you bring them into the digital age.</p>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[520px]">
            <span aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-4 rounded-[32px] bg-gold" />
            <Image
              src="/images/site/author-woman-smiling-laptop.jpg"
              alt="An author smiling at her laptop with a cup of coffee"
              width={1066}
              height={1600}
              sizes="(min-width: 1024px) 520px, 90vw"
              className="relative aspect-[4/5] w-full rounded-[32px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* What we're looking for. */}
      <section className="bg-mist px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1320px]">
          <p className="type-kicker">What&rsquo;s in our wheelhouse?</p>
          <h2 className="type-section mt-3">Here&rsquo;s the type of stuff we really want&hellip;</h2>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {wantedGenres.map((g) => (
              <li key={g.name} className="rounded-[24px] bg-white p-7 shadow-[0_1px_2px_rgba(12,47,90,0.06)]">
                <h3 className="font-display text-[21px] font-bold tracking-[-0.01em] text-navy">{g.name}</h3>
                <p className="mt-2 text-[16px] leading-[1.6]">{g.text}</p>
              </li>
            ))}
            <li className="flex flex-col items-center justify-center gap-4 rounded-[24px] bg-navy-deep p-7 text-center">
              <Link href="/submit-your-manuscript/" className="btn btn-gold btn-lg text-center">
                Submit Your Manuscript to Get Started
              </Link>
              <SampleNote tone="dark" className="!text-[14px]" />
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-brand px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[860px] text-center">
          <h2 className="font-display text-[32px] font-extrabold leading-[1.08] tracking-[-0.03em] text-white md:text-[44px]">Getting started is simple</h2>
          <p className="mx-auto mt-5 max-w-[680px] text-[18px] leading-[1.6] text-white/85">
            If you meet the above criteria and are ready to take the next step in your publishing journey, click the button below. Once we receive your submission, our team
            will carefully review it and respond with clear &ldquo;<strong className="italic text-white">Next Steps</strong>&rdquo; within 2 to 4 business days.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/submit-your-manuscript/" className="btn btn-gold btn-lg">
              Start Your Publishing Journey <ArrowRight />
            </Link>
            <SampleButton tone="dark" />
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <h2 className="type-section">Why choose ePublishingWorks?</h2>
            <p className="type-lead mt-6 max-w-[600px]">
              Unlike traditional publishing houses, we put authors first. With higher royalties, robust promotional support, and a deep commitment to your success, we aim to
              be the publishing partner you can rely on.
            </p>
            <p className="type-lead mt-4 max-w-[600px] font-bold text-navy">Your stories deserve a wider audience. Let&rsquo;s make that happen&mdash;together.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/submit-your-manuscript/" className="btn btn-blue btn-lg">
                Submit Your Manuscript to Start <ArrowRight />
              </Link>
              <SampleButton />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/images/site/author-man-laptop-sofa.jpg"
              alt="An author working on his laptop on the sofa"
              width={1600}
              height={1066}
              sizes="(min-width: 1024px) 300px, 45vw"
              className="aspect-[3/4] w-full rounded-[28px] object-cover"
            />
            <Image
              src="/images/site/author-living-life.jpg"
              alt="A smiling author outdoors"
              width={1600}
              height={1066}
              sizes="(min-width: 1024px) 300px, 45vw"
              className="mt-10 aspect-[3/4] w-full rounded-[28px] object-cover"
            />
          </div>
        </div>
      </section>

      <FaqSection withSchema={false} />
      <ThreeSteps />
      <TestimonialsPair />

      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Submission Guidelines", path: "/submission-guidelines/" },
          ]),
        )}
      />
    </>
  );
}
