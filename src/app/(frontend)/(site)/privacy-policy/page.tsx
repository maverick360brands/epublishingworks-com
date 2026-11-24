import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getPage } from "@/lib/content";

const page = getPage("privacy-policy");

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/privacy-policy/" },
};

export default function PrivacyPage() {
  return <LegalPage page={page} />;
}
