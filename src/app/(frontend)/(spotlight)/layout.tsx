import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";

// Book spotlight pages are standalone landing pages (authors link to them directly), so
// they skip the main menu: a slim frosted bar with the logo and a way to more books.
export default function SpotlightLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/75 shadow-[0_1px_0_rgba(21,45,82,0.08)] backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-[64px] max-w-[1320px] items-center justify-between px-5 lg:px-8">
          <Link href="/" aria-label="Rise UP Publications home">
            <Image src="/images/site/logo.png" alt="Rise UP Publications" width={200} height={59} priority className="h-auto w-[140px]" />
          </Link>
          <Link href="/books/" className="rounded-full px-4 py-2 font-display text-[13px] font-bold uppercase tracking-[1.2px] text-blue no-underline transition-colors hover:bg-blue/10 hover:text-navy">
            More books
          </Link>
        </div>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
