// Manuscript upload rules, shared by the browser form and the upload route.
export const MANUSCRIPT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "application/x-zip-compressed",
];
export const MANUSCRIPT_EXTENSIONS = ".pdf,.doc,.docx,.zip";
export const MANUSCRIPT_MAX_BYTES = 20 * 1024 * 1024;


// What the author is sending (Dustin, 2026-11-24: a lighter way in than a complete manuscript).
// The site's secondary CTA, "Start With a Sample", opens the form with the sample chosen.
export const SENDING = ["The full manuscript", "Sample chapters", "A synopsis or outline", "A published (backlist) book"] as const;
export const SAMPLE_CHOICE = "Sample chapters";
/** These come as a file; a synopsis, an outline, or a published book may be described in the form instead. */
export const NEEDS_FILE: ReadonlySet<string> = new Set(["The full manuscript", "Sample chapters"]);
export const SAMPLE_HREF = "/submit-your-manuscript/?send=sample#submit";
