"use client";

import { useEffect, useRef, useState } from "react";

// A number that counts up to its value once, the first time it scrolls into view. The server
// renders the final value (no script, no wait), and it stays put if it is already on screen when
// the page loads or the visitor prefers reduced motion. The caller keeps it out of the
// accessibility tree and states the value in words nearby.
export function CountUp({ to, duration = 1200 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return; // already visible: leave it be
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(0);
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setValue(Math.round(to * (1 - Math.pow(1 - t, 4))));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => (io.disconnect(), cancelAnimationFrame(frame));
  }, [to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
