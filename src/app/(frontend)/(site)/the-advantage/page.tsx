import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CheckList, ClosingCta, TestimonialsPair } from "@/components/Sections";
import { JsonLd } from "@/components/JsonLd";
import { PageBanner } from "@/components/PageBanner";
import { ArrowRight } from "@/components/icons";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { site } from "@/lib/site";
import { SampleButton } from "@/components/SampleCta";

export const metadata: Metadata = pageMetadata({
  title: { absolute: site.seo.advantage.title },
  description: site.seo.advantage.description,
  path: "/the-advantage/",
});

// Copy is the WordPress page's, verbatim.
const help = [
  { label: "Expert Sales Copy and Covers", text: "We craft compelling sales copy and test cover designs with focus groups to ensure your book grabs attention." },
  {
    label: "Worldwide Reach Without Limitations",
    text: "Your books are distributed globally through well-negotiated eRetailer partnerships. We even place your books in Kindle Unlimited without locking you into Amazon exclusivity or restrictive terms.",
  },
  { label: "Preorders That Work for You", text: "Our one-year assetless preorder system lets your book start earning before it’s even finished." },
  {
    label: "Marketing That Drives Results",
    text: "From gathering reviews to building strategic promotion campaigns, including securing coveted BookBub features, our team actively boosts your book’s visibility and sales.",
  },
  {
    label: "Adapting to the Future",
    text: "The publishing world moves fast, and we stay ahead of the curve. Whether it’s changes in algorithms or new promotional opportunities, we position your books for success now and in the future.",
  },
];

export default function AdvantagePage() {
  return (
    <>
      <PageBanner kicker="The ePublishingWorks advantage">Our Signature Advantage</PageBanner>

      {/* Royalties up front. */}
      <section className="px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[auto_1fr] lg:gap-20">
          <div className="rounded-[32px] bg-navy-deep px-10 py-10 text-center lg:px-14 lg:py-14">
            <p className="font-display text-[88px] font-extrabold leading-none tracking-[-0.05em] text-gold sm:text-[112px]">
              80<span className="text-white/90">–</span>85<span className="align-top text-[0.5em]">%</span>
            </p>
            <p className="mt-3 font-display text-[18px] font-bold text-white">royalty payout to our authors</p>
          </div>
          <div>
            <h2 className="type-section">At ePublishingWorks!, we believe authors deserve more: more time, more support, and more earnings.</h2>
            <div className="type-lead mt-6 max-w-[680px] space-y-4">
              <p>
                That&rsquo;s why we offer an industry-leading <strong className="font-bold text-navy">royalty payout of 80% to 85%</strong>, putting more money in your pocket
                than other publishers.
              </p>
              <p className="font-bold text-navy">Still wondering if ePublishingWorks! is the right fit for you?</p>
              <p>Let&rsquo;s simplify it: we take care of the business of publishing so you can do what you were born to do&mdash;write your next great book.</p>
              <p>
                We want our authors to focus on their next book and leave the rest of it to us. Your <em>next</em> book is your ticket to career growth!
              </p>
              <p>
                Readers today demand a steady stream of fresh content, and with over 5 million ebooks competing for attention, consistent releases (two to three books per
                year) are crucial for staying relevant. But writing at that pace requires time&mdash;and that&rsquo;s where we come in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How we help. */}
      <section className="bg-mist px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="relative mx-auto w-full max-w-[520px]">
            <span aria-hidden="true" className="absolute inset-0 -translate-x-4 translate-y-4 rounded-[32px] bg-sky/60" />
            <Image
              src="/images/site/author-woman-cafe.jpg"
              alt="An author smiling at her laptop in a city café"
              width={1066}
              height={1600}
              sizes="(min-width: 1024px) 520px, 90vw"
              className="relative aspect-[4/5] w-full rounded-[32px] object-cover"
            />
          </div>
          <div>
            <h2 className="type-section">Here&rsquo;s how you can have more time to write. Let us help with the rest.</h2>
            <CheckList className="mt-8" items={help} />
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/submit-your-manuscript/" className="btn btn-gold btn-lg">
                Get Started Here <ArrowRight />
              </Link>
              <SampleButton />
            </div>
          </div>
        </div>
      </section>

      {/* Royalties. */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <h2 className="type-section">
              Now let&rsquo;s talk <span className="underline decoration-gold decoration-[6px] underline-offset-[10px]">royalties</span>.
            </h2>
            <div className="type-lead mt-8 max-w-[640px] space-y-4">
              <p className="font-bold text-navy">We do all of this while paying you the highest royalties in the industry at 80-85%.</p>
              <p className="font-bold text-navy">We believe that we only succeed when you do!</p>
              <p>
                If you&rsquo;re a dedicated author who knows your career depends on having the time to create your next masterpiece, ePublishingWorks! is here to be your
                partner. Let us handle the publishing details so you can focus on writing&mdash;and earning.
              </p>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/submit-your-manuscript/" className="btn btn-blue btn-lg">
                Submit Your Manuscript to Start <ArrowRight />
              </Link>
              <SampleButton />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[520px]">
            <span aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-4 rounded-[32px] bg-gold" />
            <Image
              src="/images/site/author-woman-laptop-sofa.jpg"
              alt="An author relaxing on a sofa with her laptop"
              width={1066}
              height={1600}
              sizes="(min-width: 1024px) 520px, 90vw"
              className="relative aspect-[4/5] w-full rounded-[32px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-brand px-5 py-16 text-center lg:px-8 lg:py-20">
        <h2 className="mx-auto max-w-[760px] font-display text-[32px] font-extrabold leading-[1.08] tracking-[-0.03em] text-white md:text-[44px]">
          Ready to earn what your writing is worth?
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/submit-your-manuscript/" className="btn btn-gold btn-lg">
            Step 1: Submit Your Manuscript <ArrowRight />
          </Link>
          <SampleButton tone="dark" />
        </div>
      </section>

      <TestimonialsPair />
      <ClosingCta />

      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "The Advantage", path: "/the-advantage/" },
          ]),
        )}
      />
    </>
  );
}
