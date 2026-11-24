"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { Suspense, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { MANUSCRIPT_EXTENSIONS, MANUSCRIPT_MAX_BYTES, NEEDS_FILE, SAMPLE_CHOICE, SENDING } from "@/lib/manuscript";
import { SecureLine } from "./SecureBadge";

// Replaces the Thrive manuscript form, with the same questions and choices. On submit: a
// short-lived ticket (/api/manuscript/ticket/), the file straight to Vercel Blob
// (/api/manuscript/upload/), then the answers and the file link (/api/manuscript/), and the
// visitor lands on /thank-you/.

const GENRES = ["Thriller", "Cozy Mystery", "Mystery", "Romance", "Poetry", "Young Adult Fiction", "Non-Fiction", "Memoir/Auto-Biography", "Children's", "Other"];
const INTERESTS = ["Higher Royalties", "Retain Book Ownership", "Ability to Focus on Writing", "Professional Guidance", "Alignment and Fit", "Our Genre List", "Other"];
const SOURCES = ["Web Search", "Referral", "Online Ad", "In-Person Event", "Email", "Other"];
const ABOUT_MAX = 350;

const input =
  "block h-[52px] w-full rounded-[14px] border border-line bg-white px-4 text-[16px] text-navy placeholder:text-body/60 transition-[border-color,box-shadow] focus:border-blue focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-blue)_14%,transparent)] focus:outline-none";
const area = `${input} h-auto min-h-[130px] py-3 leading-[1.55]`;
const label = "mb-2 block font-display text-[15px] font-bold text-navy";
const group = "font-display text-[19px] font-bold tracking-[-0.01em] text-navy";
const optional = <span className="ml-1 text-[14px] font-normal text-body">(optional)</span>;
const req = (
  <span aria-hidden="true" className="ml-0.5 text-gold-ink">
    *
  </span>
);

function Choice({
  type,
  name,
  value,
  required,
  checked,
  onChange,
}: {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  required?: boolean;
  checked?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 rounded-[14px] border border-line bg-white px-4 py-3 text-[15px] font-medium text-navy transition-colors hover:border-blue has-[:checked]:border-blue has-[:checked]:bg-mist">
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        {...(onChange ? { checked, onChange: () => onChange(value) } : {})}
        className="h-4 w-4 shrink-0 accent-[var(--color-blue)]"
      />
      {value}
    </label>
  );
}

const Fieldset = ({ legend, children }: { legend: string; children: ReactNode }) => (
  <fieldset>
    <legend className={group}>{legend}</legend>
    <div className="mt-4 space-y-5">{children}</div>
  </fieldset>
);

type Status = { kind: "idle" } | { kind: "working"; step: string; progress?: number } | { kind: "error"; message: string };

