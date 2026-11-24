import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for isn't on our shelves. Here's how to find your way back.",
};

// A bookshelf with one gap, and the missing book tumbling off to the side.
const SPINES = [
  [22, 120, "#4eb3e2"],
  [16, 132, "#ffffff"],
  [26, 110, "#fcb813"],
  [18, 126, "#4eb3e2"],
  [0, 0, ""], // the gap
  [20, 118, "#ffffff"],
  [28, 134, "#4eb3e2"],
  [16, 104, "#fcb813"],
  [22, 128, "#ffffff"],
] as const;
/** Each spine's left edge, worked out once: the gap is as wide as the missing book. */
const SHELF = SPINES.reduce<{ at: number; next: number }[]>((acc, [w]) => {
  const at = acc.length ? acc[acc.length - 1].next : 20;
  return [...acc, { at, next: at + (w || 24) + 4 }];
}, []);

function MissingBook() {
  return (
    <svg viewBox="0 0 420 240" className="h-auto w-full max-w-[520px]" role="img" aria-label="A bookshelf with one book missing, and the book tumbling off to the side">
      {SPINES.map(([w, h, color], i) => {
        const { at } = SHELF[i];
        if (!w) return <rect key={i} x={at} y={196 - 128} width={24} height={128} rx={3} fill="none" stroke="#fcb813" strokeWidth="2" strokeDasharray="4 6" className="lost-path" />;
        return <rect key={i} x={at} y={196 - h} width={w} height={h} rx={3} fill={color} opacity={color === "#ffffff" ? 0.35 : 0.75} />;
      })}
      <rect x="12" y="196" width="300" height="8" rx="2" fill="#ffffff" opacity="0.5" />
      <g className="lost-one">
        <rect x="352" y="118" width="24" height="128" rx="3" fill="#fcb813" transform="rotate(24 364 182)" />
        <rect x="356" y="132" width="16" height="4" rx="1" fill="#0c2f5a" opacity="0.5" transform="rotate(24 364 182)" />
      </g>
    </svg>
  );
}

/** The "not on our shelves" content, also rendered by content pages whose item isn't visible. */
export function LostContent() {
  return (
    <>
      <section className="bg-brand overflow-hidden px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <p className="type-kicker !text-gold">Error 404</p>
            <h1 className="type-display mt-4 text-[44px] text-white sm:text-[60px] lg:text-[72px]">This page isn&rsquo;t on our shelves</h1>
            <p className="type-lead mt-8 max-w-[560px] text-white/85">
              The page you were looking for has moved or no longer exists. Search the catalog, or start from one of the pages below.
            </p>
            <form action="/books/" className="mt-8 flex max-w-[520px] gap-2">
              <label className="sr-only" htmlFor="lost-q">
                Search books by title, author, or series
              </label>
              <input
                id="lost-q"
                name="q"
                type="search"
                placeholder="Search title, author, or series"
                className="h-[54px] min-w-0 flex-1 rounded-full border-2 border-white/30 bg-white/10 px-5 text-[16px] text-white placeholder:text-white/60 focus:border-gold focus:outline-none"
              />
              <button type="submit" className="btn btn-gold btn-lg shrink-0">
                Search
              </button>
            </form>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/" className="btn btn-ghost-light btn-lg">
                Back to the Home Page <ArrowRight />
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <MissingBook />
          </div>
        </div>
      </section>
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-[1320px]">
          <h2 className="type-card">Popular places to start</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/books/", t: "Browse the books", d: "Mysteries, romance, and more, by genre." },
              { href: "/authors/", t: "Meet our authors", d: "Every author, A to Z." },
              { href: "/submit-your-manuscript/", t: "Submit a manuscript", d: "New books and reverted backlists." },
              { href: "/blog/", t: "Read the blog", d: "Advice for authors, guides for readers." },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="group block h-full rounded-[24px] bg-mist p-6 no-underline transition-transform hover:-translate-y-1">
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
