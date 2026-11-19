import { afterEach, describe, expect, it, vi } from "vitest";
import { getAuthor, getWork, searchBooks } from "./api";
import { authorPhotoUrl, coverUrl } from "./covers";
import { InvalidIdError } from "./errors";
import { authorFixture, searchFixture, workFixture } from "./fixtures";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("searchBooks", () => {
  it("maps results, handles missing optional fields and computes pagination", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(jsonResponse(searchFixture));

    const result = await searchBooks("  dom casmurro ", { page: 2, limit: 2 });

    const url = new URL(String(fetchSpy.mock.calls[0]?.[0]));
    expect(url.pathname).toBe("/search.json");
    expect(url.searchParams.get("q")).toBe("dom casmurro");
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("limit")).toBe("2");

    expect(result).toMatchObject({ total: 85, page: 2, pageSize: 2, totalPages: 43 });
    expect(result.books[0]).toEqual({
      id: "OL1003040W",
      title: "Dom Casmurro",
      authors: [{ id: "OL93286A", name: "Machado de Assis" }],
      firstPublishYear: 1899,
      coverId: 647501,
      subjects: ["Fiction", "Brazilian literature"],
      languages: ["fre", "por"],
    });
    expect(result.books[1]?.coverId).toBeUndefined();
    expect(result.books[1]?.subjects).toEqual([]);
  });

  it("does not hit the network for an empty query", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const result = await searchBooks("   ");

    expect(result.books).toEqual([]);
    expect(result.totalPages).toBe(0);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("keeps the page usable when a non-essential field has an unexpected type", async () => {
    const broken = {
      ...searchFixture,
      docs: [{ ...searchFixture.docs[0], subject: "not-an-array" }],
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(jsonResponse(broken));

    const result = await searchBooks("dom casmurro");

    expect(result.books[0]?.title).toBe("Dom Casmurro");
    expect(result.books[0]?.subjects).toEqual([]);
  });
});

describe("getWork", () => {
  it("normalizes description, covers, authors and links", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(jsonResponse(workFixture));

    const work = await getWork("OL1003040W");

    expect(work.id).toBe("OL1003040W");
    expect(work.description).toEqual([
      "Dom Casmurro, publicado em 1899, é um romance realista.",
      "Segundo parágrafo.",
    ]);
    expect(work.coverIds).toEqual([647501, 123224, 2152130]);
    expect(work.authorIds).toEqual(["OL93286A"]);
    expect(work.links.map((link) => link.title)).toEqual(["Free eBook"]);
  });

  it("accepts a description given as a plain string", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      jsonResponse({ ...workFixture, description: "Texto simples." }),
    );

    await expect(getWork("OL1003040W")).resolves.toMatchObject({
      description: ["Texto simples."],
    });
  });

  it("rejects malformed ids before making a request", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    await expect(getWork("../authors/OL1A")).rejects.toBeInstanceOf(InvalidIdError);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("getAuthor", () => {
  it("splits the bio into paragraphs and filters invalid photos", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(jsonResponse(authorFixture));

    const author = await getAuthor("OL93286A");

    expect(author).toMatchObject({
      id: "OL93286A",
      name: "Machado de Assis",
      birthDate: "21 June 1839",
      deathDate: "29 September 1908",
      photoIds: [8569287],
    });
    // Portuguese first (the site is in pt-BR); the English translation stays available.
    expect(author.bio).toEqual([
      { language: "pt", paragraphs: ["Machado de Assis foi um escritor brasileiro."] },
      { language: "en", paragraphs: ["Machado de Assis was a pioneer Brazilian novelist."] },
    ]);
  });

  it("rejects a work id passed as author id", async () => {
    await expect(getAuthor("OL1003040W")).rejects.toBeInstanceOf(InvalidIdError);
  });
});

describe("image urls", () => {
  it("builds cover and author photo urls", () => {
    expect(coverUrl(647501, "L")).toBe("https://covers.openlibrary.org/b/id/647501-L.jpg");
    expect(authorPhotoUrl(8569287)).toBe("https://covers.openlibrary.org/a/id/8569287-M.jpg");
  });
});
