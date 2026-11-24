import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "../globals.css";
import { fontClassName } from "../fonts";
import { JsonLd } from "@/components/JsonLd";
import { graph, organizationSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.homeTitle,
    template: "%s | ePublishingWorks",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    images: [{ url: "/images/site/social-share.jpg", width: 1200, height: 675, alt: site.name }],
  },
  twitter: { card: "summary_large_image" },
  // Search Console ownership, carried over from the WordPress site so the property keeps working.
  verification: { google: "imiJzeMIxugvG_OLrrWL9IVqiQQ_Wyi9cPElAQOsm8o" },
  alternates: {
    types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: "ePublishingWorks blog" }] },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontClassName}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-5 focus:py-2 focus:font-semibold focus:text-navy"
        >
          Skip to content
        </a>
        {children}
        <JsonLd data={graph(organizationSchema(), websiteSchema())} />
        {/* Production only: staging and previews never load analytics. */}
        {site.ga4Id && process.env.VERCEL_ENV === "production" ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.ga4Id}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${site.ga4Id}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
