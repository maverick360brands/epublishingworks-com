import type { Retailer } from "@/lib/content";

const ExternalArrow = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 11L11 5M6 5h5v5" />
  </svg>
);

const CartIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" />
    <circle cx="10" cy="20" r="1.3" />
    <circle cx="17" cy="20" r="1.3" />
  </svg>
);

/** Affiliate links (an Amazon Associates tag) are marked as sponsored, as Google asks. */
export const relFor = (url: string) => (/[?&](tag|affiliate|aff)=/i.test(url) ? "noopener sponsored" : "noopener");

// "Get Your Copy" buttons. Amazon (or the first listed store) is the main button; every other
// retailer gets a compact secondary button.
export function BuyButtons({ retailers, tone = "dark", lang = "en" }: { retailers: Retailer[]; tone?: "dark" | "light"; lang?: string }) {
  if (!retailers.length) return null;
  const primary = retailers.find((r) => r.name === "Buy Direct") ?? retailers.find((r) => r.name === "Amazon") ?? retailers[0];
  const rest = retailers.filter((r) => r !== primary);
  const es = lang === "es";
  const primaryLabel =
    primary.name === "Buy Direct" ? (es ? "Comprar directo de la editorial" : "Buy Direct From the Publisher") : es ? `Comprar en ${primary.name}` : `Buy on ${primary.name}`;
  const secondary =
    tone === "dark"
      ? "border-white/25 bg-white/[0.08] text-white hover:border-white/60 hover:bg-white/15 hover:text-white"
      : "border-[#d9e2ef] bg-white text-navy hover:border-blue hover:text-blue";

  return (
    <div>
      <a
        href={primary.url}
        target="_blank"
        rel={relFor(primary.url)}
        className="group btn btn-gold btn-lg w-full justify-between gap-4 text-[17px] sm:w-auto sm:min-w-[300px]"
      >
        <span className="flex items-center gap-3">
          <CartIcon />
          {primaryLabel}
        </span>
        <ExternalArrow />
      </a>
      {rest.length ? (
        <>
          <p className={`mt-5 text-[14px] ${tone === "dark" ? "text-white/70" : "text-body"}`}>{es ? "También disponible en" : "Also available at"}</p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {rest.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel={relFor(r.url)}
                  className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-semibold no-underline transition-colors active:scale-[0.97] ${secondary}`}
                >
                  {r.name}
                  <ExternalArrow />
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
