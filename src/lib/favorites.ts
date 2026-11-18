import { cardBookSchema, type CardBook } from "./card-book";

export const MAX_FAVORITES = 200;

/** Parses untrusted localStorage content, keeping only valid, unique entries. */
export function parseFavorites(raw: string | null): CardBook[] {
  if (!raw) return [];

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];

  const seen = new Set<string>();
  return data
    .flatMap((item: unknown) => {
      const parsed = cardBookSchema.safeParse(item);
      if (!parsed.success || seen.has(parsed.data.id)) return [];
      seen.add(parsed.data.id);
      return [parsed.data];
    })
    .slice(0, MAX_FAVORITES);
}

export function isFavorite(list: CardBook[], id: string): boolean {
  return list.some((book) => book.id === id);
}

/** Adds the book to the front of the list, or removes it if already there. */
export function toggleFavorite(list: CardBook[], book: CardBook): CardBook[] {
  return isFavorite(list, book.id)
    ? list.filter((item) => item.id !== book.id)
    : [book, ...list].slice(0, MAX_FAVORITES);
}
