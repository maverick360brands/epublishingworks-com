import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageBanner } from "@/components/PageBanner";
import { StarsHeading, Testimonial } from "@/components/Testimonial";
import { YouTube } from "@/components/YouTube";
import { graph, ids } from "@/lib/schema";
import { site, testimonial, testimonials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Christian Publisher Reviews & Testimonials",
  description:
    "Read what Rise UP Publications authors say about working with our Christian publishing team, from first-time authors to seasoned ministers.",
  alternates: { canonical: "/reviews/" },
};

export default function ReviewsPage() {
  return (
    <>
      <PageBanner>Rise UP Reviews</PageBanner>

      <section className="px-5 pb-5 pt-[30px]">
        <div className="mx-auto max-w-[1060px]">
          <StarsHeading />
          <div className="mt-[30px] grid items-start gap-[50px] md:grid-cols-2 md:gap-[40px]">
            <div className="space-y-[50px]">
              <Testimonial t={testimonial("rebecca-hartt")} />
              <Testimonial t={testimonial("marcy-di-michele")} />
            </div>
            <Testimonial t={testimonial("sally-monday")} />
          </div>
        </div>
      </section>

      <section className="px-5 py-[60px]">
        <div className="mx-auto max-w-[720px]">
          <YouTube id="svDgXS-XjZ8" title="Rise UP Publications author testimonial" />
        </div>
      </section>

      <section className="px-5 pb-[60px]">
        <div className="mx-auto grid max-w-[1060px] items-start gap-[50px] md:grid-cols-2 md:gap-[40px]">
          <Testimonial t={testimonial("charlie-artz")} />
          <Testimonial t={testimonial("robyn-richardson")} />
        </div>
      </section>

      {/* Testimonials are marked up as Quotations, not Review/AggregateRating: Google ignores
          self-serving reviews of an organization on its own site. */}
      <JsonLd
        data={graph({
          "@type": "WebPage",
          url: `${site.url}/reviews/`,
          about: { "@id": ids.org },
          hasPart: testimonials.filter((t) => t.id !== "sally-monday-short").map((t) => ({ "@type": "Quotation", text: t.quote, creator: { "@type": "Person", name: t.name } })),
        })}
      />
    </>
  );
}
