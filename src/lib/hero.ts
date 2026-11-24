import type { WallBook } from "@/components/HeroBookWall";

/**
 * Deals covers into the hero wall's columns, left to right, repeating them when there are
 * fewer books than cards so every column is full.
 */
export function wallColumns(books: WallBook[], cards = 30, columns = 5): WallBook[][] {
  const deck = books.length ? Array.from({ length: cards }, (_, i) => books[i % books.length]) : [];
  return Array.from({ length: columns }, (_, c) => deck.filter((_, i) => i % columns === c));
}
