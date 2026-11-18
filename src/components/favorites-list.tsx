"use client";

import Link from "next/link";
import { useFavorites, useHydrated } from "@/lib/use-favorites";
import { BookGrid } from "./book-grid";

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
      <div className="border-line space-y-3 rounded-md border border-dashed p-8 text-center">
        <p className="text-muted">Você ainda não favoritou nenhum livro.</p>
        <Link href="/" className="text-accent underline">
          Explorar o catálogo
        </Link>
      </div>
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
