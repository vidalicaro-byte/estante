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

export interface Author {
  id: string;
  name: string;
  birthDate?: string;
  deathDate?: string;
  /** Plain-text paragraphs. Empty when the author has no bio. */
  bio: string[];
  photoIds: number[];
  links: ExternalLink[];
}
