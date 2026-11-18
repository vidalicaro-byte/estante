"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/use-favorites";

export function FavoritesLink() {
  const count = useFavorites().length;

  return (
    <Link href="/favoritos" className="text-ink/80 hover:text-ink hover:underline">
      Favoritos
      {count > 0 && (
        <>
          <span aria-hidden className="bg-ink text-paper ml-1.5 rounded-full px-2 py-0.5 text-xs">
            {count}
          </span>
          <span className="sr-only"> ({count})</span>
        </>
      )}
    </Link>
  );
}
