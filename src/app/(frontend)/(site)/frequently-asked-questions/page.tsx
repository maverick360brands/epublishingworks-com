import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { PageBanner } from "@/components/PageBanner";
import { ClosingCta, ThreeSteps } from "@/components/Sections";
import { ArrowRight } from "@/components/icons";
import { breadcrumbSchema, faqSchema, graph } from "@/lib/schema";
import { faqs, site } from "@/lib/site";
import { SampleNote } from "@/components/SampleCta";

export const metadata: Metadata = pageMetadata({
  title: { absolute: site.seo.faq.title },
  description: site.seo.faq.description,
  path: "/frequently-asked-questions/",
});

// The canonical home of the FAQ and its FAQPage schema (Home and Submission Guidelines show the
// same questions without the schema).
export default function FaqPage() {
  return (
    <>
      <PageBanner intro="Straight answers about submitting your manuscript, backlist titles, editing, and the books we publish.">Frequently Asked Questions</PageBanner>

      <section className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
          <div>
            <FaqAccordion items={faqs} headingLevel="h2" />
            <p className="mt-10 text-[17px]">
              <strong className="font-bold text-navy">Still have questions?</strong> No problem,{" "}
              <Link href="/contact/" className="font-semibold underline decoration-gold decoration-2 underline-offset-4">
                reach out to us here
              </Link>
              .
            </p>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="bg-brand rounded-[28px] p-7 text-white">
              <p className="font-display text-[22px] font-bold leading-[1.2]">Ready when you are</p>
              <p className="mt-2 text-[16px] leading-[1.6] text-white/80">Send us your manuscript or backlist for review. We reply with clear next steps within 2 to 4 business days.</p>
              <Link href="/submit-your-manuscript/" className="btn btn-gold mt-6">
                Submit Your Manuscript <ArrowRight />
              </Link>
              <SampleNote tone="dark" className="mt-4 !text-[14px]" />
            </div>
            <div className="rounded-[28px] bg-mist p-7">
              <p className="font-display text-[18px] font-bold text-navy">Prefer to talk?</p>
              <p className="mt-2 text-[16px]">
                Call us at{" "}
                <a href={site.phoneHref} className="font-semibold">
                  {site.phone}
                </a>{" "}
                or{" "}
                <Link href="/contact/" className="font-semibold">
                  send us a message
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>
      </section>

      <ThreeSteps />
      <ClosingCta />

      <JsonLd
        data={graph(
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Frequently Asked Questions", path: "/frequently-asked-questions/" },
          ]),
        )}
      />
    </>
  );
}
