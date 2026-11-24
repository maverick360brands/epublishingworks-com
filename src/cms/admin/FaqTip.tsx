"use client";

import { useFormFields } from "@payloadcms/ui";

// A nudge on posts with no FAQs: answer engines often quote short question-and-answer pairs.
export function FaqTip() {
  const rows = useFormFields(([fields]) => Number(fields.faqs?.rows?.length ?? fields.faqs?.value ?? 0));
  if (rows > 0) return null;
  return (
    <p style={{ margin: "0 0 12px", padding: "10px 14px", borderRadius: 8, background: "#fff8e1", color: "#5c4400", fontSize: 13 }}>
      Tip: add 2–3 FAQs. Answer engines quote them, and they show as a FAQ section on the post.
    </p>
  );
}
