import Image from "next/image";

// Article thumbnail in the brand's language: the blues of the logo, a category tint, the
// reversed logo mark, and the category name set large. No stock photography required.
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
      <div className={`absolute inset-x-0 bottom-0 ${large ? "p-10" : "p-6"}`}>
        <span className={`font-display font-extrabold leading-none tracking-[-0.03em] text-white/90 ${large ? "text-[52px] md:text-[68px]" : "text-[32px]"}`}>{category}</span>
      </div>
    </div>
  );
}
