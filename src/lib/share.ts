export interface SharePayload {
  title: string;
  text: string;
  url: string;
}

/** The shared link never carries the query string or hash of the current page. */
export function buildSharePayload(title: string, href: string): SharePayload {
  const url = new URL(href);
  url.search = "";
  url.hash = "";
  return { title, text: `${title} no Estante`, url: url.toString() };
}

/** Closing the native share sheet rejects with an AbortError; that is not a failure. */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}
