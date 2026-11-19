"use client";

import Link from "next/link";
import { useFavorites, useHydrated } from "@/lib/use-favorites";
import { BookGrid } from "./book-grid";
import { StateMessage } from "./state-message";

export function FavoritesList() {
  const hydrated = useHydrated();
  const favorites = useFavorites();

  // Until hydration we can't know what's stored, so don't claim the list is empty.
  if (!hydrated) {
    return (
      <div aria-hidden className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="bg-line aspect-[2/3] animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <StateMessage
        title="Sua estante está vazia"
        action={
          <Link
            href="/"
            className="bg-ink text-paper hover:bg-ink/80 inline-block rounded-full px-5 py-2 text-sm font-medium transition-colors"
          >
            Explorar o catálogo
          </Link>
        }
      >
        Clique no coração de qualquer livro para guardá-lo aqui.
      </StateMessage>
    );
  }

  return (
    <>
      <p aria-live="polite" className="text-muted text-sm">
        {favorites.length} {favorites.length === 1 ? "livro salvo" : "livros salvos"}
      </p>
      <BookGrid books={favorites} />
    </>
  );
}
