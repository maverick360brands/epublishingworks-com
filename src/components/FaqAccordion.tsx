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
// Questions are h3 under a section's h2 (blog posts); the FAQ page, where they sit right under the H1, passes "h2".
export function FaqAccordion({ items, headingLevel: Q = "h3" }: { items: Faq[]; headingLevel?: "h2" | "h3" }) {
  return (
    <div className="space-y-[10px]">
      {items.map((f) => (
        <details
          key={f.q}
          className="faq-item group overflow-hidden rounded-[18px] border border-line bg-white transition-[border-color,box-shadow,background-color] duration-300 ease-out hover:border-blue/40 hover:shadow-[0_14px_32px_-26px_rgba(12,47,90,0.55)] open:border-blue/30 open:shadow-[0_18px_40px_-30px_rgba(12,47,90,0.45)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[18px] p-5 transition-colors duration-300 hover:bg-mist/70 focus-visible:outline-offset-[-2px] [&::-webkit-details-marker]:hidden">
            <Q className="font-display text-[19px] font-bold leading-[1.3] tracking-[-0.01em] text-navy transition-colors duration-300 group-hover:text-blue">{f.q}</Q>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist text-blue transition-[transform,background-color,color] duration-300 ease-out group-hover:bg-blue group-hover:text-white group-open:rotate-45 group-open:bg-blue group-open:text-white">
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
