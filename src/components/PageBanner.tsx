import type { ReactNode } from "react";

// Page heading band on the brand surface: gold rule, white title, optional label and intro line.
export function PageBanner({
  children,
  intro,
  kicker,
  as: Tag = "h1",
  align = "left",
  actions,
}: {
  children: ReactNode;
  intro?: ReactNode;
  kicker?: ReactNode;
  as?: "h1" | "p";
  align?: "left" | "center";
  actions?: ReactNode;
}) {
  return (
    <section className="bg-brand relative overflow-hidden">
      <div className={`relative mx-auto max-w-[1320px] px-5 pb-12 pt-12 md:pb-16 md:pt-16 lg:px-8 ${align === "center" ? "text-center" : ""}`}>
        <span aria-hidden="true" className={`mb-5 block h-[4px] w-14 rounded-full bg-gold ${align === "center" ? "mx-auto" : ""}`} />
        {kicker ? <p className="type-kicker mb-3 !text-gold">{kicker}</p> : null}
        <Tag className="font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.035em] text-white sm:text-[54px] lg:text-[62px]">{children}</Tag>
        {intro ? <p className={`mt-4 max-w-[680px] text-[18px] leading-[1.6] text-white/80 ${align === "center" ? "mx-auto" : ""}`}>{intro}</p> : null}
        {actions ? <div className="mt-8">{actions}</div> : null}
      </div>
    </section>
  );
}
