"use client";

import { useEffect, useMemo, useState } from "react";
import { AuthorCard, type AuthorCardData } from "./AuthorCard";

export type DirectoryAuthor = AuthorCardData & { groups: string[] };

// The WordPress Authors page sorted authors into genre tabs; here the same groups are filter
// chips over one grid (an author who writes in several groups appears under each). The choice is
// mirrored into the address bar (?genre=Mystery) so it can be shared.
export function AuthorsBrowser({ authors, groups }: { authors: DirectoryAuthor[]; groups: string[] }) {
  const [group, setGroup] = useState("all");

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

  const shown = useMemo(() => (group === "all" ? authors : authors.filter((a) => a.groups.includes(group))), [authors, group]);
  const count = (g: string) => authors.filter((a) => a.groups.includes(g)).length;

  const chip = (id: string, label: string, n: number) => (
    <li key={id} className="shrink-0">
      <button
        type="button"
        aria-pressed={group === id}
        onClick={() => setGroup(id)}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[15px] font-semibold transition-colors ${
          group === id ? "border-blue bg-blue text-white" : "border-line bg-white text-navy hover:border-blue hover:text-blue"
        }`}
      >
        {label}
        <span className={`rounded-full px-2 py-0.5 text-[12px] tabular-nums ${group === id ? "bg-white/20 text-white" : "bg-mist text-body"}`}>{n}</span>
      </button>
    </li>
  );

  return (
    <div>
      <div role="group" aria-label="Filter authors by genre" className="-mx-5 overflow-x-auto px-5 pb-2 lg:mx-0 lg:overflow-visible lg:px-0">
        <ul className="flex gap-2 lg:flex-wrap">
          {chip("all", "All authors", authors.length)}
          {groups.map((g) => chip(g, g, count(g)))}
        </ul>
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length} authors shown
      </p>
      <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((a, i) => (
          <li key={a.slug}>
            <AuthorCard author={a} priority={i < 4} />
          </li>
        ))}
      </ul>
    </div>
  );
}
