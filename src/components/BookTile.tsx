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
// `compact` shows the cover alone (the title stays available to screen readers); `dense` is the
// smaller type for the full catalog grid, where seven covers share a row.
export function BookTile({
  book,
  priority = false,
  headingLevel = "h3",
  compact = false,
  dense = false,
  sizes,
}: {
  book: BookTileData;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
  compact?: boolean;
  dense?: boolean;
  sizes?: string;
}) {
  const H = headingLevel;
  return (
    <Link href={book.href} className="group block no-underline">
      <TiltCover
        src={book.cover}
        alt={`Cover of ${book.title}`}
        width={book.coverWidth}
        height={book.coverHeight}
        sizes={sizes ?? (compact ? "120px" : "(min-width: 1280px) 210px, (min-width: 768px) 25vw, 45vw")}
        priority={priority}
      />
      {compact ? (
        <span className="sr-only">
          {book.title} by {book.author}
        </span>
      ) : (
        <>
          <H className={`font-display font-bold leading-[1.25] tracking-[-0.01em] text-navy transition-colors group-hover:text-blue ${dense ? "mt-3.5 text-[15px]" : "mt-4 text-[16px]"}`}>{book.title}</H>
          <p className={`mt-1 leading-[1.4] text-body ${dense ? "text-[13.5px]" : "text-[14px]"}`}>{book.author}</p>
          {book.series ? <p className={`mt-1 font-semibold leading-[1.35] text-gold-ink ${dense ? "text-[12.5px]" : "text-[13px]"}`}>{book.series}</p> : null}
        </>
      )}
    </Link>
  );
}
