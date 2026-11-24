import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { BookTile } from "@/components/BookTile";
import { JsonLd } from "@/components/JsonLd";
import { ManuscriptForm } from "@/components/ManuscriptForm";
import { manuscriptUploadsEnabled } from "@/lib/manuscript";
import { PageBanner } from "@/components/PageBanner";
import { CheckCircle } from "@/components/icons";
import { bookAuthorLabel, getCatalog, heroBooks } from "@/lib/content";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: { absolute: site.seo.submit.title },
  description: site.seo.submit.description,
  path: "/submit-your-manuscript/",
});

export default async function SubmitManuscriptPage() {
  const c = await getCatalog();
  const covers = heroBooks(c, 4);
  return (
    <>
      <PageBanner kicker="Submissions" intro="The first step is to submit your manuscript for review.">
        Submit Your Manuscript
      </PageBanner>

      <section className="px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="type-section !text-[32px] md:!text-[40px]">Are you ready to take the first step?</h2>
            <div className="mt-6 space-y-4 text-[17px] leading-[1.65]">
              <p>
                At ePublishingWorks!, we believe in empowering authors to achieve their goals without sacrificing their passion for storytelling. Whether you&rsquo;re
                breathing new life into your backlist or looking for the right partner for your latest manuscript, we&rsquo;re here to help you focus on what matters
                most: your writing.
              </p>
              <p className="font-bold text-navy">The first step is to submit your manuscript for review.</p>
              <p>
                If your manuscript is not ready for that, that&rsquo;s ok.{" "}
                <Link href="/contact/" className="font-semibold underline decoration-gold decoration-2 underline-offset-4">
                  Reach out for a chat
                </Link>
                .
              </p>
            </div>
            <ul className="mt-8 space-y-3 text-[16px] text-navy">
              {[
                "We reply with clear next steps within 2 to 4 business days",
                "Backlist (previously published) and frontlist titles welcome",
                "Our authors earn 80% to 85% royalties",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <CheckCircle className="mt-[2px] h-[20px] w-[20px] shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[15px]">
              Before you submit, read our{" "}
              <Link href="/submission-guidelines/" className="font-semibold underline">
                submission guidelines
              </Link>
              .
            </p>
            {covers.length ? (
              <div className="mt-10 hidden lg:block">
                <p className="type-kicker">Some of our authors&rsquo; books</p>
                <ul className="mt-4 grid grid-cols-4 gap-4">
                  {covers.map((b) => (
                    <li key={b.slug}>
                      <BookTile
                        book={{ slug: b.slug, title: b.title, author: bookAuthorLabel(c, b), series: "", cover: b.cover, coverWidth: b.coverWidth, coverHeight: b.coverHeight, href: b.url }}
                        compact
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <div className="rounded-[32px] border border-line bg-white p-6 shadow-[0_30px_60px_-40px_rgba(12,47,90,0.45)] sm:p-9 lg:p-11">
            <h2 className="font-display text-[26px] font-extrabold tracking-[-0.02em] text-navy">Submit your manuscript</h2>
            <p className="mt-2 text-[15px] text-body">
              Fields marked <span className="text-gold-ink">*</span> are required.
            </p>
            <div className="mt-8">
              <ManuscriptForm uploadsEnabled={manuscriptUploadsEnabled()} />
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Submit Your Manuscript", path: "/submit-your-manuscript/" },
          ]),
        )}
      />
    </>
  );
}
