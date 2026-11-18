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
  if (!response.ok) throw new HttpError(response.status, href);

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
      return await requestOnce(url, schema, timeoutMs, signal);
    } catch (error) {
      const canRetry =
        error instanceof OpenLibraryError &&
        error.retryable &&
        attempt < MAX_RETRIES &&
        !signal?.aborted;
      if (!canRetry) throw error;
      await sleep(retryDelayMs * 2 ** attempt);
    }
  }
}
