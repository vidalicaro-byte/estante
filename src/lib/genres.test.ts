import { describe, expect, it } from "vitest";
import { findGenre, GENRES } from "./genres";

describe("GENRES", () => {
  it("has unique, url-safe slugs", () => {
    const slugs = GENRES.map((genre) => genre.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("finds a genre by slug", () => {
    expect(findGenre("fantasia")?.label).toBe("Fantasia");
    expect(findGenre("nao-existe")).toBeUndefined();
  });

  it("keeps curated shelves valid and unique", () => {
    const classics = findGenre("classicos");
    expect(classics?.shelves?.length).toBeGreaterThan(0);

    const shelves = classics?.shelves ?? [];
    for (const shelf of shelves) expect(shelf.query).toMatch(/^author_key:OL\d+A$/);
    expect(new Set(shelves.map((shelf) => shelf.query)).size).toBe(shelves.length);
    expect(new Set(shelves.map((shelf) => shelf.title)).size).toBe(shelves.length);
  });
});
