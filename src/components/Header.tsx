"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { SampleButton } from "./SampleCta";
import { ArrowRight, Bars, Close } from "./icons";

type Pill = { x: number; w: number; visible: boolean; hover: boolean };

// Sticky header that turns to frosted glass on scroll. A single pill glides between menu
// items on hover, leans slightly toward the cursor, and rests on the current page.
export function Header() {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const [scrolled, setScrolled] = useState(false);

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [pill, setPill] = useState<Pill>({ x: 0, w: 0, visible: false, hover: false });
  const [lean, setLean] = useState(0);

  const isActive = useCallback(
    (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href)),
    [pathname],
  );
  const activeIndex = site.nav.findIndex((n) => isActive(n.href));

  const pillTo = useCallback((i: number, hover: boolean) => {
    const el = itemRefs.current[i];
    if (!el) return;
    setPill({ x: el.offsetLeft, w: el.offsetWidth, visible: true, hover });
  }, []);

  const rest = useCallback(() => {
    setLean(0);
    if (activeIndex >= 0) pillTo(activeIndex, false);
    else setPill((p) => ({ ...p, visible: false, hover: false }));
  }, [activeIndex, pillTo]);

  // Place the pill on the current page after navigation and on resize.
  useEffect(() => {
    const id = requestAnimationFrame(rest);
    window.addEventListener("resize", rest);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", rest);
    };
  }, [rest]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open
          ? "bg-white/70 shadow-[0_1px_0_rgba(12,47,90,0.08),0_10px_30px_-18px_rgba(12,47,90,0.35)] backdrop-blur-xl backdrop-saturate-150"
          : "bg-white"
      }`}
    >
      <div className={`mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 xl:gap-6 transition-[height] duration-300 lg:px-8 ${scrolled ? "h-[68px]" : "h-[72px] lg:h-[88px]"}`}>
        <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
          <Image
            src={site.logo.src}
            alt={site.name}
            width={site.logo.width}
            height={site.logo.height}
            priority
            sizes="240px"
            className={`h-auto transition-[width] duration-300 ${scrolled ? "w-[180px] xl:w-[200px]" : "w-[180px] xl:w-[230px]"}`}
          />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul ref={listRef} className="relative flex items-center" onMouseLeave={rest}>
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-0 left-0 rounded-full transition-[transform,width,opacity,background-color] duration-300 ease-[cubic-bezier(0.3,1.3,0.5,1)] ${
                pill.hover ? "bg-blue/10" : "bg-gold/30"
              }`}
              style={{ width: pill.w, transform: `translateX(${pill.x + lean}px)`, opacity: pill.visible ? 1 : 0 }}
            />
            {site.nav.map((item, i) => (
              <li
                key={item.href}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="relative"
                onMouseEnter={() => pillTo(i, true)}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setLean(((e.clientX - r.left) / r.width - 0.5) * 8);
                }}
              >
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onFocus={() => pillTo(i, true)}
                  onBlur={rest}
                  className="relative block rounded-full px-[10px] py-[9px] font-display text-[15px] font-bold tracking-[-0.01em] text-navy no-underline hover:text-blue focus-visible:outline-offset-0 xl:px-[14px]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/submit-your-manuscript/" className="btn btn-gold group/cta hidden whitespace-nowrap sm:inline-flex lg:max-xl:!px-4">
            Get Started
            <ArrowRight className="h-[1em] w-[1.15em] transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5" />
          </Link>
          <button
            type="button"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-blue text-white transition-transform active:scale-95 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            {open ? <Close /> : <Bars />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpenOn(null);
        }}
        className="border-t border-blue/10 lg:hidden"
      >
        <ul className="mx-auto max-w-[1320px] px-5 py-3">
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 font-display text-[17px] font-bold no-underline ${
                  isActive(item.href) ? "bg-gold/30 text-navy" : "text-navy"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 sm:hidden">
            <Link href="/submit-your-manuscript/" className="btn btn-gold btn-lg w-full">
              Get Started <ArrowRight />
            </Link>
          </li>
          <li className="mt-2">
            <SampleButton className="w-full" />
          </li>
        </ul>
      </nav>
    </header>
  );
}
