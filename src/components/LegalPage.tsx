import type { Page } from "@/lib/content";

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

// Privacy Policy and Terms of Use: brand banner, last-updated date, a sticky contents list.
export function LegalPage({ page }: { page: Page }) {
  return (
    <>
      <section className="bg-brand px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="type-display text-[40px] text-white md:text-[56px]">{page.title}</h1>
          <p className="type-lead mt-4 max-w-[640px] text-white/80">{page.description}</p>
          {page.updated ? <p className="mt-5 text-[15px] text-white/70">Last updated {fmt(page.updated)}</p> : null}
        </div>
      </section>
      <div className="px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
          <nav aria-label="On this page" className="self-start lg:sticky lg:top-28">
            <h2 className="type-kicker">On this page</h2>
            <ol className="mt-4 space-y-2 border-l-2 border-[#e2e8f1] text-[15px]">
              {page.toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="-ml-[2px] block border-l-2 border-transparent py-0.5 pl-4 text-body no-underline hover:border-gold hover:text-navy">
                    {t.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="article-body max-w-[70ch] [&_h2:first-child]:mt-0" dangerouslySetInnerHTML={{ __html: page.html }} />
        </div>
      </div>
    </>
  );
}
