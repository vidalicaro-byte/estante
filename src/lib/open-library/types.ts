export interface AuthorRef {
  /** Open Library id, e.g. "OL93286A". Missing when the API doesn't provide one. */
  id?: string;
  name: string;
}

export interface BookSummary {
  /** Work id, e.g. "OL1003040W". */
  id: string;
  title: string;
  authors: AuthorRef[];
  firstPublishYear?: number;
  coverId?: number;
  subjects: string[];
  languages: string[];
}

export interface SearchResult {
  query: string;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  books: BookSummary[];
}

export interface ExternalLink {
  title: string;
  url: string;
}

export interface Work {
  id: string;
  title: string;
  /** Plain-text paragraphs. Empty when the work has no description. */
  description: string[];
  coverIds: number[];
  subjects: string[];
  authorIds: string[];
  links: ExternalLink[];
}

export type TextLanguage = "pt" | "en" | "other";

/** A block of text in one language. Open Library often stores translations back to back. */
export interface TextSection {
  language: TextLanguage;
  paragraphs: string[];
}

export interface Author {
  id: string;
  name: string;
  birthDate?: string;
  deathDate?: string;

  /** Sections in display order: Portuguese first when present. Empty when there is no bio. */
  bio: TextSection[];
  photoIds: number[];
  links: ExternalLink[];
}
