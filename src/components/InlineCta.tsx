import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./icons";
import type { InlineCta as Cta } from "@/lib/inline-cta";
import { site } from "@/lib/site";

// A note in the middle of an article: what we can help with next, and one button.
export function InlineCta({ cta }: { cta: Cta }) {
  return (
    <aside aria-label={`A note from ${site.name}`} className="relative my-12 overflow-hidden rounded-[28px] bg-navy-deep px-7 py-8 text-white md:px-9 md:py-9">
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
        <Image src={site.logoMark.src} alt="" width={site.logoMark.width} height={site.logoMark.height} className="h-[64px] w-[64px] shrink-0 object-contain" />
        <div className="min-w-0">
          <p className="text-balance font-display text-[24px] font-extrabold leading-[1.15] tracking-[-0.02em] md:text-[26px]">{cta.heading}</p>
          <p className="mt-3 text-[17px] leading-[1.6] text-white/85">{cta.text}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link href={cta.cta.href} className="group/cta btn btn-gold !px-6 !py-3 !text-[16px] !no-underline">
              {cta.cta.label} <ArrowRight className="h-[0.9em] w-[1em] transition-transform group-hover/cta:translate-x-0.5" />
            </Link>
            <span className="text-[14px] text-white/70">{cta.note}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
