"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/use-favorites";

export function FavoritesLink() {
  const count = useFavorites().length;

  return (
    <Link href="/favoritos" className="text-stone-700 hover:text-stone-900 hover:underline">
      Favoritos
      {count > 0 && (
        <>
          <span
            aria-hidden
            className="ml-1.5 rounded-full bg-stone-900 px-2 py-0.5 text-xs text-white"
          >
            {count}
          </span>
          <span className="sr-only"> ({count})</span>
        </>
      )}
    </Link>
  );
}
