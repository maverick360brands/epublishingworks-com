import Image from "next/image";
import Link from "next/link";
import type { Author, Book } from "@/lib/content";

// Directory card: a blue-duotone portrait that blooms into color on hover, with the
// author's covers stacked at the corner (they fan out on hover).
export function AuthorCard({ author, books, priority = false }: { author: Author; books: Book[]; priority?: boolean }) {
  const src = author.photo || books[0]?.cover || "";
  const stack = books.slice(0, 3);
  return (
    <Link href={author.url} className="group block no-underline">
      <span className="relative block">
        <span className="relative block aspect-[4/5] overflow-hidden rounded-[24px] bg-blue">
          <Image
            src={src}
            alt={`Portrait of ${author.name}`}
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 768px) 30vw, 45vw"
            priority={priority}
            className={`${author.photo ? "object-cover object-top" : "object-contain p-8"} grayscale transition-[filter,transform] duration-500 ease-out group-hover:scale-[1.04] group-hover:grayscale-0`}
          />
          {/* Brand-blue duotone that lifts on hover. */}
          <span aria-hidden="true" className="absolute inset-0 bg-blue/45 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" />
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-deep/60 to-transparent" />
        </span>
        {stack.length ? (
          <span aria-hidden="true" className="absolute -bottom-4 right-3 flex h-[86px] items-end">
            {stack.map((b, i) => (
              <span
                key={b.slug}
                className="relative -ml-7 w-[52px] transition-transform duration-300 ease-out first:ml-0"
                style={{ zIndex: stack.length - i, transform: `rotate(${(i - (stack.length - 1) / 2) * 6}deg)` }}
              >
                <Image
                  src={b.cover}
                  alt=""
                  width={b.coverWidth}
                  height={b.coverHeight}
                  sizes="52px"
                  className="h-auto w-full rounded-[2px] shadow-[0_6px_14px_-4px_rgba(13,31,60,0.6)] transition-transform duration-300 group-hover:-translate-y-2"
                  style={{ transitionDelay: `${i * 40}ms` }}
                />
              </span>
            ))}
          </span>
        ) : null}
      </span>
      <span className="mt-6 block font-display text-[24px] font-bold leading-[1.15] tracking-[-0.02em] text-navy transition-colors group-hover:text-blue">{author.name}</span>
      <span className="mt-1.5 block text-[15px] text-body">
        {[author.role, `${books.length} ${books.length === 1 ? "book" : "books"}`].filter(Boolean).join(", ")}
      </span>
    </Link>
  );
}
