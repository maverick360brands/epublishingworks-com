"use client";

import Image from "next/image";
import { useRef } from "react";

// A book cover that tilts toward the pointer like a hardback being picked up: spine
// highlight on the left edge, page block on the right, and a shadow that deepens on hover.
export function TiltCover({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 14}deg) rotateX(${y * -10}deg) translateY(-6px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <span className={`block [perspective:900px] ${className}`} onPointerMove={move} onPointerLeave={reset}>
      <span
        ref={ref}
        className="relative block rounded-r-[4px] rounded-l-[2px] shadow-[0_2px_4px_rgba(13,31,60,0.18),0_14px_28px_-12px_rgba(13,31,60,0.45)] transition-[transform,box-shadow] duration-300 ease-out [transform-style:preserve-3d] group-hover:shadow-[0_4px_8px_rgba(13,31,60,0.2),0_28px_40px_-14px_rgba(13,31,60,0.55)] motion-reduce:transition-none"
      >
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} className="block h-auto w-full rounded-r-[4px] rounded-l-[2px]" />
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[7%] rounded-l-[2px] bg-gradient-to-r from-black/30 via-white/20 to-transparent" />
        <span aria-hidden="true" className="absolute inset-0 rounded-r-[4px] bg-gradient-to-br from-white/15 via-transparent to-black/10" />
      </span>
    </span>
  );
}
