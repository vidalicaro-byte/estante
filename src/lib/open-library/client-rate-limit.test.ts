import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { fetchJson } from "./client";
import { HttpError } from "./errors";

const schema = z.object({ title: z.string() });
const options = { retryDelayMs: 1 };

function response(status: number, body: unknown = {}, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("rate limiting", () => {
  it("retries a 429 and succeeds", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(response(429, {}, { "Retry-After": "0" }))
      .mockResolvedValueOnce(response(200, { title: "Dom Casmurro" }));

    await expect(fetchJson("/x.json", schema, options)).resolves.toEqual({
      title: "Dom Casmurro",
    });
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("gives up after the retry limit and exposes the 429", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(() => Promise.resolve(response(429)));

    const error = await fetchJson("/x.json", schema, options).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).status).toBe(429);
    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });

  it("reads Retry-After in seconds and ignores invalid values", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(response(429, {}, { "Retry-After": "0" }))
      .mockResolvedValueOnce(response(429, {}, { "Retry-After": "abc" }))
      .mockResolvedValueOnce(response(200, { title: "ok" }));

    await expect(fetchJson("/x.json", schema, { retryDelayMs: 1 })).resolves.toEqual({
      title: "ok",
    });
  });
});
