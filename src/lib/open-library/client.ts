import type { ZodType } from "zod";
import {
  HttpError,
  NetworkError,
  NotFoundError,
  OpenLibraryError,
  TimeoutError,
  ValidationError,
} from "./errors";

const BASE_URL = "https://openlibrary.org";
const USER_AGENT =
  "Estante/0.1 (https://github.com/vidalicaro-byte/estante; vidalicaro@hotmail.com)";
const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_RETRY_DELAY_MS = 300;
/** The production build hits the API from several workers at once, so it retries harder. */
const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";
const MAX_RETRIES = IS_BUILD ? 5 : 2;

/**
 * Open Library allows about 3 requests per second to identified clients and answers 429
 * beyond that. The build runs in several worker processes, each with its own limiter, so
 * it spaces requests wider. Tests run without throttling.
 */
const MIN_INTERVAL_MS = process.env.VITEST ? 0 : IS_BUILD ? 1_000 : 350;
const MAX_RETRY_AFTER_MS = 30_000;
let nextSlot = 0;

export type SearchParams = Record<string, string | number | undefined>;

export interface RequestOptions {
  searchParams?: SearchParams;
  timeoutMs?: number;
  /** Base delay for exponential backoff between retries. */
  retryDelayMs?: number;
  signal?: AbortSignal;
}

function buildUrl(path: string, searchParams?: SearchParams): URL {
  const url = new URL(path, BASE_URL);
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return url;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Waits for this process's next free request slot. */
async function throttle(): Promise<void> {
  if (MIN_INTERVAL_MS === 0) return;
  const now = Date.now();
  const start = Math.max(now, nextSlot);
  nextSlot = start + MIN_INTERVAL_MS;
  if (start > now) await sleep(start - now);
}

/** Retry-After as seconds. HTTP dates are rare here and are ignored. */
function parseRetryAfter(header: string | null): number | undefined {
  if (header === null) return undefined;
  const seconds = Number(header);
  if (!Number.isFinite(seconds) || seconds < 0) return undefined;
  return Math.min(seconds * 1000, MAX_RETRY_AFTER_MS);
}

async function requestOnce<T>(
  url: URL,
  schema: ZodType<T>,
  timeoutMs: number,
  signal?: AbortSignal,
): Promise<T> {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const combined = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;
  const href = url.toString();

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": USER_AGENT },
      signal: combined,
    });
  } catch (error) {
    if (timeoutSignal.aborted) throw new TimeoutError(href, timeoutMs, { cause: error });
    if (signal?.aborted) throw error;
    throw new NetworkError(href, { cause: error });
  }

  if (response.status === 404) throw new NotFoundError(href);
  if (!response.ok) {
    const retryAfterMs = parseRetryAfter(response.headers.get("Retry-After"));
    throw new HttpError(response.status, href, retryAfterMs);
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch (error) {
    if (timeoutSignal.aborted) throw new TimeoutError(href, timeoutMs, { cause: error });
    throw new ValidationError(href, { cause: error });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) throw new ValidationError(href, { cause: parsed.error });
  return parsed.data;
}

export async function fetchJson<T>(
  path: string,
  schema: ZodType<T>,
  options: RequestOptions = {},
): Promise<T> {
  const {
    searchParams,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retryDelayMs = DEFAULT_RETRY_DELAY_MS,
    signal,
  } = options;
  const url = buildUrl(path, searchParams);

  for (let attempt = 0; ; attempt++) {
    try {
      await throttle();
      return await requestOnce(url, schema, timeoutMs, signal);
    } catch (error) {
      const canRetry =
        error instanceof OpenLibraryError &&
        error.retryable &&
        attempt < MAX_RETRIES &&
        !signal?.aborted;
      if (!canRetry) throw error;
      // A 429 means we are going too fast: wait much longer, or as long as the server asks.
      const delay =
        error instanceof HttpError && error.status === 429
          ? Math.max(error.retryAfterMs ?? 0, retryDelayMs * 8 * (attempt + 1))
          : retryDelayMs * 2 ** attempt;
      await sleep(delay);
    }
  }
}
