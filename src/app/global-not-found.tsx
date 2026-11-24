// The 404 page for addresses that match no route. With separate root layouts for the site
// and the admin, Next.js renders this file on its own, so it brings its own html, fonts, and styles.
import type { Metadata } from "next";
import "./globals.css";
import { fontClassName } from "./fonts";
import NotFound, { metadata as notFoundMetadata } from "./(frontend)/not-found";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  ...notFoundMetadata,
  metadataBase: new URL(site.url),
  title: `Page not found | ${site.name}`,
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontClassName}>
      <body className="flex min-h-screen flex-col">
        <NotFound />
      </body>
    </html>
  );
}
