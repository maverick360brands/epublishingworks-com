import Image from "next/image";
import Link from "next/link";

export type HeroFace = { slug: string; name: string; url: string; photo: string };

// Top of the authors directory (Dustin, 2026-11-25: "the top section needs to be reimagined").
// The title and intro sit beside a roll call of the people we publish: blue-duotone portraits
// that come into focus once on load and bloom into color under the pointer. The faces are a
// mouse shortcut to each author; the directory below is the accessible list of every author.
export function AuthorsHero({
  title,
  intro,
  faces,
  authorCount,
  bookCount,
}: {
  title: string;
  intro: string;
  faces: HeroFace[];
  authorCount: number;
  bookCount: number;
}) {
  const wall = faces.slice(0, 20);
  const strip = faces.slice(0, 7);
  return (
    <section className="bg-brand relative overflow-hidden">
      <div className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-5 pb-14 pt-12 md:pb-16 md:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16 lg:px-8 lg:pb-20 lg:pt-20">
        <div>
          <span aria-hidden="true" className="mb-5 block h-[4px] w-14 rounded-full bg-gold" />
          <h1 className="font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.035em] text-white sm:text-[54px] lg:text-[62px]">{title}</h1>
          <p className="mt-4 max-w-[560px] text-[18px] leading-[1.6] text-white/80">{intro}</p>
          <p className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[16px] text-white/85">
            <span>
              <strong className="font-display text-[22px] font-extrabold tabular-nums text-gold">{authorCount}</strong> authors
            </span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/40" />
            <span>
              <strong className="font-display text-[22px] font-extrabold tabular-nums text-gold">{bookCount}</strong> books
            </span>
          </p>

          {/* Phones: an overlapping row of faces instead of the wall. */}
          <div aria-hidden="true" className="mt-8 flex items-center lg:hidden">
            {strip.map((f, i) => (
              <span
                key={f.slug}
                className="roll-call relative -ml-3 block h-12 w-12 overflow-hidden rounded-full border-[3px] border-navy-deep bg-blue first:ml-0"
                style={{ animationDelay: `${i * 60}ms`, zIndex: strip.length - i }}
              >
                <Image src={f.photo} alt="" fill sizes="48px" className="object-cover object-top grayscale" />
                <span className="absolute inset-0 bg-blue/40 mix-blend-multiply" />
              </span>
            ))}
            <span className="-ml-3 flex h-12 items-center rounded-full border-[3px] border-navy-deep bg-gold px-3 font-display text-[14px] font-extrabold text-navy">
              +{Math.max(authorCount - strip.length, 0)}
            </span>
          </div>
        </div>

        {/* Desktop: the roll call. */}
        <div aria-hidden="true" className="hidden grid-cols-5 gap-3 lg:grid">
          {wall.map((f, i) => (
            <Link
              key={f.slug}
              href={f.url}
              tabIndex={-1}
              title={f.name}
              className={`roll-call group relative block aspect-square overflow-hidden rounded-[18px] bg-blue ${(i % 5) % 2 ? "translate-y-6" : ""}`}
              style={{ animationDelay: `${(i % 5) * 70 + Math.floor(i / 5) * 90}ms` }}
            >
              <Image
                src={f.photo}
                alt=""
                fill
                sizes="96px"
                priority={i < 10}
                className="object-cover object-top grayscale transition-[filter,transform] duration-500 ease-out group-hover:scale-[1.06] group-hover:grayscale-0"
              />
              <span className="absolute inset-0 bg-blue/45 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
