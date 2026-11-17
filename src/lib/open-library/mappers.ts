import type { RawAuthor, RawWork, SearchDoc } from "./schemas";
import type { Author, BookSummary, ExternalLink, Work } from "./types";

/** "/works/OL1003040W" -> "OL1003040W" */
export function idFromKey(key: string): string {
  return key.split("/").at(-1) ?? key;
}

/** The API uses -1 as a placeholder for "no image". */
function validIds(ids: number[] | undefined): number[] {
  return (ids ?? []).filter((id) => Number.isInteger(id) && id > 0);
}

function readText(value: string | { value: string } | undefined): string {
  if (value === undefined) return "";
  return typeof value === "string" ? value : value.value;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)/g, "")
    .trim();
}

/** Splits free text into clean paragraphs, dropping "-----" separators. */
export function toParagraphs(value: string | { value: string } | undefined): string[] {
  return readText(value)
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map(stripMarkdown)
    .filter((paragraph) => paragraph !== "" && !/^[-=_*\s]{3,}$/.test(paragraph));
}

function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

/** Open Library is user-editable, so links are untrusted: keep only http(s). */
function safeLinks(links: { title: string; url: string }[] | undefined): ExternalLink[] {
  return (links ?? [])
    .filter((link) => isHttpUrl(link.url))
    .map(({ title, url }) => ({ title, url }));
}

export function toBookSummary(doc: SearchDoc): BookSummary {
  const keys = doc.author_key ?? [];
  return {
    id: idFromKey(doc.key),
    title: doc.title,
    authors: (doc.author_name ?? []).map((name, index) => {
      const key = keys[index];
      return key === undefined ? { name } : { name, id: key };
    }),
    firstPublishYear: doc.first_publish_year,
    coverId: doc.cover_i,
    subjects: doc.subject ?? [],
    languages: doc.language ?? [],
  };
}

export function toWork(raw: RawWork): Work {
  return {
    id: idFromKey(raw.key),
    title: raw.title,
    description: toParagraphs(raw.description),
    coverIds: validIds(raw.covers),
    subjects: raw.subjects ?? [],
    authorIds: (raw.authors ?? []).flatMap((entry) =>
      entry.author ? [idFromKey(entry.author.key)] : [],
    ),
    links: safeLinks(raw.links),
  };
}

export function toAuthor(raw: RawAuthor): Author {
  return {
    id: idFromKey(raw.key),
    name: raw.name,
    birthDate: raw.birth_date,
    deathDate: raw.death_date,
    bio: toParagraphs(raw.bio),
    photoIds: validIds(raw.photos),
    links: safeLinks(raw.links),
  };
}
