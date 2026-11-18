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
});
