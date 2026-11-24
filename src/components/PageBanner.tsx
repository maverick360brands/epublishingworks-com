import type { ReactNode } from "react";

// Page heading band on the Rise UP pattern. Gold rule, white title, optional intro line.
export function PageBanner({
  children,
  intro,
  as: Tag = "h1",
  align = "left",
  actions,
}: {
  children: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "p";
  align?: "left" | "center";
  actions?: ReactNode;
}) {
  return (
    <section className="bg-brand relative overflow-hidden">
      <div className={`relative mx-auto max-w-[1320px] px-5 pb-12 pt-12 md:pb-16 md:pt-16 lg:px-8 ${align === "center" ? "text-center" : ""}`}>
        <span aria-hidden="true" className={`mb-5 block h-[4px] w-14 rounded-full bg-gold ${align === "center" ? "mx-auto" : ""}`} />
        <Tag className="font-display text-[40px] font-extrabold uppercase leading-[1] tracking-[-1px] text-white sm:text-[56px] lg:text-[64px]">{children}</Tag>
        {intro ? <p className={`mt-4 max-w-[640px] text-[18px] leading-[1.55] text-white/80 ${align === "center" ? "mx-auto" : ""}`}>{intro}</p> : null}
        {actions ? <div className="mt-8">{actions}</div> : null}
      </div>
    </section>
  );
}
