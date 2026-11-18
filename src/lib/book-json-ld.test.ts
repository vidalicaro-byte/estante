import { describe, expect, it } from "vitest";
import { bookJsonLd } from "./book-json-ld";
import type { Author, Work } from "./open-library";
import { truncate } from "./text";

const author: Author = {
  id: "OL93286A",
  name: "Machado de Assis",
  bio: [],
  photoIds: [],
  links: [],
};

const work: Work = {
  id: "OL1003040W",
  title: "Dom Casmurro",
  description: ["Primeiro parágrafo.", "Segundo parágrafo."],
  coverIds: [647501],
  subjects: ["Fiction", "Brazilian literature"],
  authorIds: ["OL93286A"],
  links: [],
};

describe("bookJsonLd", () => {
  it("describes a complete book", () => {
    expect(bookJsonLd(work, [author])).toEqual({
      "@context": "https://schema.org",
      "@type": "Book",
      name: "Dom Casmurro",
      sameAs: "https://openlibrary.org/works/OL1003040W",
      author: [{ "@type": "Person", name: "Machado de Assis" }],
      description: "Primeiro parágrafo.\n\nSegundo parágrafo.",
      image: "https://covers.openlibrary.org/b/id/647501-L.jpg",
      keywords: "Fiction, Brazilian literature",
    });
  });

  it("omits fields it has no data for", () => {
    const sparse = { ...work, description: [], coverIds: [], subjects: [] };
    const data = bookJsonLd(sparse, []);

    expect(data).not.toHaveProperty("author");
    expect(data).not.toHaveProperty("description");
    expect(data).not.toHaveProperty("image");
    expect(data).not.toHaveProperty("keywords");
  });
});

describe("truncate", () => {
  it("leaves short text alone", () => {
    expect(truncate("curto", 20)).toBe("curto");
  });

  it("cuts at a word boundary", () => {
    expect(truncate("aaaa bbbb cccc dddd", 12)).toBe("aaaa bbbb…");
  });
});
