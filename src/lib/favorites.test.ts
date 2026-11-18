import { describe, expect, it } from "vitest";
import type { CardBook } from "./card-book";
import { isFavorite, MAX_FAVORITES, parseFavorites, toggleFavorite } from "./favorites";

const book = (id: string): CardBook => ({ id, title: `Livro ${id}`, authors: "Autor" });

describe("parseFavorites", () => {
  it("returns an empty list for missing, malformed or non-array content", () => {
    expect(parseFavorites(null)).toEqual([]);
    expect(parseFavorites("not json")).toEqual([]);
    expect(parseFavorites('{"id":"OL1W"}')).toEqual([]);
  });

  it("keeps valid entries and drops invalid ones", () => {
    const raw = JSON.stringify([
      book("OL1W"),
      { id: "../etc", title: "x", authors: "y" },
      { id: "OL2W", title: 42, authors: "y" },
      { ...book("OL3W"), coverId: -1 },
    ]);

    expect(parseFavorites(raw)).toEqual([book("OL1W")]);
  });

  it("removes duplicates and caps the list size", () => {
    expect(parseFavorites(JSON.stringify([book("OL1W"), book("OL1W")]))).toHaveLength(1);

    const many = Array.from({ length: MAX_FAVORITES + 20 }, (_, index) => book(`OL${index}W`));
    expect(parseFavorites(JSON.stringify(many))).toHaveLength(MAX_FAVORITES);
  });
});

describe("toggleFavorite", () => {
  it("adds new books to the front", () => {
    const result = toggleFavorite([book("OL1W")], book("OL2W"));
    expect(result.map((item) => item.id)).toEqual(["OL2W", "OL1W"]);
  });

  it("removes a book that is already a favorite", () => {
    const result = toggleFavorite([book("OL1W"), book("OL2W")], book("OL1W"));
    expect(result.map((item) => item.id)).toEqual(["OL2W"]);
    expect(isFavorite(result, "OL1W")).toBe(false);
  });
});
