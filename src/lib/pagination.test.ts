import { describe, expect, it } from "vitest";
import { MAX_PAGE, pageWindow, parsePage } from "./pagination";

describe("parsePage", () => {
  it("falls back to 1 for missing or invalid values", () => {
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage("abc")).toBe(1);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-3")).toBe(1);
  });

  it("parses valid values, using the first when repeated", () => {
    expect(parsePage("4")).toBe(4);
    expect(parsePage(["7", "2"])).toBe(7);
  });

  it("caps very deep pages", () => {
    expect(parsePage("99999")).toBe(MAX_PAGE);
  });
});

describe("pageWindow", () => {
  it("lists every page when there are few", () => {
    expect(pageWindow(1, 3)).toEqual([1, 2, 3]);
  });

  it("collapses the gaps", () => {
    expect(pageWindow(1, 20)).toEqual([1, 2, "…", 20]);
    expect(pageWindow(10, 20)).toEqual([1, "…", 9, 10, 11, "…", 20]);
    expect(pageWindow(20, 20)).toEqual([1, "…", 19, 20]);
  });
});
