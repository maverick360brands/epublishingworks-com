import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { buildYear } from "@/lib/content";
import { site } from "@/lib/site";
import { ArrowRight, CalendarLine, Chat, Compass, Mail, Phone } from "./icons";

function Contact({ href, icon, children, external = false }: { href: string; icon: ReactNode; children: ReactNode; external?: boolean }) {
  const cls = "group flex items-center gap-3 text-white/85 no-underline transition-colors hover:text-white";
  const inner = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold transition-colors group-hover:bg-gold group-hover:text-navy">
        {icon}
      </span>
      {children}
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

// Footer on the Rise UP pattern: mission, menu, ways to get in touch, and the legal line.
export function Footer() {
  return (
    <footer className="bg-brand text-white">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 pb-12 pt-16 md:grid-cols-[1.4fr_0.8fr_1.2fr] lg:px-8">
        <div className="max-w-[380px]">
          <Link href="/" aria-label="Rise UP Publications home">
            <Image src="/images/site/logo-white.png" alt="Rise UP Publications" width={179} height={53} className="h-auto w-[179px]" />
          </Link>
          <p className="mt-6 text-[16px] leading-[1.6] text-white/75">
            Rise UP Publications supports Christian authors by streamlining the publishing process to transform the message of faith and redemption into
            globally shared, eternity-impacting books, eBooks, and audio.
          </p>
          <Link href="/contact/" className="btn btn-gold mt-7">
            Publish Your Book <ArrowRight />
          </Link>
        </div>
        <nav aria-label="Footer">
          <h2 className="type-kicker !text-gold">Explore</h2>
          <ul className="mt-5 space-y-2.5 text-[16px]">
            {[{ href: "/", label: "Home" }, ...site.nav, { href: "/newsletter/", label: "Newsletter" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/80 no-underline transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="type-kicker !text-gold">Talk With Us</h2>
          <ul className="mt-5 space-y-3.5 text-[16px] font-medium">
            <li>
              <Contact href={site.phoneHref} external icon={<Phone className="h-4 w-4" />}>
                {site.phone}
              </Contact>
            </li>
            <li>
              <Contact href={site.calendly.quickConnect} external icon={<CalendarLine className="h-4 w-4" />}>
                Schedule a Discovery Call
              </Contact>
            </li>
            <li>
              <Contact href="/coaching/" icon={<Compass className="h-4 w-4" />}>
                1:1 Publishing Coaching
              </Contact>
            </li>
            <li>
              <Contact href="/contact/" icon={<Chat className="h-4 w-4" />}>
                Send Us a Message
              </Contact>
            </li>
            <li>
              <Contact href="/newsletter/" icon={<Mail className="h-4 w-4" />}>
                Get the Author Letter
              </Contact>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-5 py-6 text-[14px] text-white/60 sm:flex-row sm:justify-between lg:px-8">
          <p>Copyright © {buildYear} Rise UP Publications</p>
          <p className="flex gap-5">
            <Link href="/privacy-policy/" className="text-white/60 no-underline hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms/" className="text-white/60 no-underline hover:text-white">
              Terms of Use
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
