"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

// Replaces the Thrive "Quick Contact" form: name, email, and message, with an inline success
// message (as on WordPress). Spam: a honeypot here; the server adds its own checks.

const input =
  "block h-[52px] w-full rounded-[14px] border border-line bg-white px-4 text-[16px] text-navy placeholder:text-body/60 transition-[border-color,box-shadow] focus:border-blue focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-blue)_14%,transparent)] focus:outline-none";
const label = "mb-2 block font-display text-[15px] font-bold text-navy";

type Status = { kind: "idle" | "sending" | "sent" } | { kind: "error"; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact/", { method: "POST", body: data });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Your message wasn't sent. Please try again, or call us at 866-846-5123.");
      setStatus({ kind: "sent" });
    } catch (error) {
      setStatus({ kind: "error", message: (error as Error).message });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="rounded-[20px] bg-mist p-7">
        <p className="font-display text-[22px] font-bold text-navy">Thanks! Your message is on its way.</p>
        <p className="mt-2">You can expect a personal reply within 2-4 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className={label}>Name</span>
        <input name="name" required autoComplete="name" className={input} />
      </label>
      <label className="block">
        <span className={label}>Email</span>
        <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={input} />
      </label>
      <label className="block">
        <span className={label}>Message</span>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell us about your books: past titles (if any), and your genre and sub-genre."
          className={`${input} h-auto min-h-[150px] py-3 leading-[1.55]`}
        />
      </label>

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

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[300px] text-[14px] leading-[1.5] text-body">
          We never sell your information (see our{" "}
          <Link href="/privacy-policy/" className="underline">
            privacy policy
          </Link>
          ).
        </p>
        <button type="submit" disabled={status.kind === "sending"} className="btn btn-gold btn-lg shrink-0 disabled:opacity-60">
          {status.kind === "sending" ? "Sending…" : "Send Message"}
        </button>
      </div>
    </form>
  );
}
