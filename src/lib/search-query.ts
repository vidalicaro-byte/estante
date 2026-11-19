import { GENRES } from "./genres";
import { SHELVES } from "./shelves";

const KNOWN_QUERIES = [
  ...SHELVES.map((shelf) => ({ query: shelf.query, label: shelf.title })),
  ...GENRES.map((genre) => ({ query: genre.query, label: genre.label })),
];

/** Turns internal search syntax (author:"X", subject:"Y") into a readable title. */
export function displayQuery(query: string): string {
  const known = KNOWN_QUERIES.find((item) => item.query === query);
  if (known) return known.label;
  if (/^author_key:OL\d+A$/.test(query)) return "Obras do autor";
  return /^(?:author|subject):"(.*)"$/.exec(query)?.[1] ?? query;
}
