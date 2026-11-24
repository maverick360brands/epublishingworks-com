import Link from "next/link";
import type { ReactNode } from "react";
import type { Faq } from "@/lib/site";
import { Plus } from "./icons";

/** The answer's paragraphs, with the link label turned into a link where it appears (else appended). */
function Answer({ f }: { f: Faq }) {
  const link = (label: string) => {
    if (!f.link) return label;
    const external = /^https?:\/\//.test(f.link.href);
    return external ? (
      <a href={f.link.href} target="_blank" rel="noopener" className="text-blue underline">
        {label}
      </a>
    ) : (
      <Link href={f.link.href} className="text-blue underline">
        {label}
      </Link>
    );
  };
  const paragraphs = f.a.split(/\n\n+/);
  const placed = f.link ? paragraphs.some((p) => p.includes(f.link!.label)) : true;
  return (
    <>
      {paragraphs.map((p, i) => {
        let content: ReactNode = p;
        if (f.link && p.includes(f.link.label)) {
          const [before, ...after] = p.split(f.link.label);
          content = (
            <>
              {before}
              {link(f.link.label)}
              {after.join(f.link.label)}
            </>
          );
        }
        return (
          <p key={i} className={i ? "mt-3" : ""}>
            {content}
            {!placed && i === paragraphs.length - 1 && f.link ? <> {link(f.link.label)}</> : null}
          </p>
        );
      })}
    </>
  );
}

// Bordered rounded items with the question and a plus icon. Native <details> keeps every answer
// in the HTML for search and answer engines.
export function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <div className="space-y-[10px]">
      {items.map((f) => (
        <details key={f.q} className="group overflow-hidden rounded-[18px] border border-line bg-white transition-shadow open:shadow-[0_18px_40px_-30px_rgba(12,47,90,0.45)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
            <h3 className="font-display text-[19px] font-bold leading-[1.3] tracking-[-0.01em] text-navy">{f.q}</h3>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist text-blue transition-transform group-open:rotate-45">
              <Plus className="h-4 w-4" />
            </span>
          </summary>
          <div className="px-5 pb-6 text-[17px] leading-[1.65] text-ink">
            <Answer f={f} />
          </div>
        </details>
      ))}
    </div>
  );
}
