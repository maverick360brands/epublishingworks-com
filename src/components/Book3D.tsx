import Image from "next/image";

// A hardback in three-quarter view, built as a real 3D box: the cover sits on the front face,
// the back board on the back face, and the page block joins them along the right edge, so
// there is no gap between cover and pages at any angle. It turns toward the reader on hover.
const DEPTH = 26; // book thickness in px

export function Book3D({ src, alt, width, height, priority = false }: { src: string; alt: string; width: number; height: number; priority?: boolean }) {
  return (
    <div className="group/book mx-auto w-[230px] [perspective:1600px] sm:w-[280px] lg:w-[320px]">
      <div
        className="relative [transform-style:preserve-3d] [transform:rotateY(-26deg)_rotateX(3deg)] transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover/book:[transform:rotateY(-10deg)_rotateX(2deg)] motion-reduce:transition-none"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {/* Floor shadow */}
        <div aria-hidden="true" className="absolute inset-x-[6%] bottom-[-6%] h-[10%] rounded-[50%] bg-black/45 blur-xl [transform:translateZ(-30px)]" />

        {/* Back board */}
        <div aria-hidden="true" className="absolute inset-0 rounded-[3px] bg-[#0d1f3c]" style={{ transform: `translateZ(${-DEPTH / 2}px)` }} />

        {/* Page block: centered on the cover's right edge, turned 90° to span the book's depth. */}
        <div
          aria-hidden="true"
          className="absolute top-[1%] h-[98%] bg-[linear-gradient(90deg,#d9d1c0_0%,#f8f4ea_18%,#efe8d8_50%,#f8f4ea_82%,#d9d1c0_100%)]"
          style={{ width: DEPTH, left: `calc(100% - ${DEPTH / 2 + 2}px)`, transform: "rotateY(90deg)" }}
        >
          <div className="h-full w-full bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.05)_0px,rgba(0,0,0,0.05)_1px,transparent_1px,transparent_3px)]" />
        </div>

        {/* Spine edge on the left, so the box reads as solid from the side. */}
        <div aria-hidden="true" className="absolute left-0 top-0 h-full bg-[#0d1f3c]" style={{ width: DEPTH, transform: `translateX(${-DEPTH / 2}px) rotateY(-90deg)` }} />

        {/* Front cover */}
        <div className="absolute inset-0 overflow-hidden rounded-r-[4px] rounded-l-[2px] [backface-visibility:hidden]" style={{ transform: `translateZ(${DEPTH / 2}px)` }}>
          <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 1024px) 320px, (min-width: 640px) 280px, 230px" priority={priority} fetchPriority={priority ? "high" : undefined} className="block h-full w-full object-cover" />
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[5%] bg-gradient-to-r from-black/40 via-white/20 to-transparent" />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/20" />
        </div>
      </div>
    </div>
  );
}
