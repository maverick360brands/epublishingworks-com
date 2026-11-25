"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AuthorCard, type AuthorCardData } from "./AuthorCard";

export type DirectoryAuthor = AuthorCardData & { groups: string[]; surnames: string[] };

/** The surname to file an author under for a letter (an author with two names has two). */
const surnameFor = (a: DirectoryAuthor, letter: string) => (letter && a.surnames.find((s) => s[0]?.toUpperCase() === letter)) || a.surnames[0] || a.name;

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// The directory's finder (Dustin, 2026-11-25): search by name, jump by last-name initial, and the
// WordPress Authors page's genre groups as chips, all working together over one grid. The genre is
// mirrored into the address bar (?genre=Mystery) so it can be shared.
export function AuthorsBrowser({ authors, groups }: { authors: DirectoryAuthor[]; groups: string[] }) {
  const [group, setGroup] = useState("all");
  const [letter, setLetter] = useState("");
  const [query, setQuery] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const g = new URLSearchParams(window.location.search).get("genre");
    // Restores a shared filter after hydration (the server render shows every author).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (g && groups.includes(g)) setGroup(g);
  }, [groups]);

  useEffect(() => {
    const url = group === "all" ? window.location.pathname : `${window.location.pathname}?genre=${encodeURIComponent(group)}`;
    if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", url);
  }, [group]);

  // Genre and search narrow the list first; the A–Z strip then offers only letters that still have someone.
  const narrowed = useMemo(() => {
    const q = query.trim().toLowerCase();
    return authors.filter((a) => (group === "all" || a.groups.includes(group)) && (!q || a.name.toLowerCase().includes(q)));
  }, [authors, group, query]);
  const initials = useMemo(() => new Set(narrowed.flatMap((a) => a.surnames.map((s) => s[0]?.toUpperCase()))), [narrowed]);
  const shown = useMemo(() => {
    const list = letter ? narrowed.filter((a) => a.surnames.some((s) => s[0]?.toUpperCase() === letter)) : narrowed;
    // A letter or a search reads best alphabetically by last name; otherwise keep our order.
    return letter || query.trim() ? [...list].sort((a, b) => surnameFor(a, letter).localeCompare(surnameFor(b, letter)) || a.name.localeCompare(b.name)) : list;
  }, [narrowed, letter, query]);
  const filtered = group !== "all" || letter || query.trim();
  // The buttons that clear the filters disappear (or disable themselves) once pressed, so focus moves
  // to the directory's heading: screen readers keep their place, and phones don't pop the keyboard
  // up over the results the way focusing the search box would.
  const toTop = () => headingRef.current?.focus();
  const clear = () => (setGroup("all"), setLetter(""), setQuery(""), toTop());

  const chip = (id: string, label: string) => (
    <li key={id} className="shrink-0">
      <button
        type="button"
        aria-pressed={group === id}
        onClick={() => setGroup(id)}
        className={`flex items-center rounded-full border px-4 py-2 text-[15px] font-semibold transition-colors ${
          group === id ? "border-blue bg-blue text-white" : "border-line bg-white text-navy hover:border-blue hover:text-blue"
        }`}
      >
        {label}
      </button>
    </li>
  );

  return (
    <div>
      <h2 id="every-author" ref={headingRef} tabIndex={-1} className="sr-only">
        Find an author
      </h2>
      <div className="rounded-[28px] border border-line bg-white p-5 shadow-[0_24px_60px_-40px_rgba(12,47,90,0.45)] sm:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="relative block w-full md:max-w-[380px]">
            <span className="sr-only">Find an author by name</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8.5" cy="8.5" r="6" />
              <path d="M13 13l5 5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find an author by name"
              className="h-[52px] w-full rounded-full border-2 border-line bg-white pl-11 pr-5 text-[16px] text-navy placeholder:text-body focus:border-blue focus:outline-none"
            />
          </label>
          {/* No visible totals (Dustin, 2026-11-25); screen readers still hear how many match a filter. */}
          <p className="sr-only" aria-live="polite">
            {filtered ? `${shown.length} ${shown.length === 1 ? "author matches" : "authors match"}` : ""}
          </p>
          {filtered ? (
            <button type="button" onClick={clear} className="shrink-0 text-[15px] font-semibold text-blue underline decoration-2 underline-offset-4 hover:text-navy">
              Show all authors
            </button>
          ) : null}
        </div>

        {/* A–Z by last name: a letter with no authors (in the chosen genre or search) is shown but can't be
            picked; a picked letter stays pressable so it can always be cleared. */}
        <div role="group" aria-label="Authors by last name" className="-mx-5 mt-5 overflow-x-auto border-t border-line px-5 pb-1 pt-5 [scrollbar-width:none] sm:-mx-7 sm:px-7 md:mx-0 md:overflow-visible md:px-0">
          <ul className="flex gap-1 py-1 md:flex-wrap">
            {LETTERS.map((l) => {
              const has = initials.has(l);
              const on = letter === l;
              return (
                <li key={l} className="shrink-0">
                  <button
                    type="button"
                    disabled={!has && !on}
                    aria-pressed={on}
                    aria-label={`Last names starting with ${l}`}
                    onClick={() => (setLetter(on ? "" : l), on && !has && toTop())}
                    className={`flex h-9 w-9 items-center justify-center rounded-full font-display text-[15px] font-extrabold transition-[background-color,color,transform] duration-200 ease-out ${
                      on
                        ? "bg-blue text-white"
                        : has
                          ? "text-navy hover:-translate-y-0.5 hover:bg-mist hover:text-blue"
                          : "cursor-default text-navy/25"
                    }`}
                  >
                    {l}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div role="group" aria-label="Filter authors by genre" className="-mx-5 mt-5 overflow-x-auto px-5 pb-1 sm:-mx-7 sm:px-7 lg:mx-0 lg:overflow-visible lg:px-0">
          <ul className="flex gap-2 py-1 lg:flex-wrap">
            {chip("all", "All genres")}
            {groups.map((g) => chip(g, g))}
          </ul>
        </div>
      </div>

      {shown.length ? (
        <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-11 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-7 xl:grid-cols-6">
          {shown.map((a, i) => (
            <li key={a.slug}>
              <AuthorCard author={a} priority={i < 6} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 rounded-3xl bg-mist px-6 py-12 text-center">
          <p className="font-display text-[20px] font-bold text-navy">No authors match{query.trim() ? <> &ldquo;{query.trim()}&rdquo;</> : null}</p>
          <p className="mt-2">Try a last name, or show every author.</p>
          <button type="button" onClick={clear} className="btn btn-blue mt-5">
            Show All Authors
          </button>
        </div>
      )}
    </div>
  );
}
