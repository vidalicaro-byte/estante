"use client";

import type { CardBook } from "@/lib/card-book";
import { isFavorite } from "@/lib/favorites";
import { toggleStoredFavorite } from "@/lib/favorites-store";
import { useFavorites } from "@/lib/use-favorites";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

export function FavoriteButton({
  book,
  variant = "icon",
}: {
  book: CardBook;
  variant?: "icon" | "full";
}) {
  const active = isFavorite(useFavorites(), book.id);
  const color = active ? "text-rose-600" : "text-stone-700";
  const focus =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700";

  // The name stays constant; aria-pressed conveys the on/off state.
  if (variant === "full") {
    return (
      <button
        type="button"
        aria-pressed={active}
        onClick={() => toggleStoredFavorite(book)}
        className={`inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium hover:bg-stone-100 ${color} ${focus}`}
      >
        <HeartIcon filled={active} />
        Favoritar
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`Favoritar ${book.title}`}
      onClick={() => toggleStoredFavorite(book)}
      className={`rounded-full bg-white/90 p-2 shadow-sm hover:bg-white ${color} ${focus}`}
    >
      <HeartIcon filled={active} />
    </button>
  );
}
