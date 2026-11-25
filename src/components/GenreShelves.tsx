import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "@/components/icons";
import { SampleNote } from "@/components/SampleCta";
import { heroBooks, type Book, type Catalog } from "@/lib/content";
import { wantedGenres } from "@/lib/site";

// "Here's the type of stuff we really want…" on the submission guidelines (Dustin, 2026-11-25: "make the genre area
// 5X more interesting"). Each genre is a shelf of real covers from our catalog, fanned, linking to that genre on
// /books/. The fan opens as the tile scrolls into view and spreads a little more under the pointer (globals.css,
// "Genre shelves"); with reduced motion it simply sits fanned.

type ShelfCover = { slug: string; src: string; width: number; height: number };
export type Shelf = { name: string; text: string; genre: string; covers: ShelfCover[] };

// Tiles by position: two wide tiles open the grid, four plain ones follow, and the last genre sits wide beside the
// call to action. The copy order is the WordPress page's.
const LAYOUT: { wide: boolean; theme: keyof typeof THEMES }[] = [
  { wide: true, theme: "dark" },
  { wide: true, theme: "warm" },
  { wide: false, theme: "plain" },
  { wide: false, theme: "plain" },
  { wide: false, theme: "plain" },
  { wide: false, theme: "plain" },
  { wide: true, theme: "cool" },
];

const THEMES = {
  dark: { tile: "bg-navy-deep", title: "text-white", text: "text-white/80", link: "text-gold", ledge: "rgb(0 0 0 / 0.45)" },
  warm: { tile: "bg-sun-pale", title: "text-navy", text: "text-body", link: "text-blue", ledge: "rgb(138 97 0 / 0.28)" },
  cool: { tile: "bg-[color-mix(in_srgb,var(--color-sky)_16%,white)]", title: "text-navy", text: "text-body", link: "text-blue", ledge: "rgb(12 47 90 / 0.22)" },
  plain: { tile: "bg-white", title: "text-navy", text: "text-body", link: "text-blue", ledge: "rgb(12 47 90 / 0.18)" },
};

// Where each cover sits in the fan, the first (most featured) in the middle.
const SPOTS: Record<number, number[]> = { 1: [0], 2: [-0.5, 0.5], 3: [0, -1, 1], 4: [-0.5, 0.5, -1.5, 1.5], 5: [0, -1, 1, -2, 2] };

// Books whose cover is still a stand-in from WordPress (a gray "Coming Soon" card, or "Coming Spring 2024"):
// never on a shelf. Drop a slug once its real cover is uploaded in the admin.
const STAND_IN_COVERS = new Set(["barbarcia-richard-bowker", "liberty-unleashed-alicia-dean", "the-devils-caldera-patrick-astre", "port-city-rat-trap-gerry-boyle"]);

/** Covers for each genre: featured and newest first, no book on two shelves, different authors where possible. */
export function genreShelves(c: Catalog): Shelf[] {
  const pool = heroBooks(c, Number.MAX_SAFE_INTEGER).filter((b) => b.cover && !STAND_IN_COVERS.has(b.slug));
  const used = new Set<string>();
  return wantedGenres.map((g, i) => {
    const want = LAYOUT[i]?.wide ? 5 : 3;
    const picks: Book[] = [];
    const authors = new Set<string>();
    for (const distinct of [true, false]) {
      for (const b of pool) {
        if (picks.length >= want) break;
        if (used.has(b.slug) || !g.shelf.includes(b.genre)) continue;
        if (distinct && b.authorSlugs.some((a) => authors.has(a))) continue;
        picks.push(b);
        used.add(b.slug);
        b.authorSlugs.forEach((a) => authors.add(a));
      }
    }
    return {
      name: g.name,
      text: g.text,
      genre: g.shelf[0],
      covers: picks.map((b) => ({ slug: b.slug, src: b.cover, width: b.coverWidth, height: b.coverHeight })),
    };
  });
}

