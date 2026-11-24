import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for has wandered off. Here's how to find your way back.",
};

const CROSS = "M3.2 0h1.6v2.6h3.2v1.6H4.8V10H3.2V4.2H0V2.6h3.2z";

// The ninety and nine: an 11 × 9 flock of brand crosses, and one gold cross that wandered off.
function LostSheep() {
  const flock = Array.from({ length: 99 }, (_, i) => ({ x: (i % 11) * 22, y: Math.floor(i / 11) * 24 }));
  return (
    <svg viewBox="0 0 420 240" className="h-auto w-full max-w-[520px]" role="img" aria-label="Ninety-nine crosses in a field, and one that has wandered away">
      <g transform="translate(14 14)" fill="currentColor" className="text-white/25">
        {flock.map((p, i) => (
          <path key={i} d={CROSS} transform={`translate(${p.x} ${p.y})`} />
        ))}
      </g>
      <path d="M250 110 C 300 90, 320 160, 372 150" fill="none" stroke="#fcb813" strokeWidth="2" strokeDasharray="4 7" strokeLinecap="round" className="lost-path" />
      <g className="lost-one">
        <path d={CROSS} transform="translate(372 136) scale(2.4)" fill="#fcb813" />
      </g>
    </svg>
  );
}

/** The "wandered off" content, also rendered by content pages whose item isn't visible. */
export function LostContent() {
  return (
    <>
      <section className="bg-brand overflow-hidden px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <p className="type-kicker !text-gold">Error 404</p>
            <h1 className="type-display mt-4 text-[44px] text-white sm:text-[60px] lg:text-[72px]">This page wandered off</h1>
            <figure className="mt-8 max-w-[560px] border-l-4 border-gold pl-6">
              <blockquote className="font-alice text-[21px] leading-[1.45] text-white md:text-[24px]">
                &ldquo;What man of you, having an hundred sheep, if he lose one of them, doth not leave the ninety and nine in the wilderness, and go after
                that which is lost, until he find it?&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-[15px] text-white/70">Luke 15:4 (KJV)</figcaption>
            </figure>
            <p className="type-lead mt-8 max-w-[560px] text-white/85">
              The page you were looking for isn&rsquo;t here, but you&rsquo;re not lost. Let&rsquo;s get you back to the flock.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className="btn btn-gold btn-lg">
                Back to the Home Page <ArrowRight />
              </Link>
              <Link href="/books/" className="btn btn-ghost-light btn-lg">
                Browse Our Books
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <LostSheep />
          </div>
        </div>
      </section>
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-[1320px]">
          <h2 className="type-card">Popular places to start</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/authors/", t: "Meet our authors", d: "Pastors, evangelists, teachers, and novelists." },
              { href: "/coaching/", t: "Publishing coaching", d: "Plan your book with our head publisher." },
              { href: "/blog/", t: "Read the blog", d: "Guides for Christian authors." },
              { href: "/contact/", t: "Contact us", d: "Tell us about your book." },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="group block h-full rounded-[24px] bg-[#f3f6fb] p-6 no-underline transition-transform hover:-translate-y-1">
                  <span className="flex items-center justify-between font-display text-[18px] font-bold text-navy">
                    {l.t}
                    <ArrowRight className="h-[0.9em] w-[1em] text-blue transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="mt-2 block text-[15px] text-body">{l.d}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <LostContent />
      </main>
      <Footer />
    </>
  );
}
