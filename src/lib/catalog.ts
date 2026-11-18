import { cacheLife } from "next/cache";
import {
  getAuthor,
  getWork,
  InvalidIdError,
  NotFoundError,
  searchBooks,
  type Author,
  type Work,
} from "@/lib/open-library";
import { SHELVES } from "@/lib/shelves";

export const PAGE_SIZE = 20;

/** Cached for hours: book metadata changes slowly and the upstream API is rate-limited. */
export async function searchCatalog(query: string, page: number, limit: number = PAGE_SIZE) {
  "use cache";
  cacheLife("hours");
  return searchBooks(query, { page, limit });
}

/**
 * Returns null when the book doesn't exist (or the id is malformed).
 * The instanceof checks run inside the cached scope, so they don't depend on
 * error classes surviving the cache boundary.
 */
export async function getBookWork(id: string): Promise<Work | null> {
  "use cache";
  cacheLife("days");

  try {
    return await getWork(id);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof InvalidIdError) return null;
    throw error;
  }
}

export async function getBookAuthor(id: string): Promise<Author | null> {
  "use cache";
  cacheLife("days");

  try {
    return await getAuthor(id);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof InvalidIdError) return null;
    throw error;
  }
}

/** Fetches authors in parallel. A missing or failing author is dropped, never fatal. */
export async function loadAuthors(ids: string[]): Promise<Author[]> {
  const settled = await Promise.allSettled(ids.slice(0, 5).map((id) => getBookAuthor(id)));
  return settled.flatMap((result) =>
    result.status === "fulfilled" && result.value ? [result.value] : [],
  );
}

const FALLBACK_WORK_IDS = ["OL1003040W"]; // Dom Casmurro

/**
 * Works prerendered at build time: the top results of each home shelf.
 * No try/catch on purpose: if the API is down, failing loudly beats
 * prerendering (and caching) an almost empty site.
 */
export async function getFeaturedWorkIds(): Promise<string[]> {
  "use cache";
  cacheLife("days");

  const results = await Promise.all(SHELVES.map((shelf) => searchBooks(shelf.query, { limit: 3 })));
  const ids = [...new Set(results.flatMap((result) => result.books.map((book) => book.id)))];
  return ids.length > 0 ? ids : FALLBACK_WORK_IDS;
}

const FALLBACK_AUTHOR_IDS = ["OL93286A"]; // Machado de Assis

/** Authors prerendered at build time: the lead author of the top books on each home shelf. */
export async function getFeaturedAuthorIds(): Promise<string[]> {
  "use cache";
  cacheLife("days");

  const results = await Promise.all(SHELVES.map((shelf) => searchCatalog(shelf.query, 1, 3)));
  const ids = results.flatMap((result) =>
    result.books.flatMap((book) => {
      const id = book.authors[0]?.id;
      return id ? [id] : [];
    }),
  );
  return ids.length > 0 ? [...new Set(ids)] : FALLBACK_AUTHOR_IDS;
}
