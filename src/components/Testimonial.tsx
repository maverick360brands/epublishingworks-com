import Image from "next/image";
import type { Testimonial as T } from "@/lib/site";
import { Star } from "./icons";

// Testimonial card: a circular photo (on top or at the left), the quote, the author's name,
// and a speech-bubble tail.
export function Testimonial({ t, layout = "top" }: { t: T; layout?: "top" | "left" }) {
  const photo = t.photo ? (
    <Image src={t.photo} alt={`Photo of ${t.name}`} width={150} height={150} className="h-[150px] w-[150px] shrink-0 rounded-full object-cover" />
  ) : null;
  const body = (
    <>
      <blockquote className="text-[16px] leading-[1.65] text-body">
        {t.quote.split(/\n\n+/).map((p, i) => (
          <p key={i} className={i ? "mt-[17px]" : ""}>
            {p}
          </p>
        ))}
      </blockquote>
      <p className="mb-[5px] mt-[10px] font-display text-[15px] font-bold uppercase leading-[16.5px] text-navy md:text-[24px] md:leading-[26.4px]">{t.name}</p>
    </>
  );
  return (
    <figure className={`relative ${layout === "top" ? "pt-[75px]" : ""}`}>
      <div className="relative rounded-[24px] bg-white px-6 pb-7 shadow-[0_1px_2px_rgba(13,31,60,0.06),0_20px_40px_-28px_rgba(13,31,60,0.4)] md:px-10">
        {layout === "top" ? (
          <>
            <div className="absolute left-1/2 top-[-75px] -translate-x-1/2">{photo}</div>
            <div className="pt-[95px]">{body}</div>
          </>
        ) : (
          <div className="flex flex-col gap-5 pt-5 md:flex-row md:gap-[20px]">
            {photo}
            <div>{body}</div>
          </div>
        )}
        <span aria-hidden="true" className="absolute left-[60px] top-full h-0 w-0 border-r-[18px] border-t-[18px] border-r-transparent border-t-white" />
      </div>
    </figure>
  );
}

export function StarsHeading({ withText = true, text = "What our authors are saying" }: { withText?: boolean; text?: string }) {
  const Tag = withText ? "h2" : "div";
  return (
    <Tag className="flex flex-wrap items-center justify-center gap-x-3 text-center font-display text-[32px] font-bold leading-[38.4px] text-navy">
      <span className="flex gap-[6px] text-[#f4a62a]" role="img" aria-label="5 out of 5 stars">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-[22px] w-[22px]" />
        ))}
      </span>
      {withText ? <span>{text}&hellip;</span> : null}
    </Tag>
  );
}
