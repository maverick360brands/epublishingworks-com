// Small inline icons, drawn on a 24px grid with a 2px stroke unless noted.
import type { ReactNode } from "react";
type P = { className?: string };

export const ArrowRight = ({ className = "h-[1em] w-[1.15em]" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 24 20" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 10h18M12 2l8 8-8 8" />
  </svg>
);

export const Calendar = ({ className = "h-[1em] w-[1em]" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 20 22" className={className} fill="currentColor">
    <path d="M5 0h2v3h6V0h2v3h3a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3zM2 9v11h16V9zm2 2h3v3H4zm4.5 0h3v3h-3zM13 11h3v3h-3zm-9 4.5h3v3H4zm4.5 0h3v3h-3z" />
  </svg>
);

export const Star = ({ className = "h-[1em] w-[1em]" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 1.8l3.1 6.4 7 1-5.1 4.9 1.2 7L12 17.8l-6.2 3.3 1.2-7L1.9 9.2l7-1z" />
  </svg>
);

/** A small diamond, used as a separator in the benefits band. */
export const Diamond = ({ className = "h-[1em] w-[1em]" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2l10 10-10 10L2 12z" />
  </svg>
);

export const CheckCircle = ({ className = "h-[30px] w-[30px]" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 30 30" className={className}>
    <circle cx="15" cy="15" r="15" fill="var(--color-gold)" />
    <path d="M8.5 15.5l4.2 4.2 8.8-9.2" fill="none" stroke="var(--color-navy)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Plus = ({ className = "h-4 w-4" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 2v12M2 8h12" />
  </svg>
);

export const Bars = ({ className = "h-4 w-4" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 16 14" className={className} fill="currentColor">
    <rect y="0" width="16" height="2" rx="1" />
    <rect y="6" width="16" height="2" rx="1" />
    <rect y="12" width="16" height="2" rx="1" />
  </svg>
);

export const Close = ({ className = "h-4 w-4" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 2l12 12M14 2L2 14" />
  </svg>
);

export const Phone = ({ className = "h-[1em] w-[1em]" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3h3.5l1.7 4.3-2.2 1.5a11 11 0 0 0 6.2 6.2l1.5-2.2L20 14.5V18a2 2 0 0 1-2 2A15 15 0 0 1 3 5a2 2 0 0 1 2-2z" />
  </svg>
);

export const Chat = ({ className = "h-[1em] w-[1em]" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5h16v11H9l-5 4z" />
    <path d="M8 9.5h8M8 12.5h5" />
  </svg>
);

export const Mail = ({ className = "h-[1em] w-[1em]" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3.5 6.5L12 13l8.5-6.5" />
  </svg>
);

export const CalendarLine = ({ className = "h-[1em] w-[1em]" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const Compass = ({ className = "h-[1em] w-[1em]" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </svg>
);

const Line = ({ className = "h-6 w-6", children }: P & { children: ReactNode }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const Coins = (p: P) => (
  <Line {...p}>
    <ellipse cx="9" cy="6" rx="6" ry="3" />
    <path d="M3 6v4c0 1.7 2.7 3 6 3s6-1.3 6-3V6M3 10v4c0 1.7 2.7 3 6 3 1 0 2-.1 2.8-.4M15 13.5c.6-.3 1.3-.5 2-.5 2.8 0 5 1.3 5 3v2c0 1.7-2.2 3-5 3s-5-1.3-5-3v-2" />
  </Line>
);

export const Palette = (p: P) => (
  <Line {...p}>
    <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7H16a5 5 0 0 0 5-5C21 6.4 17 3 12 3z" />
    <circle cx="7.5" cy="11" r="1" />
    <circle cx="10.5" cy="7.5" r="1" />
    <circle cx="15" cy="8" r="1" />
  </Line>
);

export const Hourglass = (p: P) => (
  <Line {...p}>
    <path d="M6 2h12M6 22h12M7 2c0 5 10 5 10 10S7 17 7 22M17 2c0 5-10 5-10 10s10 5 10 10" />
  </Line>
);

export const Globe = (p: P) => (
  <Line {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" />
  </Line>
);

export const Megaphone = (p: P) => (
  <Line {...p}>
    <path d="M3 10v4a1 1 0 0 0 1 1h2l5 4V5L6 9H4a1 1 0 0 0-1 1zM15 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" />
  </Line>
);

export const TrendUp = (p: P) => (
  <Line {...p}>
    <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
  </Line>
);

export const Feather = (p: P) => (
  <Line {...p}>
    <path d="M20.2 3.8a6 6 0 0 0-8.5 0L5 10.5V19h8.5l6.7-6.7a6 6 0 0 0 0-8.5zM16 8L2 22M17.5 15H9" />
  </Line>
);

export const BookOpen = (p: P) => (
  <Line {...p}>
    <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" />
  </Line>
);
