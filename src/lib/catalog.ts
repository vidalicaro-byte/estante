import { cacheLife } from "next/cache";
import { searchBooks } from "@/lib/open-library";

export const PAGE_SIZE = 20;

/** Cached for hours: book metadata changes slowly and the upstream API is rate-limited. */
export async function searchCatalog(query: string, page: number, limit: number = PAGE_SIZE) {
  "use cache";
  cacheLife("hours");
  return searchBooks(query, { page, limit });
}
