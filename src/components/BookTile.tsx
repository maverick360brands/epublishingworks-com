import Link from "next/link";
import { TiltCover } from "./TiltCover";

export type BookTileData = {
  slug: string;
  title: string;
  author: string;
  series: string;
  cover: string;
  coverWidth: number;
  coverHeight: number;
  href: string;
};

// Catalog tile: tilting cover, title, author, and series. The whole tile is the link.
export function BookTile({ book, priority = false, headingLevel = "h3" }: { book: BookTileData; priority?: boolean; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <Link href={book.href} className="group block no-underline">
      <TiltCover src={book.cover} alt={`Cover of ${book.title}`} width={book.coverWidth} height={book.coverHeight} sizes="(min-width: 1280px) 210px, (min-width: 768px) 25vw, 45vw" priority={priority} />
      <H className="mt-4 font-display text-[16px] font-bold leading-[1.25] tracking-[-0.3px] text-navy transition-colors group-hover:text-blue">{book.title}</H>
      <p className="mt-1 text-[14px] leading-[1.4] text-body">{book.author}</p>
      {book.series ? <p className="mt-1 text-[13px] text-gold-ink">{book.series}</p> : null}
    </Link>
  );
}
