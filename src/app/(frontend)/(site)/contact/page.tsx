import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { ArrowRight, Mail, Phone } from "@/components/icons";
import { breadcrumbSchema, graph, ids } from "@/lib/schema";
import { site } from "@/lib/site";
import { SampleNote } from "@/components/SampleCta";

export const metadata: Metadata = pageMetadata({
  title: { absolute: site.seo.contact.title },
  description: site.seo.contact.description,
  path: "/contact/",
});

// Copy is the WordPress page's, verbatim. The form's heading ("Quick Contact") was the page's
// H1 there; here the page leads with its own H1 and the form keeps that name.
export default function ContactPage() {
  const { street, city, region, postalCode } = site.address;
  return (
    <>
      <section className="bg-brand px-5 pb-40 pt-14 lg:px-8 lg:pb-48 lg:pt-20">
        <div className="mx-auto max-w-[1180px]">
          <p className="type-kicker !text-gold">Contact ePublishingWorks</p>
          <h1 className="type-display mt-4 max-w-[760px] text-[44px] text-white sm:text-[58px] lg:text-[66px]">We&rsquo;d love to hear from you.</h1>
          <div className="type-lead mt-6 max-w-[620px] space-y-3 text-white/85">
            <p className="font-semibold text-white">Please contact us using the form on this page.</p>
            <p>When you contact us please include a list of your past titles (if any), and your genre and sub-genre of interest.</p>
            <p>You can expect a personal reply within 2-4 business days.</p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 lg:px-8 lg:pb-32">
        <div className="mx-auto -mt-28 grid max-w-[1180px] items-start gap-12 lg:-mt-32 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
          <div className="rounded-[32px] bg-white p-6 shadow-[0_30px_60px_-30px_rgba(12,47,90,0.45),0_0_0_1px_rgba(12,47,90,0.04)] sm:p-10 lg:p-12">
            <h2 className="font-display text-[26px] font-extrabold tracking-[-0.02em] text-navy">Quick Contact</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <aside className="divide-y divide-line lg:pt-44">
            <div className="pb-8">
              <h2 className="type-card">&hellip;or you can give us a call</h2>
              <a href={site.phoneHref} className="mt-4 flex items-center gap-3 font-display text-[22px] font-bold text-navy no-underline hover:text-blue">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-navy">
                  <Phone className="h-4 w-4" />
                </span>
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="mt-4 flex items-center gap-3 text-[17px] font-semibold text-navy no-underline hover:text-blue">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mist text-blue">
                  <Mail className="h-4 w-4" />
                </span>
                {site.email}
              </a>
              <address className="mt-5 text-[15px] not-italic leading-[1.6] text-body">
                {street}
                <br />
                {city}, {region} {postalCode}
              </address>
            </div>
            <div className="pt-8">
              <h2 className="type-card">Ready to submit?</h2>
              <p className="mt-3 text-[16px] leading-[1.6]">Send your manuscript or backlist through our submission form for a full review.</p>
              <Link href="/submit-your-manuscript/" className="btn btn-blue mt-5">
                Submit Your Manuscript <ArrowRight />
              </Link>
              <SampleNote className="mt-4 !text-[14px]" />
            </div>
          </aside>
        </div>
      </section>

      <JsonLd
        data={graph(
          { "@type": "ContactPage", url: `${site.url}/contact/`, about: { "@id": ids.org } },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact/" },
          ]),
        )}
      />
    </>
  );
}
