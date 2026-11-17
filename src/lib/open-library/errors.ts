export class OpenLibraryError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }

  /** Whether trying the same request again might succeed. */
  get retryable(): boolean {
    return false;
  }
}

export class NetworkError extends OpenLibraryError {
  constructor(url: string, options?: ErrorOptions) {
    super(`Network error requesting ${url}`, options);
  }

  override get retryable(): boolean {
    return true;
  }
}

export class TimeoutError extends OpenLibraryError {
  constructor(url: string, timeoutMs: number, options?: ErrorOptions) {
    super(`Request to ${url} timed out after ${timeoutMs}ms`, options);
  }

  override get retryable(): boolean {
    return true;
  }
}

export class HttpError extends OpenLibraryError {
  constructor(
    readonly status: number,
    readonly url: string,
  ) {
    super(`Request to ${url} failed with status ${status}`);
  }

  override get retryable(): boolean {
    return this.status === 429 || this.status >= 500;
  }
}

export class NotFoundError extends HttpError {
  constructor(url: string) {
    super(404, url);
  }
}

export class ValidationError extends OpenLibraryError {
  constructor(url: string, options?: ErrorOptions) {
    super(`Unexpected response shape from ${url}`, options);
  }
}
