import { fetchJson } from "./client";
import { InvalidIdError } from "./errors";
import { toAuthor, toBookSummary, toWork } from "./mappers";
import { authorSchema, searchResponseSchema, workSchema } from "./schemas";
import type { Author, SearchResult, Work } from "./types";

const SEARCH_FIELDS = [
  "key",
  "title",
  "author_name",
  "author_key",
  "first_publish_year",
  "cover_i",
  "subject",
  "language",
].join(",");

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

interface CallOptions {
  signal?: AbortSignal;
}

export interface SearchBooksOptions extends CallOptions {
  /** 1-based page number. */
  page?: number;
  limit?: number;
}

function assertId(id: string, pattern: RegExp): void {
  if (!pattern.test(id)) throw new InvalidIdError(id);
}

export async function searchBooks(
  query: string,
  { page = 1, limit = DEFAULT_PAGE_SIZE, signal }: SearchBooksOptions = {},
): Promise<SearchResult> {
  const q = query.trim();
  const pageSize = Math.min(Math.max(Math.floor(limit), 1), MAX_PAGE_SIZE);
  const currentPage = Math.max(Math.floor(page), 1);

  if (q === "") {
    return { query: q, total: 0, page: currentPage, pageSize, totalPages: 0, books: [] };
  }

  const response = await fetchJson("/search.json", searchResponseSchema, {
    searchParams: { q, page: currentPage, limit: pageSize, fields: SEARCH_FIELDS },
    signal,
  });

  return {
    query: q,
    total: response.numFound,
    page: currentPage,
    pageSize,
    totalPages: Math.ceil(response.numFound / pageSize),
    books: response.docs.map(toBookSummary),
  };
}

export async function getWork(id: string, { signal }: CallOptions = {}): Promise<Work> {
  assertId(id, /^OL\d+W$/);
  return toWork(await fetchJson(`/works/${id}.json`, workSchema, { signal }));
}

export async function getAuthor(id: string, { signal }: CallOptions = {}): Promise<Author> {
  assertId(id, /^OL\d+A$/);
  return toAuthor(await fetchJson(`/authors/${id}.json`, authorSchema, { signal }));
}