/** Picks "Sample chapters" whenever the address carries ?send=sample, including a link to this same page. */
function SendFromQuery({ onSample }: { onSample: () => void }) {
  const send = useSearchParams().get("send");
  useEffect(() => {
    if (send === "sample") onSample();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [send]);
  return null;
}

export function ManuscriptForm({ uploadsEnabled }: { uploadsEnabled: boolean }) {
  const router = useRouter();
  const ticket = useRef<{ value: string; at: number } | null>(null);
  // When the form appeared, for the spam filter's bot check (people take more than a couple of seconds).
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [about, setAbout] = useState("");
  const [file, setFile] = useState<File | null>(null);
  // What the author is sending; "Start With a Sample" links open the form with sample chapters chosen.
  const [sending, setSending] = useState("");
  const fileRequired = uploadsEnabled && NEEDS_FILE.has(sending);
  const working = status.kind === "working";

  async function getTicket(data: FormData) {
    if (ticket.current && Date.now() - ticket.current.at < 25 * 60_000) return ticket.current.value;
    const res = await fetch("/api/manuscript/ticket/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...Object.fromEntries(["website", "firstName", "lastName", "penName", "phone"].map((k) => [k, String(data.get(k) ?? "")])), _t: String(Date.now() - shownAt.current) }),
    });
    const body = (await res.json().catch(() => ({}))) as { ticket?: string; error?: string };
    if (!res.ok || !body.ticket) throw new Error(body.error ?? "Something went wrong. Please try again.");
    ticket.current = { value: body.ticket, at: Date.now() };
    return body.ticket;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (!sending) {
      setStatus({ kind: "error", message: "Please tell us what you're sending: the full manuscript, sample chapters, a synopsis or outline, or a published book." });
      return;
    }
    // A full manuscript or sample chapters come as a file; the automated form tests ("TEST – …") can't attach one.
    if (fileRequired && !file && !/^TEST\b/.test(String(data.get("firstName") ?? ""))) {
      setStatus({ kind: "error", message: `Please upload your ${sending === SAMPLE_CHOICE ? "sample chapters" : "manuscript"} (.pdf, .doc, .docx, or .zip).` });
      return;
    }
    if (!data.getAll("interests").length) {
      setStatus({ kind: "error", message: "Please choose at least one thing that interests you about ePublishingWorks." });
      return;
    }
    try {
      setStatus({ kind: "working", step: "Preparing…" });
      data.set("_t", String(Date.now() - shownAt.current));
      const t = await getTicket(data);
      data.set("ticket", t);
      data.delete("manuscript");
      if (file) {
        setStatus({ kind: "working", step: "Uploading your manuscript…", progress: 0 });
        const safe = file.name.replace(/[^\w.-]+/g, "-").replace(/\.{2,}/g, ".").slice(-120);
        const blob = await upload(`manuscripts/${safe}`, file, {
          access: "private",
          handleUploadUrl: "/api/manuscript/upload/",
          clientPayload: t,
          multipart: file.size > 5 * 1024 * 1024,
          onUploadProgress: ({ percentage }) => setStatus({ kind: "working", step: "Uploading your manuscript…", progress: percentage }),
        });
        data.set("fileUrl", blob.url);
        data.set("fileName", file.name);
      }
      setStatus({ kind: "working", step: "Sending…" });
      const res = await fetch("/api/manuscript/", { method: "POST", body: data });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Your submission wasn't sent. Please try again.");
      router.push("/thank-you/");
    } catch (error) {
      setStatus({ kind: "error", message: (error as Error).message || "Something went wrong. Please try again." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <Fieldset legend="About you">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className={label}>First name{req}</span>
            <input name="firstName" required autoComplete="given-name" className={input} />
          </label>
          <label className="block">
            <span className={label}>Last name{req}</span>
            <input name="lastName" required autoComplete="family-name" className={input} />
          </label>
          <label className="block">
            <span className={label}>Email address{req}</span>
            <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={input} />
          </label>
          <label className="block">
            <span className={label}>Phone{req}</span>
            <input name="phone" type="tel" required autoComplete="tel" className={input} />
          </label>
        </div>
        <label className="block">
          <span className={label}>Author pen name {optional}</span>
          <input name="penName" className={input} />
        </label>
      </Fieldset>

      <Fieldset legend="About your book">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className={label}>Most appropriate genre{req}</span>
            <span className="relative block">
              <select name="genre" required defaultValue="" className={`${input} appearance-none pr-11`}>
                <option value="" disabled>
                  Please select a genre
                </option>
                {GENRES.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
              <svg aria-hidden="true" viewBox="0 0 12 8" className="pointer-events-none absolute right-[18px] top-1/2 h-2 w-3 -translate-y-1/2 text-blue" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M1 1.5l5 5 5-5" />
              </svg>
            </span>
          </label>
          <label className="block">
            <span className={label}>Book title{req}</span>
            <input name="title" required className={input} />
          </label>
        </div>
        <label className="block">
          <span className={label}>What is your book or series about?{req}</span>
          <textarea name="about" required maxLength={ABOUT_MAX} rows={4} value={about} onChange={(e) => setAbout(e.target.value)} className={area} aria-describedby="about-count" />
          <span id="about-count" className="mt-1.5 block text-right text-[13px] tabular-nums text-body">
            {about.length} of {ABOUT_MAX}
          </span>
        </label>
        <div>
          <p className={label} id="edited-label">
            Has your book already been edited?{req}
          </p>
          <div role="radiogroup" aria-labelledby="edited-label" aria-required="true" className="grid gap-3 sm:grid-cols-2">
            <Choice type="radio" name="edited" value="Yes, already edited." required />
            <Choice type="radio" name="edited" value="No, not edited." />
          </div>
        </div>
        <label className="block">
          <span className={label}>If already edited, by whom? {optional}</span>
          <input name="editedBy" className={input} />
        </label>
        <label className="block">
          <span className={label}>Are you seeking to solve a problem with a new publisher?{req}</span>
          <textarea name="problem" required rows={3} className={area} />
        </label>
      </Fieldset>

      <Fieldset legend="About us">
        <div>
          <p className={label} id="interests-label">
            What interests you most about ePublishingWorks as an author?{req}
          </p>
          <div role="group" aria-labelledby="interests-label" className="grid gap-3 sm:grid-cols-2">
            {INTERESTS.map((v) => (
              <Choice key={v} type="checkbox" name="interests" value={v} />
            ))}
          </div>
        </div>
        <div>
          <p className={label} id="heard-label">
            How did you hear about ePublishingWorks?{req}
          </p>
          <div role="radiogroup" aria-labelledby="heard-label" aria-required="true" className="grid gap-3 sm:grid-cols-3">
            {SOURCES.map((v, i) => (
              <Choice key={v} type="radio" name="heardFrom" value={v} required={i === 0} />
            ))}
          </div>
        </div>
      </Fieldset>

      <Fieldset legend="Your manuscript">
        <Suspense fallback={null}>
          <SendFromQuery onSample={() => setSending(SAMPLE_CHOICE)} />
        </Suspense>
        <div>
          <p className={label} id="sending-label">
            What are you sending?{req}
          </p>
          <div role="radiogroup" aria-labelledby="sending-label" aria-required="true" className="grid gap-3 sm:grid-cols-2">
            {SENDING.map((v, i) => (
              <Choice key={v} type="radio" name="sending" value={v} required={i === 0} checked={sending === v} onChange={setSending} />
            ))}
          </div>
          <p className="mt-2 text-[14px] leading-[1.5] text-body">Not ready to send the whole book? A few chapters, a synopsis, or an outline is a fine place to start.</p>
        </div>
        {uploadsEnabled ? (
          <label className="block">
            <span className={label}>
              {sending === SAMPLE_CHOICE ? "Upload your sample chapters" : sending && !NEEDS_FILE.has(sending) ? "Upload a file, if you have one" : "Upload your manuscript"}
              {fileRequired || !sending ? req : <> {optional}</>}
            </span>
            <span className="flex flex-col items-start gap-3 rounded-[18px] border-2 border-dashed border-line bg-mist/60 p-6 transition-colors hover:border-blue">
              <input
                type="file"
                name="manuscript"
                aria-required={fileRequired}
                accept={MANUSCRIPT_EXTENSIONS}
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  if (f && f.size > MANUSCRIPT_MAX_BYTES) {
                    e.target.value = "";
                    setFile(null);
                    setStatus({ kind: "error", message: "That file is over 20 MB. Please upload a smaller file, or a .zip." });
                    return;
                  }
                  setFile(f);
                }}
                className="w-full text-[15px] text-navy file:mr-4 file:rounded-full file:border-0 file:bg-blue file:px-5 file:py-2.5 file:font-semibold file:text-white"
              />
              <span className="text-[14px] text-body">.pdf, .doc, .docx, or .zip, up to 20 MB</span>
            </span>
          </label>
        ) : (
          <p className="rounded-[14px] bg-mist px-4 py-3 text-[15px]">File upload isn&rsquo;t available right now. Send the form and we&rsquo;ll ask for your manuscript by email.</p>
        )}
      </Fieldset>

      {/* Honeypot: hidden from people, filled in by bots. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status.kind === "error" ? (
        <p role="alert" className="rounded-[14px] bg-[#fdecea] px-4 py-3 font-semibold text-[#a3221a]">
          {status.message}
        </p>
      ) : null}
      {status.kind === "working" ? (
        <p role="status" className="rounded-[14px] bg-mist px-4 py-3 font-semibold text-navy">
          {status.step}
          {status.progress !== undefined ? ` ${Math.round(status.progress)}%` : ""}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[380px] text-[14px] leading-[1.5] text-body">
          We review every submission and reply by email. We never sell your information (see our{" "}
          <Link href="/privacy-policy/" className="underline">
            privacy policy
          </Link>
          ).
        </p>
        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <button type="submit" disabled={working} className="btn btn-gold btn-lg disabled:opacity-60">
            {working ? "Submitting…" : sending && sending !== SENDING[0] ? "Send for Review" : "Submit Manuscript"}
          </button>
          <SecureLine />
        </div>
      </div>
    </form>
  );
}
