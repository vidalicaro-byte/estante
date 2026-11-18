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
          <div key={index} className="aspect-[2/3] animate-pulse rounded-md bg-stone-200" />
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="space-y-3 rounded-md border border-dashed border-stone-300 p-8 text-center">
        <p className="text-stone-600">Você ainda não favoritou nenhum livro.</p>
        <Link href="/" className="text-amber-800 underline">
          Explorar o catálogo
        </Link>
      </div>
    );
  }

  return (
    <>
      <p aria-live="polite" className="text-sm text-stone-600">
        {favorites.length} {favorites.length === 1 ? "livro salvo" : "livros salvos"}
      </p>
      <BookGrid books={favorites} />
    </>
  );
}
