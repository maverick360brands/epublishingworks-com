"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookTile, type BookTileData } from "./BookTile";

export type CatalogBook = BookTileData & { genre: string; authorSort: string; seriesNumber: number | null; seriesName: string; rank: number };

type Sort = "featured" | "title" | "author";
const SORTS: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "title", label: "Title A–Z" },
  { id: "author", label: "Author A–Z" },
];

const sorters: Record<Sort, (a: CatalogBook, b: CatalogBook) => number> = {
  featured: (a, b) => a.rank - b.rank,
  title: (a, b) => a.title.localeCompare(b.title),
  // Author, then each series in reading order, then title.
  author: (a, b) =>
    a.authorSort.localeCompare(b.authorSort) || a.seriesName.localeCompare(b.seriesName) || (a.seriesNumber ?? 0) - (b.seriesNumber ?? 0) || a.title.localeCompare(b.title),
};

/** Reads ?genre=…&q=… once on load so filtered views can be shared and bookmarked. */
function initialState(genres: string[]) {
  if (typeof window === "undefined") return { genre: "all", query: "" };
  const params = new URLSearchParams(window.location.search);
  const g = params.get("genre") ?? "all";
  return { genre: genres.includes(g) ? g : "all", query: params.get("q") ?? "" };
}

// The full catalog: genre chips (with counts), search by title, author, or series, and a sort.
// The filter state is mirrored into the address bar. Tiles come PAGE at a time ("Show more"):
// all 510 at once made the page heavy to render; search and filters still cover every book.
const PAGE = 84; // whole rows at 7, 6, 4, 3 and 2 across

export function BooksBrowser({ books }: { books: CatalogBook[] }) {
  const genres = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of books) counts.set(b.genre, (counts.get(b.genre) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [books]);
  const [genre, setGenre] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [limit, setLimit] = useState(PAGE);
  const countRef = useRef<HTMLParagraphElement>(null);
  // Picking a genre or a sort "reshelves" the grid: the covers rise into place once (not while
  // typing a search, and not on the first load, so nothing waits to appear).
  // `reshelf` remounts the grid; `shelving` is on only until the next search or "Show more".
  const [reshelf, setReshelf] = useState(0);
  const [shelving, setShelving] = useState(false);
  const reshelve = () => (setReshelf((n) => n + 1), setShelving(true));
  // A new filter, search, or sort starts again from the first page.
  const pick = (g: string) => (setGenre(g), setLimit(PAGE), reshelve());
  const search = (q: string) => (setQuery(q), setLimit(PAGE), setShelving(false));

  useEffect(() => {
    const s = initialState(genres.map(([g]) => g));
    // Restores the filters from a shared link after hydration (the server render shows them all).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGenre(s.genre);
    setQuery(s.query);
  }, [genres]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (genre !== "all") params.set("genre", genre);
    if (query.trim()) params.set("q", query.trim());
    const next = `${window.location.pathname}${params.size ? `?${params}` : ""}`;
    if (next !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", next);
  }, [genre, query]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books
      .filter((b) => (genre === "all" || b.genre === genre) && (!q || `${b.title} ${b.author} ${b.series}`.toLowerCase().includes(q)))
      .sort(sorters[sort]);
  }, [books, genre, query, sort]);

  const chip = (id: string, label: string, count: number) => (
    <li key={id} className="shrink-0">
      <button
        type="button"
        aria-pressed={genre === id}
        onClick={() => pick(id)}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[15px] font-semibold transition-colors ${
          genre === id ? "border-blue bg-blue text-white" : "border-line bg-white text-navy hover:border-blue hover:text-blue"
        }`}
      >
        {label}
        <span className={`rounded-full px-2 py-0.5 text-[12px] tabular-nums ${genre === id ? "bg-white/20 text-white" : "bg-mist text-body"}`}>{count}</span>
      </button>
    </li>
  );

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full md:max-w-[420px]">
          <span className="sr-only">Search books by title, author, or series</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8.5" cy="8.5" r="6" />
            <path d="M13 13l5 5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => search(e.target.value)}
            placeholder="Search title, author, or series"
            className="h-[54px] w-full rounded-full border-2 border-line bg-white pl-12 pr-5 text-[16px] text-navy placeholder:text-body focus:border-blue focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-3 text-[15px] font-semibold text-navy">
          Sort
          <select
            value={sort}
            onChange={(e) => (setSort(e.target.value as Sort), setLimit(PAGE), reshelve())}
            className="h-[46px] rounded-full border-2 border-line bg-white px-4 text-[15px] font-semibold text-navy focus:border-blue focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div role="group" aria-label="Filter by genre" className="-mx-5 mt-6 overflow-x-auto px-5 pb-2 [scrollbar-width:thin] lg:mx-0 lg:overflow-visible lg:px-0">
        <ul className="flex gap-2 py-1 lg:flex-wrap">
          {chip("all", "All books", books.length)}
          {genres.map(([g, n]) => chip(g, g, n))}
        </ul>
      </div>

      <p ref={countRef} tabIndex={-1} className="mt-6 text-[15px] text-body focus:outline-none" aria-live="polite">
        {shown.length === books.length ? `${books.length} books` : `${shown.length} of ${books.length} books`}
      </p>

      {shown.length ? (
        <>
          <ul key={reshelf} className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 min-[540px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-6 xl:grid-cols-7">
            {shown.slice(0, limit).map((b, i) => (
              <li key={b.slug} className={shelving ? "shelf-in" : undefined} style={shelving ? { animationDelay: `${Math.min(i, 13) * 35}ms` } : undefined}>
                <BookTile
                  book={b}
                  dense
                  priority={i < 7}
                  headingLevel="h2"
                  sizes="(min-width: 1280px) 172px, (min-width: 1024px) 15vw, (min-width: 768px) 23vw, (min-width: 540px) 30vw, 45vw"
                />
              </li>
            ))}
          </ul>
          {shown.length > limit ? (
            <div className="mt-14 text-center">
              <button type="button" onClick={() => (setShelving(false), setLimit((n) => n + PAGE))} className="btn btn-blue">
                Show More Books
              </button>
              <p className="mt-3 text-[14px] text-body">
                Showing {limit} of {shown.length}
              </p>
            </div>
          ) : null}
        </>
      ) : (
        <div className="mt-6 rounded-3xl bg-mist px-6 py-12 text-center">
          <p className="font-display text-[20px] font-bold text-navy">No books match{query.trim() ? <> &ldquo;{query.trim()}&rdquo;</> : null}</p>
          <p className="mt-2">Check the spelling, or clear the filters to see every book.</p>
          <button
            type="button"
            onClick={() => {
              search("");
              pick("all");
              countRef.current?.focus(); // the button is gone once the books are back

            }}
            className="btn btn-blue mt-5"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
