"use client";

import { useEffect, useState } from "react";

// The article's contents, with the section you're reading marked as you scroll.
export function ArticleToc({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items.map((t) => document.getElementById(t.id)).filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      // The current section is the last heading that has scrolled above a line near the top.
      const line = window.innerHeight * 0.3;
      let current = headings[0].id;
      for (const h of headings) {
        if (h.getBoundingClientRect().top - line <= 0) current = h.id;
        else break;
      }
      setActive(current);
    };
    const on = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [items]);

  return (
    <nav aria-label="In this article">
      <p className="font-display text-[15px] font-bold text-navy">In this article</p>
      <ol className="relative mt-4 border-l border-[#dfe5ee]">
        {items.map((t) => {
          const on = t.id === active;
          return (
            <li key={t.id} className="relative">
              <span
                aria-hidden="true"
                className={`absolute -left-[4px] top-[0.95em] h-[7px] w-[7px] rotate-45 rounded-[1px] bg-gold transition-[opacity,transform] duration-300 ${on ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
              />
              <a
                href={`#${t.id}`}
                aria-current={on ? "location" : undefined}
                className={`block py-1.5 pl-5 text-[15px] leading-[1.4] no-underline transition-colors hover:text-navy ${on ? "font-semibold text-navy" : "text-body"}`}
              >
                {t.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
