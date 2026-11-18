import type { CardBook } from "./card-book";
import { parseFavorites, toggleFavorite } from "./favorites";

const STORAGE_KEY = "estante:favorites:v1";
const EMPTY: CardBook[] = [];

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedList: CardBook[] = EMPTY;

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // storage blocked (private mode, disabled cookies)
  }
}

/** Must return the same reference while the stored value is unchanged. */
export function getSnapshot(): CardBook[] {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedList = parseFavorites(raw);
  }
  return cachedList;
}

export function getServerSnapshot(): CardBook[] {
  return EMPTY;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  // Fires when ANOTHER tab changes the value, which keeps tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function toggleStoredFavorite(book: CardBook): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toggleFavorite(getSnapshot(), book)));
  } catch {
    return; // quota exceeded or storage blocked: nothing to persist
  }
  listeners.forEach((listener) => listener());
}
