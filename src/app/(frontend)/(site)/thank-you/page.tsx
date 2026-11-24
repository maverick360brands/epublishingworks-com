import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle } from "@/components/icons";

// Shown after the contact form is sent.
export const metadata: Metadata = {
  title: "Thank You for Contacting Us",
  robots: { index: false, follow: true },
  alternates: { canonical: "/thank-you/" },
};

const next = [
  { t: "We read your message", d: "A member of our publishing team reads every inquiry." },
  { t: "We reply by email", d: "We'll follow up with any questions about your book or recorded content." },
  { t: "We talk it through", d: "If it looks like a fit, we'll set up a conversation about your goals and the path ahead." },
];

export default function ThankYouPage() {
  return (
    <>
      <section className="bg-brand px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[860px] text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold">
            <CheckCircle className="h-9 w-9 [&_circle]:fill-navy" />
          </span>
          <h1 className="type-display mt-6 text-[40px] text-white md:text-[56px]">Thank you. Your message is in.</h1>
          <p className="type-lead mx-auto mt-5 max-w-[560px] text-white/85">
            We&rsquo;re grateful you&rsquo;re considering Rise UP Publications for your book. Here&rsquo;s what happens next.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {next.map((s, i) => (
              <li key={s.t} className="relative border-t-2 border-[#e2e8f1] pt-7">
                <span aria-hidden="true" className="absolute -top-[2px] left-0 h-[2px] w-16 bg-gold" />
                <span aria-hidden="true" className="font-display text-[48px] font-extrabold leading-none tracking-[-0.04em] text-blue">
                  0{i + 1}
                </span>
                <h2 className="type-card mt-3">{s.t}</h2>
                <p className="mt-2 text-[16px] leading-[1.6]">{s.d}</p>
              </li>
            ))}
          </ol>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <Link href="/coaching/" className="group rounded-[28px] bg-brand p-8 no-underline transition-transform hover:-translate-y-1">
              <h2 className="font-display text-[22px] font-bold text-white">Want answers sooner?</h2>
              <p className="mt-3 text-[16px] leading-[1.6] text-white/80">
                Book a 1:1 session with head publisher Brian Paules and leave with a publishing plan. No obligation to publish with us.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-bold text-gold">
                See coaching sessions <ArrowRight className="h-[0.9em] w-[1em] transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link href="/newsletter/" className="group rounded-[28px] bg-[#f3f6fb] p-8 no-underline transition-transform hover:-translate-y-1">
              <h2 className="type-card">Get the free publishing roadmap</h2>
              <p className="mt-3 text-[16px] leading-[1.6] text-body">Twelve steps from first idea to a published book, plus our twice-monthly Author Letter.</p>
              <span className="mt-5 inline-flex items-center gap-2 font-bold text-navy">
                Get the roadmap <ArrowRight className="h-[0.9em] w-[1em] transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
