import { coverUrl, type Author, type Work } from "@/lib/open-library";

export function bookJsonLd(work: Work, authors: Author[]): Record<string, unknown> {
  const firstCover = work.coverIds[0];

  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: work.title,
    sameAs: `https://openlibrary.org/works/${work.id}`,
    ...(authors.length > 0
      ? { author: authors.map((author) => ({ "@type": "Person", name: author.name })) }
      : {}),
    ...(work.description.length > 0 ? { description: work.description.join("\n\n") } : {}),
    ...(firstCover !== undefined ? { image: coverUrl(firstCover, "L") } : {}),
    ...(work.subjects.length > 0 ? { keywords: work.subjects.slice(0, 10).join(", ") } : {}),
  };
}