function Fan({ covers, wide, ledge }: { covers: ShelfCover[]; wide: boolean; ledge: string }) {
  const spots = SPOTS[covers.length] ?? [];
  return (
    <div aria-hidden="true" className={`fan ${wide ? "fan-wide h-[176px] sm:h-[188px]" : "fan-narrow h-[168px]"}`} style={{ "--ledge": ledge } as CSSProperties}>
      {covers.map((cv, i) => (
        <span key={cv.slug} className="fan-cover" style={{ "--k": spots[i], "--d": Math.ceil(Math.abs(spots[i])) } as CSSProperties}>
          <span className="fan-inner">
            <Image
              src={cv.src}
              alt=""
              width={cv.width}
              height={cv.height}
              sizes={wide ? "104px" : "94px"}
              className="block aspect-[2/3] h-auto w-full rounded-[5px] object-cover shadow-[0_14px_24px_-10px_rgba(12,47,90,0.55)]"
            />
          </span>
        </span>
      ))}
    </div>
  );
}

export function GenreShelves({ shelves }: { shelves: Shelf[] }) {
  return (
    <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {shelves.map((s, i) => {
        const { wide, theme } = LAYOUT[i] ?? { wide: false, theme: "plain" as const };
        const t = THEMES[theme];
        return (
          <li
            key={s.name}
            className={`genre-tile group relative flex overflow-hidden rounded-[28px] shadow-[0_1px_2px_rgba(12,47,90,0.06)] transition-[box-shadow,transform] duration-500 ease-out hover:shadow-[0_28px_50px_-30px_rgba(12,47,90,0.45)] has-[a:focus-visible]:ring-[3px] has-[a:focus-visible]:ring-blue motion-safe:hover:-translate-y-1 ${t.tile} ${
              wide ? "flex-col sm:col-span-2 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] sm:items-center" : "flex-col"
            }`}
          >
            <div className={wide ? "order-2 px-7 pb-8 pt-7 sm:order-1 sm:py-10 sm:pl-9 sm:pr-2" : "order-2 px-7 pb-8 pt-6"}>
              <h3 className={`font-display font-extrabold tracking-[-0.02em] ${wide ? "text-[28px] leading-[1.1] md:text-[34px]" : "text-[23px] leading-[1.15]"} ${t.title}`}>{s.name}</h3>
              <p className={`mt-2.5 text-[16px] leading-[1.6] ${t.text}`}>{s.text}</p>
              <Link
                href={`/books/?genre=${encodeURIComponent(s.genre)}`}
                className={`mt-4 inline-block text-[15px] font-bold leading-[1.4] no-underline after:absolute after:inset-0 after:z-20 focus-visible:outline-none ${t.link}`}
              >
                Browse {s.genre}
                <ArrowRight className="ml-1.5 inline-block h-[0.9em] w-[1em] align-[-0.1em] transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className={wide ? "order-1 px-6 pt-10 sm:order-2 sm:py-10 sm:pl-2 sm:pr-8" : "order-1 px-6 pt-9"}>
              <Fan covers={s.covers} wide={wide} ledge={t.ledge} />
            </div>
          </li>
        );
      })}
      {/* The open slot on the shelf: the reader's own book. */}
      <li className="genre-tile relative flex flex-col items-center gap-7 overflow-hidden rounded-[28px] bg-navy-deep px-7 py-10 text-center sm:col-span-2 sm:flex-row sm:gap-10 sm:px-10 sm:text-left">
        <span
          aria-hidden="true"
          className="your-book flex aspect-[2/3] w-[104px] shrink-0 flex-col items-center justify-center gap-2 rounded-[6px] border-2 border-dashed border-gold/70 bg-white/5 font-display text-[14px] font-extrabold uppercase tracking-[0.08em] text-gold"
        >
          <span className="text-[34px] leading-none">+</span>
          Your book
        </span>
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <Link href="/submit-your-manuscript/" className="btn btn-gold btn-lg text-center">
            Submit Your Manuscript to Get Started
          </Link>
          <SampleNote tone="dark" className="!text-[14px]" />
        </div>
      </li>
    </ul>
  );
}
