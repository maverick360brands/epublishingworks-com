import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";
import { getPage } from "@/lib/content";

const page = getPage("privacy-policy");

export const metadata: Metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: "/privacy-policy/",
});

export default function PrivacyPage() {
  return <LegalPage page={page} />;
}
