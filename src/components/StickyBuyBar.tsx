"use client";

import { useEffect, useState } from "react";

// On phones, once the buy buttons scroll out of view, a bar offers to jump back to them.
export function StickyBuyBar({ targetId, title }: { targetId: string; title: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(target);
    return () => io.disconnect();
  }, [targetId]);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-blue/10 bg-white/85 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="truncate font-display text-[14px] font-bold text-navy">{title}</p>
        <a href={`#${targetId}`} tabIndex={show ? 0 : -1} className="btn btn-gold shrink-0">
          Get Your Copy
        </a>
      </div>
    </div>
  );
}
