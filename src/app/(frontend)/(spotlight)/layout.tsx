import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

// Book spotlight pages are standalone landing pages (authors link to them directly), so
// they skip the main menu: a slim frosted bar with the logo and a way to more books.
export default function SpotlightLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/75 shadow-[0_1px_0_rgba(12,47,90,0.08)] backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-[64px] max-w-[1320px] items-center justify-between px-5 lg:px-8">
          <Link href="/" aria-label={`${site.name} home`}>
            <Image src={site.logo.src} alt={site.name} width={site.logo.width} height={site.logo.height} sizes="200px" priority className="h-auto w-[170px] sm:w-[200px]" />
          </Link>
          <nav aria-label="Books" className="flex items-center gap-1">
            <Link href="/authors/" className="hidden rounded-full px-4 py-2 font-display text-[15px] font-bold text-navy no-underline transition-colors hover:bg-blue/10 hover:text-blue sm:block">
              Authors
            </Link>
            <Link href="/books/" className="rounded-full px-4 py-2 font-display text-[15px] font-bold text-navy no-underline transition-colors hover:bg-blue/10 hover:text-blue">
              More books
            </Link>
          </nav>
        </div>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
