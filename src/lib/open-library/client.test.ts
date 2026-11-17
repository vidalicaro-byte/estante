import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { fetchJson } from "./client";
import { HttpError, NotFoundError, ValidationError } from "./errors";

const schema = z.object({ title: z.string() });
const options = { retryDelayMs: 0 };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("fetchJson", () => {
  it("returns validated data on success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(jsonResponse({ title: "Dom Casmurro" }));

    await expect(fetchJson("/works/OL1W.json", schema, options)).resolves.toEqual({
      title: "Dom Casmurro",
    });
  });

  it("retries on 5xx and succeeds", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(jsonResponse({}, 503))
      .mockResolvedValueOnce(jsonResponse({ title: "Memórias Póstumas" }));

    await expect(fetchJson("/x.json", schema, options)).resolves.toEqual({
      title: "Memórias Póstumas",
    });
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("gives up after exhausting retries", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => jsonResponse({}, 503));

    await expect(fetchJson("/x.json", schema, options)).rejects.toBeInstanceOf(HttpError);
    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });

  it("does not retry on 404", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({}, 404));

    await expect(fetchJson("/x.json", schema, options)).rejects.toBeInstanceOf(NotFoundError);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("throws ValidationError when the response shape is unexpected", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(jsonResponse({ title: 42 }));

    await expect(fetchJson("/x.json", schema, options)).rejects.toBeInstanceOf(ValidationError);
  });
});
