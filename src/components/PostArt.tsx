import Image from "next/image";

// Fallback thumbnail for a post with no cover or illustration: the blues of the logo, a category
// tint, the reversed logo mark, and the category as a small label (set large, it outweighed the
// post titles beside it; Dustin, 2026-11-24).
const TINTS: Record<string, string> = {
  Publishing: "from-navy-deep via-blue to-blue",
  Writing: "from-blue via-[#1f63b8] to-sky",
  "Royalties & Rights": "from-navy-deep via-navy to-blue",
  "Book Marketing": "from-[#0a3a7a] via-blue to-sky",
  "For Readers": "from-sky via-blue to-navy-deep",
};

export function PostArt({ category, large = false }: { category: string; large?: boolean }) {
  return (
    <div aria-hidden="true" className={`brand-texture relative isolate overflow-hidden bg-gradient-to-br ${TINTS[category] ?? TINTS.Publishing} ${large ? "aspect-[16/10] rounded-[32px]" : "aspect-[16/10] rounded-[24px]"}`}>
      <Image src="/images/site/logo-icon-reversed.png" alt="" width={500} height={500} className={`absolute ${large ? "right-6 top-6 h-28 w-28" : "right-3 top-3 h-16 w-16"}`} />
      <span
        className={`absolute bottom-0 left-0 rounded-tr-[18px] bg-white font-display font-bold text-navy ${large ? "px-5 pb-2 pt-3 text-[15px]" : "px-4 pb-1.5 pt-2.5 text-[13px]"}`}
      >
        {category}
      </span>
    </div>
  );
}
