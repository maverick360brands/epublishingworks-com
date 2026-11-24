"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type Slide = { src: string; alt: string; width: number; height: number };

// Keep the active slide inside the five visible thumbnails.
const thumbStart = (index: number, count: number) => Math.max(0, Math.min(index - 2, count - 5));

// Replaces the PowerPack image carousels: one slide at a time, advancing every 5 seconds
// (paused on hover, keyboard focus, or when the visitor prefers reduced motion), with an
// optional strip of thumbnails underneath.
export function Carousel({
  slides,
  thumbnails = false,
  fit = "cover",
  className = "",
  frameClassName = "h-[400px]",
  sizes,
  priorityFirst = false,
  label,
}: {
  slides: Slide[];
  thumbnails?: boolean;
  fit?: "cover" | "contain";
  className?: string;
  frameClassName?: string;
  sizes: string;
  priorityFirst?: boolean;
  label: string;
}) {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <div
      className={className}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <div className={`relative overflow-hidden ${frameClassName}`}>
        {slides.map((s, i) => (
          <div
            key={s.src}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes={sizes}
              priority={priorityFirst && i === 0}
              className={fit === "cover" ? "object-cover" : "object-contain"}
            />
          </div>
        ))}
      </div>
      {thumbnails ? (
        <div className="mt-[10px] grid grid-cols-5 gap-[10px]">
          {slides.map((s, i) => ({ s, i })).slice(thumbStart(index, slides.length), thumbStart(index, slides.length) + 5).map(({ s, i }) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}: ${s.alt}`}
              aria-current={i === index}
              className={`relative h-[76px] overflow-hidden transition-opacity ${i === index ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
            >
              <Image src={s.src} alt="" fill sizes="90px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
