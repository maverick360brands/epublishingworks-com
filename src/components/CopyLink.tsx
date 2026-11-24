"use client";

import { useState } from "react";

// Copies the current page URL, for sharing an article.
export function CopyLink() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          /* Clipboard unavailable; the address bar still has the link. */
        }
      }}
      className="inline-flex items-center gap-2 rounded-full border-2 border-[#d9e2ef] px-4 py-2 text-[14px] font-semibold text-navy transition-colors hover:border-blue active:scale-95"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
        <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
      </svg>
      <span aria-live="polite">{copied ? "Link Copied" : "Copy Link"}</span>
    </button>
  );
}
