import Image from "next/image";
import Link from "next/link";
import type { Testimonial as T } from "@/lib/site";
import { Star } from "./icons";

// Testimonial authors link to their author page.
const authorUrl = (slug: string) => `/authors/${slug}/`;

// Testimonial card: a circular photo (on top or at the left), five stars, the pull-quote headline,
// the quote, and the author's name and title.
export function Testimonial({ t, layout = "top" }: { t: T; layout?: "top" | "left" }) {
  const photo = t.photo ? (
    <Image src={t.photo} alt={`Photo of ${t.name}`} width={150} height={150} className="h-[120px] w-[120px] shrink-0 rounded-full object-cover ring-4 ring-white md:h-[140px] md:w-[140px]" />
  ) : null;
  const name = t.authorSlug ? (
    <Link href={authorUrl(t.authorSlug)} className="text-navy no-underline hover:text-blue">
      {t.name}
    </Link>
  ) : (
    t.name
  );
  const body = (
    <>
      <span className="flex gap-1 text-gold" role="img" aria-label="5 out of 5 stars">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-[18px] w-[18px]" />
        ))}
      </span>
      {t.headline ? <p className="mt-4 font-display text-[20px] font-bold leading-[1.3] tracking-[-0.01em] text-navy">{t.headline}</p> : null}
      <blockquote className="mt-3 text-[16px] leading-[1.7] text-body">
        {t.quote.split(/\n\n+/).map((p, i) => (
          <p key={i} className={i ? "mt-3" : ""}>
            {p}
          </p>
        ))}
      </blockquote>
      <figcaption className="mt-5">
        <span className="block font-display text-[17px] font-bold text-navy">{name}</span>
        {t.role ? <span className="block text-[14px] text-gold-ink">{t.role}</span> : null}
      </figcaption>
    </>
  );
  return (
    <figure className={`relative ${layout === "top" ? "pt-[60px] md:pt-[70px]" : ""}`}>
      <div className="relative rounded-[24px] bg-white px-6 pb-7 shadow-[0_1px_2px_rgba(12,47,90,0.06),0_20px_40px_-28px_rgba(12,47,90,0.4)] md:px-9">
        {layout === "top" ? (
          <>
            <div className="absolute left-1/2 top-[-60px] -translate-x-1/2 md:top-[-70px]">{photo}</div>
            <div className="pt-[76px] md:pt-[86px]">{body}</div>
          </>
        ) : (
          <div className="flex flex-col gap-5 pt-6 md:flex-row md:gap-[24px]">
            {photo}
            <div>{body}</div>
          </div>
        )}
      </div>
    </figure>
  );
}

export function StarsHeading({ withText = true, text = "What our authors are saying" }: { withText?: boolean; text?: string }) {
  const Tag = withText ? "h2" : "div";
  return (
    <Tag className="flex flex-wrap items-center justify-center gap-x-3 text-center font-display text-[32px] font-bold leading-[38.4px] text-navy">
      <span className="flex gap-[6px] text-gold" role="img" aria-label="5 out of 5 stars">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-[22px] w-[22px]" />
        ))}
      </span>
      {withText ? <span>{text}&hellip;</span> : null}
    </Tag>
  );
}
