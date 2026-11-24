// The secure-form signal (Dustin, 2026-11-24: "a 3D padlock … so they feel safe submitting").
// Every claim here is true of the build: the site is HTTPS-only (HSTS), manuscripts go to a
// private Blob store, and only editors signed in to the admin can open them
// (src/app/api/manuscript/file/route.ts). Keep it that way if the storage changes.

/** A padlock with depth: brushed-steel shackle, gold body with a lit bevel and a thick edge, navy keyhole, soft shadow. */
export function Padlock3D({ id, className = "" }: { id: string; className?: string }) {
  const g = (name: string) => `${id}-${name}`;
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={g("steel")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#c9d2de" />
          <stop offset="0.32" stopColor="#f7f9fc" />
          <stop offset="0.62" stopColor="#9eabbd" />
          <stop offset="1" stopColor="#dde3eb" />
        </linearGradient>
        <linearGradient id={g("face")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffe38f" />
          <stop offset="0.45" stopColor="#fcb813" />
          <stop offset="1" stopColor="#e39a00" />
        </linearGradient>
        <linearGradient id={g("edge")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#c98900" />
          <stop offset="1" stopColor="#9a6700" />
        </linearGradient>
        <linearGradient id={g("bevel")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={g("hole")} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#1f4d86" />
          <stop offset="1" stopColor="#0c2f5a" />
        </radialGradient>
        <filter id={g("blur")} x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>
      {/* Shadow on the ground. */}
      <ellipse cx="50" cy="88.5" rx="28" ry="3.6" fill="#0c2f5a" opacity="0.28" filter={`url(#${g("blur")})`} />
      {/* Shackle: the back half sits a little lower and darker, for depth. */}
      <path d="M31.5 45V31a18.5 18.5 0 0 1 37 0v14" fill="none" stroke="#6f7d91" strokeWidth="11" strokeLinecap="round" transform="translate(1.6 1.8)" />
      <path d="M31.5 45V31a18.5 18.5 0 0 1 37 0v14" fill="none" stroke={`url(#${g("steel")})`} strokeWidth="10" strokeLinecap="round" />
      <path d="M28.8 42V31.2a21.2 21.2 0 0 1 10-18" fill="none" stroke="#fff" strokeOpacity="0.75" strokeWidth="1.6" strokeLinecap="round" />
      {/* Body: a thick edge under the face gives it volume. */}
      <rect x="19.5" y="43.5" width="62" height="42" rx="11" fill={`url(#${g("edge")})`} />
      <rect x="17" y="40" width="62" height="41" rx="11" fill={`url(#${g("face")})`} />
      <rect x="20.5" y="42.5" width="55" height="12" rx="7" fill={`url(#${g("bevel")})`} />
      <rect x="17.5" y="40.5" width="61" height="40" rx="10.5" fill="none" stroke="#fff" strokeOpacity="0.35" />
      {/* Keyhole. */}
      <circle cx="48" cy="57.5" r="6.2" fill={`url(#${g("hole")})`} />
      <path d="M45.2 60.5 44 71.5h8l-1.2-11z" fill={`url(#${g("hole")})`} />
      <circle cx="46.2" cy="55.6" r="1.6" fill="#fff" opacity="0.35" />
      {/* Specular glints. */}
      <ellipse cx="26" cy="47" rx="3.4" ry="1.6" fill="#fff" opacity="0.8" />
    </svg>
  );
}

const CHECKS = ["An encrypted connection from your browser to us", "Your files are stored privately, never on a public link", "Only our editorial team can open your manuscript"];

/** The panel at the top of the manuscript form. */
export function SecureNotice({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-start gap-4 rounded-[22px] border border-line bg-mist/70 p-5 sm:items-center sm:p-6 ${className}`}>
      <Padlock3D id="lock-notice" className="h-[72px] w-[72px] shrink-0 sm:h-[84px] sm:w-[84px]" />
      <div>
        <p className="font-display text-[19px] font-extrabold tracking-[-0.01em] text-navy">Secure submission</p>
        <ul className="mt-2 space-y-1.5 text-[14.5px] leading-[1.45] text-body">
          {CHECKS.map((c) => (
            <li key={c} className="flex gap-2">
              <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-[3px] h-[14px] w-[14px] shrink-0 text-blue" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8.5l3.2 3L13 4.5" />
              </svg>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** One line beside a submit button. */
export function SecureLine({ text = "Secure, encrypted submission", className = "" }: { text?: string; className?: string }) {
  return (
    <p className={`flex items-center gap-2 text-[14px] font-semibold text-navy ${className}`}>
      <Padlock3D id="lock-line" className="h-[26px] w-[26px] shrink-0" />
      {text}
    </p>
  );
}
