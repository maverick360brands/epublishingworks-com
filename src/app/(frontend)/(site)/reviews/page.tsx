import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageBanner } from "@/components/PageBanner";
import { ClosingCta } from "@/components/Sections";
import { Testimonial } from "@/components/Testimonial";
import { ArrowRight, Star } from "@/components/icons";
import { breadcrumbSchema, graph, ids } from "@/lib/schema";
import { site, testimonials } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: { absolute: site.seo.reviews.title },
  description: site.seo.reviews.description,
  path: "/reviews/",
});

// Every author testimonial from the WordPress site, verbatim, in the Reviews page's order.
export default function ReviewsPage() {
  const left = testimonials.filter((_, i) => i % 2 === 0);
  const right = testimonials.filter((_, i) => i % 2 === 1);
  return (
    <>
      <PageBanner
        intro={
          <span className="flex flex-wrap items-center gap-3">
            <span className="flex gap-1 text-gold" role="img" aria-label="5 out of 5 stars">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-5 w-5" />
              ))}
            </span>
            Here&rsquo;s what some of our authors have been saying&hellip;
          </span>
        }
      >
        Reviews
      </PageBanner>

      <section className="bg-mist px-5 pb-20 pt-6 lg:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-[1180px] gap-x-8 md:grid-cols-2">
          {[left, right].map((col, c) => (
            <div key={c} className={`space-y-12 ${c ? "md:mt-24" : ""}`}>
              {col.map((t) => (
                <Testimonial key={t.id} t={t} />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          <Link href="/submit-your-manuscript/" className="btn btn-gold btn-lg">
            Join Our Authors <ArrowRight />
          </Link>
          <Link href="/authors/" className="btn btn-blue btn-lg">
            Meet Every Author
          </Link>
        </div>
      </section>

      <ClosingCta />

      <JsonLd
        data={graph(
          {
            "@type": "WebPage",
            name: "Author reviews",
            url: `${site.url}/reviews/`,
            about: { "@id": ids.org },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: testimonials.map((t, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: { "@type": "Quotation", text: t.quote, spokenByCharacter: { "@type": "Person", name: t.name } },
              })),
            },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Reviews", path: "/reviews/" },
          ]),
        )}
      />
    </>
  );
}
