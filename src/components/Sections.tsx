import Link from "next/link";
import type { ReactNode } from "react";
import { FaqAccordion } from "./FaqAccordion";
import { JsonLd } from "./JsonLd";
import { StarsHeading, Testimonial } from "./Testimonial";
import { ArrowRight, CheckCircle } from "./icons";
import { faqSchema, graph } from "@/lib/schema";
import { faqs, testimonial, type Testimonial as T } from "@/lib/site";

// Blocks the WordPress site repeated across pages (Home, The Advantage, Submission Guidelines,
// About, FAQ), kept in one place so they stay identical everywhere.

const STEPS = [
  { title: "Submit your manuscript", text: "Send us your manuscript for review.", href: "/submit-your-manuscript/" },
  { title: "Get published", text: "We handle the details. You watch your book come to life." },
  { title: "Earn more royalties", text: "See higher royalties and your book in more hands." },
];

/** "Three easy steps to your roadmap…": a real sequence, so it is numbered. */
export function ThreeSteps({ kicker = "Three easy steps to", heading = "Your roadmap to becoming a published author lickety-split", className = "" }: { kicker?: string; heading?: string; className?: string }) {
  return (
    <section className={`bg-mist px-5 py-20 lg:px-8 lg:py-28 ${className}`}>
      <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="type-kicker">{kicker}</p>
          <h2 className="type-section mt-3">{heading}</h2>
          <Link href="/submit-your-manuscript/" className="btn btn-gold btn-lg mt-9">
            Submit Your Manuscript <ArrowRight />
          </Link>
        </div>
        <ol className="space-y-6">
          {STEPS.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[64px_1fr] items-start gap-5 rounded-[24px] bg-white p-6 shadow-[0_1px_2px_rgba(12,47,90,0.06)] md:p-7">
              <span aria-hidden="true" className="font-display text-[48px] font-extrabold leading-none tracking-[-0.04em] text-blue">
                {i + 1}.
              </span>
              <span>
                <span className="block font-display text-[21px] font-bold leading-[1.2] tracking-[-0.01em] text-navy">{s.title}</span>
                <span className="mt-2 block text-[16px] leading-[1.6]">
                  {s.href ? (
                    <Link href={s.href} className="underline decoration-gold decoration-2 underline-offset-4">
                      {s.text}
                    </Link>
                  ) : (
                    s.text
                  )}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** The six FAQs, with FAQPage schema. */
export function FaqSection({ heading = "Frequently asked questions", as: H = "h2", withSchema = true }: { heading?: string; as?: "h1" | "h2"; withSchema?: boolean }) {
  const half = Math.ceil(faqs.length / 2);
  return (
    <section id="faq" className="scroll-mt-24 px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1100px]">
        <H className="type-section text-center">{heading}</H>
        <div className="mt-12 grid gap-[10px] md:grid-cols-2 md:gap-[20px]">
          <FaqAccordion items={faqs.slice(0, half)} />
          <FaqAccordion items={faqs.slice(half)} />
        </div>
        <p className="mt-10 text-center text-[17px]">
          <strong className="font-bold text-navy">Still have questions?</strong> No problem,{" "}
          <Link href="/contact/" className="font-semibold underline decoration-gold decoration-2 underline-offset-4">
            reach out to us here
          </Link>
          .
        </p>
      </div>
      {withSchema ? <JsonLd data={graph(faqSchema(faqs))} /> : null}
    </section>
  );
}

/** "Our authors have a lot to say!": two testimonials and the two buttons. */
export function TestimonialsPair({ ids = ["jillian-david", "jeanne-glidewell"], heading = "Our authors have a lot to say!" }: { ids?: string[]; heading?: string }) {
  const items = ids.map(testimonial).filter((t): t is T => Boolean(t));
  if (!items.length) return null;
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1180px]">
        <StarsHeading text={heading.replace(/[.!…]+$/, "")} />
        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-8">
          {items.map((t) => (
            <Testimonial key={t.id} t={t} />
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link href="/reviews/" className="btn btn-blue btn-lg">
            Read More Author Reviews <ArrowRight />
          </Link>
          <Link href="/submit-your-manuscript/" className="btn btn-gold btn-lg">
            Submit Your Manuscript
          </Link>
        </div>
      </div>
    </section>
  );
}

/** "Transform your writing into profit": the closing band. */
export function ClosingCta({ heading = "Transform your writing into profit", label = "Start Your Publishing Journey", href = "/submit-your-manuscript/" }: { heading?: string; label?: string; href?: string }) {
  return (
    <section className="bg-gold px-5 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <h2 className="max-w-[720px] font-display text-[34px] font-extrabold leading-[1.04] tracking-[-0.03em] text-navy md:text-[48px]">{heading}</h2>
        <Link href={href} className="btn btn-blue btn-lg shrink-0">
          {label} <ArrowRight />
        </Link>
      </div>
    </section>
  );
}

/** A list with gold check marks; items can lead with a bold label. */
export function CheckList({ items, className = "" }: { items: { label?: string; text: ReactNode }[]; className?: string }) {
  return (
    <ul className={`space-y-4 ${className}`}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-4 text-[17px] leading-[1.6]">
          <CheckCircle className="mt-[3px] h-[22px] w-[22px] shrink-0" />
          <span>
            {it.label ? <strong className="font-bold text-navy">{it.label}: </strong> : null}
            {it.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
