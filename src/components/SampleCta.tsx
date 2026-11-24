import Link from "next/link";
import { ArrowRight } from "./icons";
import { SAMPLE_HREF } from "@/lib/manuscript";

// The lighter way in, beside every "Submit Your Manuscript" (Dustin, 2026-11-24): an author can
// start with part of the book. Both open the submission form with "Sample chapters" chosen.

type Tone = "light" | "dark";

/** A secondary button next to a single primary CTA. */
export function SampleButton({ tone = "light", size = "lg", className = "" }: { tone?: Tone; size?: "lg" | "md" | "sm"; className?: string }) {
  const sizing = size === "lg" ? "btn-lg" : size === "sm" ? "!px-5 !py-3 !text-[15px]" : "";
  return (
    <Link href={SAMPLE_HREF} className={`btn ${tone === "dark" ? "btn-ghost-light" : "btn-ghost"} ${sizing} ${className}`}>
      Start With a Sample <ArrowRight />
    </Link>
  );
}

/** One line under CTAs that already have two buttons, or where space is tight. */
export function SampleNote({ tone = "light", className = "" }: { tone?: Tone; className?: string }) {
  return (
    <p className={`text-[15px] leading-[1.55] ${tone === "dark" ? "text-white/80" : "text-body"} ${className}`}>
      Not ready to send the whole book?{" "}
      <Link
        href={SAMPLE_HREF}
        className={`font-semibold underline decoration-2 underline-offset-4 ${tone === "dark" ? "text-white decoration-gold hover:text-gold focus-visible:outline-white" : "text-navy decoration-gold hover:text-blue"}`}
      >
        Start with a sample
      </Link>
      : a few chapters, a synopsis, or an outline.
    </p>
  );
}
