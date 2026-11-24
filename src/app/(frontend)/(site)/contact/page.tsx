import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ContactForm, ContactFormFields } from "@/components/ContactForm";
import { ArrowRight, CalendarLine, Phone } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start Your Publishing Journey",
  description:
    "Contact Rise UP Publications about your manuscript or recorded content, book a 1:1 publishing coaching session, or schedule a discovery call.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-brand px-5 pb-40 pt-14 lg:px-8 lg:pb-48 lg:pt-20">
        <div className="mx-auto max-w-[1180px]">
          <p className="type-kicker !text-gold">Contact Rise UP Publications</p>
          <h1 className="type-display mt-4 max-w-[760px] text-[44px] text-white sm:text-[58px] lg:text-[68px]">Tell us about your book</h1>
          <p className="type-lead mt-6 max-w-[600px] text-white/85">
            A finished manuscript, a rough idea, or years of sermons: wherever you are, start here. Our publishing team reads every message.
          </p>
        </div>
      </section>

      <section className="px-5 pb-24 lg:px-8 lg:pb-32">
        <div className="mx-auto -mt-28 grid max-w-[1180px] items-start gap-12 lg:-mt-32 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
          <div className="rounded-[32px] bg-white p-6 shadow-[0_30px_60px_-30px_rgba(13,31,60,0.45),0_0_0_1px_rgba(13,31,60,0.04)] sm:p-10 lg:p-12">
            <Suspense fallback={<ContactFormFields />}>
              <ContactForm />
            </Suspense>
          </div>

          <aside className="divide-y divide-[#e3e9f2] lg:pt-44">
            <div className="pb-9">
              <h2 className="type-card">Prefer to talk?</h2>
              <div className="mt-5 flex items-center gap-4">
                <Image
                  src="/images/site/team-anna-aguilar.jpg"
                  alt=""
                  width={675}
                  height={900}
                  sizes="64px"
                  className="h-16 w-16 rounded-full object-cover object-top"
                />
                <p className="text-[15px] leading-[1.45]">
                  <span className="block font-display font-bold text-navy">Anna Aguilar</span>
                  Operations director
                </p>
              </div>
              <a
                href={site.phoneHref}
                className="mt-6 flex items-center gap-3 font-display text-[24px] font-extrabold tracking-[-0.02em] text-navy no-underline hover:text-blue"
              >
                <Phone className="h-5 w-5 text-blue" />
                {site.phone}
              </a>
              <a href={site.calendly.quickConnect} target="_blank" rel="noopener" className="btn btn-gold mt-5">
                <CalendarLine /> Book a 30-minute call
              </a>
            </div>

            <div className="py-9">
              <h2 className="type-card">Want a publisher&rsquo;s advice first?</h2>
              <p className="mt-3 text-[16px] leading-[1.6]">
                Book a 1- or 2-hour coaching session with head publisher Brian Paules, from $199. No obligation to publish with us.
              </p>
              <Link
                href="/coaching/"
                className="mt-4 inline-flex items-center gap-2 font-display text-[16px] font-bold text-blue no-underline hover:text-navy"
              >
                See coaching sessions <ArrowRight />
              </Link>
            </div>

            <div className="pt-9">
              <div className="rounded-[18px] bg-[#f3f6fb] p-5 text-[14px] leading-[1.6] shadow-[inset_4px_0_0_var(--color-gold)]">
                <h2 className="font-display text-[15px] font-bold text-navy">Not affiliated with &ldquo;Eli Yoder Secrets&rdquo;</h2>
                <p className="mt-2">
                  Rise UP Publications, our author{" "}
                  <a href="https://eliyoder.com" target="_blank" rel="noopener" className="underline">
                    Eli Yoder
                  </a>{" "}
                  (@yodertotor40), and his book <em>Undeceived</em> are not affiliated with the AI-generated &ldquo;Eli Yoder Secrets&rdquo; PDF book
                  or its publisher, eliyodersecrets.com, or the <em>Eli Yoder Secrets</em> YouTube channel.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
