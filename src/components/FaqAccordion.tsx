import Link from "next/link";
import type { Faq } from "@/lib/site";
import { Plus } from "./icons";

// PowerPack FAQ module: bordered rounded items with a navy-blue question and a plus icon.
// Native <details> keeps every answer in the HTML for search and answer engines.
export function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <div className="space-y-[10px]">
      {items.map((f) => (
        <details key={f.q} className="group overflow-hidden rounded-[15px] border border-[#f2efef] bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
            <h3 className="font-display text-[20px] font-bold leading-[23.8px] text-blue">{f.q}</h3>
            <Plus className="h-4 w-4 shrink-0 text-body transition-transform group-open:rotate-45" />
          </summary>
          <div className="px-5 pb-5 text-[17px] leading-[23.8px] text-[#1c1c1c]">
            <p>
              {f.a}
              {f.link ? (
                <>
                  {" "}
                  <Link href={f.link.href} className="text-blue underline">
                    {f.link.label}
                  </Link>
                </>
              ) : null}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
