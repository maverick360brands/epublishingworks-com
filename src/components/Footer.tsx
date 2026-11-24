import Image from "next/image";
import Link from "next/link";
import { buildYear } from "@/lib/content";
import { site } from "@/lib/site";
import { SampleNote } from "./SampleCta";
import { ArrowRight, Mail, Phone } from "./icons";

const linkCls = "text-white/80 no-underline transition-colors hover:text-white";

// Footer: mission, two menus, contact details, and the legal line (including the Amazon
// Associates disclosure the program requires, carried over from WordPress).
export function Footer() {
  const { street, city, region, postalCode } = site.address;
  return (
    <footer className="bg-brand text-white">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 pb-12 pt-16 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.1fr] lg:px-8">
        <div className="max-w-[380px]">
          <Link href="/" aria-label={`${site.name} home`}>
            <Image src={site.logoReversed.src} alt={site.name} width={site.logoReversed.width} height={site.logoReversed.height} sizes="230px" className="h-auto w-[230px]" />
          </Link>
          <p className="mt-6 text-[16px] leading-[1.6] text-white/75">
            Write, publish, prosper. An author-first publisher since 2011: our authors earn 80% to 85% royalties while we handle covers, sales copy, distribution, and
            promotion.
          </p>
          <Link href="/submit-your-manuscript/" className="btn btn-gold mt-7">
            Submit Your Manuscript <ArrowRight />
          </Link>
          <SampleNote tone="dark" className="mt-4 !text-[14px]" />
        </div>
        <nav aria-label="For authors">
          <h2 className="type-kicker !text-gold">For authors</h2>
          <ul className="mt-5 space-y-2.5 text-[16px]">
            {site.footerNav.authors.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Explore">
          <h2 className="type-kicker !text-gold">Explore</h2>
          <ul className="mt-5 space-y-2.5 text-[16px]">
            {site.footerNav.explore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="type-kicker !text-gold">Talk with us</h2>
          <ul className="mt-5 space-y-3.5 text-[16px] font-medium">
            <li>
              <a href={site.phoneHref} className="group flex items-center gap-3 text-white/85 no-underline hover:text-white">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold transition-colors group-hover:bg-gold group-hover:text-navy">
                  <Phone className="h-4 w-4" />
                </span>
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="group flex items-center gap-3 text-white/85 no-underline hover:text-white">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold transition-colors group-hover:bg-gold group-hover:text-navy">
                  <Mail className="h-4 w-4" />
                </span>
                {site.email}
              </a>
            </li>
          </ul>
          <address className="mt-5 text-[15px] not-italic leading-[1.6] text-white/70">
            {street}
            <br />
            {city}, {region} {postalCode}
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1320px] space-y-3 px-5 py-6 text-[14px] text-white/60 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <p>
              &copy; Copyright {buildYear} {site.name}. All rights reserved.
            </p>
            <p>
              <Link href="/privacy-policy/" className="text-white/60 no-underline hover:text-white">
                Privacy Policy &amp; Terms of Use
              </Link>
            </p>
          </div>
          <p className="max-w-[900px] text-[13px] leading-[1.5] text-white/50">
            ePublishing Works is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn
            advertising fees by advertising and linking to amazon.com.
          </p>
        </div>
      </div>
    </footer>
  );
}
