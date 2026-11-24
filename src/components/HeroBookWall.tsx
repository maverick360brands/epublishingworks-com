"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export type WallBook = { src: string; alt: string; width: number; height: number; href?: string };

// Each column drifts at its own speed as the page scrolls (negative = against the scroll).
const SPEEDS = [-0.22, 0.12, -0.32, 0.06, -0.16];

// A tilted wall of book covers. Columns move at different speeds on scroll, and the whole
// wall leans toward the pointer. Motion is written to CSS variables once per animation frame
// (no React re-renders), and it stays still for visitors who prefer reduced motion.
export function HeroBookWall({ columns, className = "" }: { columns: WallBook[][]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };

    const tick = () => {
      frame = 0;
      current = { x: current.x + (target.x - current.x) * 0.08, y: current.y + (target.y - current.y) * 0.08 };
      el.style.setProperty("--scroll", `${window.scrollY}px`);
      el.style.setProperty("--lean-x", `${current.x.toFixed(3)}deg`);
      el.style.setProperty("--lean-y", `${current.y.toFixed(3)}deg`);
      if (Math.abs(target.x - current.x) > 0.01 || Math.abs(target.y - current.y) > 0.01) frame = requestAnimationFrame(tick);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onPointer = (e: PointerEvent) => {
      target = { x: (e.clientY / window.innerHeight - 0.5) * -6, y: (e.clientX / window.innerWidth - 0.5) * 8 };
      request();
    };

    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none select-none [perspective:1600px] ${className}`}>
      <div
        className="grid h-full w-full gap-4 [transform:rotateX(calc(18deg+var(--lean-x,0deg)))_rotateY(var(--lean-y,0deg))_rotateZ(-12deg)] sm:gap-5"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
      >
        {columns.map((col, c) => (
          <div
            key={c}
            className="flex flex-col gap-4 will-change-transform sm:gap-5"
            style={{
              transform: `translateY(calc(${c % 2 ? -60 : -220}px + var(--scroll, 0px) * ${SPEEDS[c % SPEEDS.length]}))`,
            }}
          >
            {col.map((b, i) => {
              const cover = (
                <span className="relative block overflow-hidden rounded-[4px] shadow-[0_18px_30px_-12px_rgba(0,0,0,0.65)]">
                  <Image
                    src={b.src}
                    alt=""
                    width={b.width}
                    height={b.height}
                    sizes="(min-width: 1024px) 190px, 120px"
                    loading="lazy"
                    className="block h-auto w-full"
                  />
                  {/* Spine highlight so each cover reads as a book, not a flat tile. */}
                  <span className="absolute inset-y-0 left-0 w-[9%] bg-gradient-to-r from-black/35 via-white/15 to-transparent" />
                </span>
              );
              return b.href ? (
                <Link key={`${b.src}-${i}`} href={b.href} tabIndex={-1} className="pointer-events-auto block transition-transform duration-300 hover:-translate-y-1">
                  {cover}
                </Link>
              ) : (
                <span key={`${b.src}-${i}`}>{cover}</span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
