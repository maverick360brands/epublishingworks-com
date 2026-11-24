"use client";

import { useState } from "react";

// Copies a value (an ISBN) and confirms in place.
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          /* Clipboard unavailable: the value stays selectable on the page. */
        }
      }}
      className="rounded-full border border-[#d9e2ef] px-2.5 py-0.5 text-[12px] font-semibold text-blue transition-colors hover:border-blue active:scale-95"
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
