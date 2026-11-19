import { describe, expect, it } from "vitest";
import { displayQuery } from "./search-query";

describe("displayQuery", () => {
  it("uses the label of known shelves and genres", () => {
    expect(displayQuery('author:"Machado de Assis"')).toBe("Machado de Assis");
    expect(displayQuery('subject:"brazilian literature"')).toBe("Literatura brasileira");
  });

  it("unwraps field syntax for other queries", () => {
    expect(displayQuery('subject:"Fiction, general"')).toBe("Fiction, general");
    expect(displayQuery("author_key:OL93286A")).toBe("Obras do autor");
  });

  it("leaves free text alone", () => {
    expect(displayQuery("dom casmurro")).toBe("dom casmurro");
  });
});
