import { describe, expect, it } from "vitest";
import { buildSharePayload, isAbortError } from "./share";

describe("buildSharePayload", () => {
  it("drops the query string and hash", () => {
    const payload = buildSharePayload(
      "Dom Casmurro",
      "https://estante.app/livros/OL1003040W?x=1#topo",
    );
    expect(payload.url).toBe("https://estante.app/livros/OL1003040W");
    expect(payload.text).toBe("Dom Casmurro no Estante");
  });

  it("keeps the path on localhost", () => {
    const payload = buildSharePayload("Machado de Assis", "http://localhost:3000/autores/OL1A");
    expect(payload.url).toBe("http://localhost:3000/autores/OL1A");
  });
});

describe("isAbortError", () => {
  it("is true only for an AbortError DOMException", () => {
    expect(isAbortError(new DOMException("cancelled", "AbortError"))).toBe(true);
    expect(isAbortError(new DOMException("nope", "NotAllowedError"))).toBe(false);
    expect(isAbortError(new Error("AbortError"))).toBe(false);
  });
});
