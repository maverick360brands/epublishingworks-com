import Image from "next/image";
import Link from "next/link";
import type { Author, Book } from "@/lib/content";

type Cover = { slug: string; cover: string; coverWidth: number; coverHeight: number; title: string };
/** Just what a directory card shows, so it can be passed to the client-side browser. */
export type AuthorCardData = Pick<Author, "slug" | "name" | "role" | "photo" | "url"> & { covers: Cover[] };

export const toAuthorCard = (author: Author, books: Book[]): AuthorCardData => ({
  slug: author.slug,
  name: author.name,
  role: author.role,
  photo: author.photo,
  url: author.url,
  covers: books.slice(0, 3).map((b) => ({ slug: b.slug, cover: b.cover, coverWidth: b.coverWidth, coverHeight: b.coverHeight, title: b.title })),
});

// Directory card: a grayscale portrait under a light wash that blooms into color on hover, with the
// author's covers stacked at the corner (they fan out on hover). Sized for six across
// (Dustin, 2026-11-25: smaller photos, more breathing room).
export function AuthorCard({ author, priority = false }: { author: AuthorCardData; priority?: boolean }) {
  const src = author.photo || author.covers[0]?.cover || "";
  const stack = author.covers;
  return (
    <Link href={author.url} className="group block no-underline">
      <span className="relative block">
        <span className="relative block aspect-[4/5] overflow-hidden rounded-[20px] bg-mist">
          {src ? (
            <Image
              src={src}
              alt={`Portrait of ${author.name}`}
              fill
              sizes="(min-width: 1280px) 200px, (min-width: 1024px) 18vw, (min-width: 768px) 23vw, (min-width: 640px) 30vw, 45vw"
              priority={priority}
              className={`${author.photo ? "object-cover object-top" : "object-contain p-8"} grayscale contrast-[0.88] brightness-[1.06] transition-[filter,transform] duration-500 ease-out group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-focus-visible:grayscale-0 group-focus-visible:contrast-100 group-focus-visible:brightness-100 group-hover:scale-[1.04]`}
            />
          ) : null}
          {/* A light grayscale wash that blooms into color on hover or focus (Dustin, 2026-11-25). */}
          <span aria-hidden="true" className="absolute inset-0 bg-white/30 transition-opacity duration-500 ease-out group-hover:opacity-0 group-focus-visible:opacity-0" />
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-deep/25 to-transparent" />
        </span>
        {stack.length ? (
          <span aria-hidden="true" className="absolute -bottom-3 right-2 flex h-[64px] items-end">
            {stack.map((b, i) => (
              <span
                key={b.slug}
                className="relative -ml-5 w-[38px] transition-transform duration-300 ease-out first:ml-0"
                style={{ zIndex: stack.length - i, transform: `rotate(${(i - (stack.length - 1) / 2) * 6}deg)` }}
              >
                <Image
                  src={b.cover}
                  alt=""
                  width={b.coverWidth}
                  height={b.coverHeight}
                  sizes="38px"
                  className="h-auto w-full rounded-[2px] shadow-[0_5px_12px_-4px_rgba(12,47,90,0.6)] transition-transform duration-300 ease-out group-hover:-translate-y-1.5"
                  style={{ transitionDelay: `${i * 40}ms` }}
                />
              </span>
            ))}
          </span>
        ) : null}
      </span>
      <span className="mt-5 block font-display text-[18px] font-bold leading-[1.2] tracking-[-0.015em] text-navy transition-colors group-hover:text-blue">{author.name}</span>
      <span className="mt-1 block text-[14px] leading-[1.45] text-body">
        {author.role}
      </span>
    </Link>
  );
}
