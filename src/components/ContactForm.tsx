"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useState, type ReactNode } from "react";

// Replaces the WPForms contact form. Fields and the conditional logic match it: creators
// are asked about their channels and reach; authors about genre, title, and synopsis.
// The form opens with what the person is working on, since that decides what we ask next.
const genres = {
  Fiction: [
    "Fiction Christian Thriller",
    "Fiction Christian Mystery",
    "Fiction Christian Suspense",
    "Fiction Christian Romance",
    "Fiction Christian Military Romance",
    "Fiction Christian Historical Fiction",
    "Fiction Christian Young Adult",
    "Fiction Christian Allegory (Truth through Story)",
    "OTHER Christian Fiction",
  ],
  "Non-Fiction": [
    "Non-Fiction Evangelism",
    "Non-Fiction Christian Living",
    "Non-Fiction True Stories",
    "Non-Fiction Inspirational stories",
    "Non-Fiction Teaching",
    "OTHER Christian Non-Fiction",
  ],
};

const glyph = "h-7 w-7";
const svg = {
  "aria-hidden": true,
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const projects: {
  value: string;
  label: string;
  hint: string;
  icon: ReactNode;
}[] = [
  {
    value: "nonfiction",
    label: "A non-fiction book",
    hint: "Teaching, testimony, Christian living",
    icon: (
      <svg {...svg} className={glyph}>
        <path d="M16 8c-3-2-7-2.5-11-2v19c4-.5 8 0 11 2 3-2 7-2.5 11-2V6c-4-.5-8 0-11 2z" />
        <path d="M16 8v19" />
      </svg>
    ),
  },
  {
    value: "fiction",
    label: "A fiction book",
    hint: "Thriller, romance, allegory, and more",
    icon: (
      <svg {...svg} className={glyph}>
        <path d="M26 5C15 6 9 13 7 25" />
        <path d="M26 5c-1 7-5 12-12 14" />
        <path d="M11 17h6M5 27l3-3" />
      </svg>
    ),
  },
  {
    value: "recorded",
    label: "Sermons, podcasts, or videos",
    hint: "Recorded messages that could become a book",
    icon: (
      <svg {...svg} className={glyph}>
        <rect x="11" y="4" width="10" height="15" rx="5" />
        <path d="M7 15a9 9 0 0 0 18 0M16 24v4M11 28h10" />
      </svg>
    ),
  },
  {
    value: "other",
    label: "Something else",
    hint: "A question, an existing book, anything",
    icon: (
      <svg {...svg} className={glyph}>
        <circle cx="16" cy="16" r="12" />
        <path d="M12.5 12.5a3.5 3.5 0 1 1 5 3.2c-1 .5-1.5 1.3-1.5 2.3v.5" />
        <path d="M16 23h.01" />
      </svg>
    ),
  },
];

type State = { status: "idle" | "sent" | "error"; message?: string };

async function send(_: State, formData: FormData): Promise<State> {
  try {
    const res = await fetch("/api/contact/", {
      method: "POST",
      body: formData,
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok)
      return {
        status: "error",
        message: body.error ?? "Your message wasn't sent. Please call us at 866-846-5123.",
      };
    return { status: "sent" };
  } catch {
    return {
      status: "error",
      message: "Your message wasn't sent because the connection failed. Check your connection and try again.",
    };
  }
}

const input =
  "block h-[52px] w-full rounded-[14px] border border-[#cfd8e6] bg-white px-4 text-[16px] text-navy placeholder:text-[#7d8799] transition-[border-color,box-shadow] focus:border-blue focus:shadow-[0_0_0_4px_rgba(11,76,158,0.14)] focus:outline-none";
const area = `${input} h-auto min-h-[140px] py-3 leading-[1.55]`;
const label = "mb-2 block font-display text-[15px] font-bold text-navy";
const optional = <span className="ml-1 font-body text-[14px] font-normal text-body">(optional)</span>;
const group = "font-display text-[19px] font-bold tracking-[-0.01em] text-navy";

export function ContactForm() {
  const params = useSearchParams();
  return <ContactFormFields preset={params.get("type") ?? ""} />;
}

export function ContactFormFields({ preset = "" }: { preset?: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(
    async (prev: State, fd: FormData) => {
      const next = await send(prev, fd);
      if (next.status === "sent") router.push("/thank-you/");
      return next;
    },
    { status: "idle" } as State,
  );
  const [type, setType] = useState(projects.some((p) => p.value === preset) ? preset : "");
  const isAuthor = type === "fiction" || type === "nonfiction";

  if (state.status === "sent") {
    return (
      <div role="status" className="py-10">
        <p className="type-card">Message sent</p>
        <p className="mt-3">A member of our publishing team will be in touch soon.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-10">
      <fieldset>
        <legend className={group}>What are you working on?</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {projects.map((p) => (
            <label key={p.value} className="group relative block cursor-pointer">
              <input
                type="radio"
                name="authorType"
                value={p.value}
                required
                checked={type === p.value}
                onChange={() => setType(p.value)}
                className="peer sr-only"
              />
              <span className="flex h-full items-start gap-4 rounded-[18px] border border-[#cfd8e6] bg-white p-4 transition-[border-color,background-color,box-shadow] group-hover:border-blue peer-checked:border-blue peer-checked:bg-[#f3f6fb] peer-checked:shadow-[inset_0_0_0_1px_var(--color-blue)] peer-focus-visible:shadow-[0_0_0_4px_rgba(11,76,158,0.22)] sm:p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#f3f6fb] text-blue transition-colors group-has-[:checked]:bg-blue group-has-[:checked]:text-white">
                  {p.icon}
                </span>
                <span className="min-w-0 pr-6">
                  <span className="block font-display text-[16px] font-bold leading-[1.25] text-navy">{p.label}</span>
                  <span className="mt-1 block text-[14px] leading-[1.4] text-body">{p.hint}</span>
                </span>
              </span>
              <span
                aria-hidden="true"
                className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border border-[#cfd8e6] bg-white transition-colors peer-checked:border-gold peer-checked:bg-gold"
              >
                <svg
                  viewBox="0 0 12 12"
                  className="hidden h-3 w-3 text-navy group-has-[:checked]:block"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.5 6.2l2.3 2.3 4.7-5" />
                </svg>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {type === "recorded" ? (
        <fieldset key="recorded" className="contact-reveal">
          <legend className={group}>About your content</legend>
          <div className="mt-4 space-y-5">
            <label className="block">
              <span className={label}>Where do people find your messages?</span>
              <input name="channels" required placeholder="YouTube, podcast, church website…" className={input} />
            </label>
            <label className="block">
              <span className={label}>About how many people do you reach each month? {optional}</span>
              <input name="reach" placeholder="5,000? 25,000? 1 million?" className={input} />
            </label>
          </div>
        </fieldset>
      ) : null}

      {isAuthor ? (
        <fieldset key="book" className="contact-reveal">
          <legend className={group}>About your book</legend>
          <div className="mt-4 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className={label}>Genre</span>
                <span className="relative block">
                  <select name="genre" required defaultValue="" className={`${input} appearance-none pr-11`}>
                    <option value="" disabled>
                      Choose a genre
                    </option>
                    {Object.entries(genres).map(([g, items]) => (
                      <optgroup key={g} label={g}>
                        {items.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 8"
                    className="pointer-events-none absolute right-[18px] top-1/2 h-2 w-3 -translate-y-1/2 text-blue"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <path d="M1 1.5l5 5 5-5" />
                  </svg>
                </span>
              </label>
              <label className="block">
                <span className={label}>Working title {optional}</span>
                <input name="title" className={input} />
              </label>
            </div>
            <label className="block">
              <span className={label}>Synopsis {optional}</span>
              <textarea name="synopsis" rows={4} placeholder="A few sentences about your book: what it's about and who it's for." className={area} />
            </label>
          </div>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className={group}>How we can reach you</legend>
        <div className="mt-4 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className={label}>First name</span>
              <input name="firstName" required autoComplete="given-name" className={input} />
            </label>
            <label className="block">
              <span className={label}>Last name</span>
              <input name="lastName" required autoComplete="family-name" className={input} />
            </label>
            <label className="block">
              <span className={label}>Email</span>
              <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={input} />
            </label>
            <label className="block">
              <span className={label}>Phone {optional}</span>
              <input name="phone" type="tel" autoComplete="tel" placeholder="(555) 555-5555" className={input} />
            </label>
          </div>
          <label className="block">
            <span className={label}>Message {optional}</span>
            <textarea
              name="comments"
              rows={5}
              placeholder="Tell us a little about yourself, your book, and what you're hoping for."
              className={area}
            />
          </label>
        </div>
      </fieldset>

      {/* Honeypot: hidden from people, filled in by bots. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" ? (
        <p role="alert" className="rounded-[14px] bg-[#fdecea] px-4 py-3 font-semibold text-[#a3221a]">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 border-t border-[#e3e9f2] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[380px] text-[14px] leading-[1.5] text-body">
          We read every message and reply by email. We never sell your information (see our{" "}
          <Link href="/privacy-policy/" className="underline">
            privacy policy
          </Link>
          ).
        </p>
        <button type="submit" disabled={pending} className="btn btn-blue btn-lg shrink-0 disabled:opacity-60">
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
