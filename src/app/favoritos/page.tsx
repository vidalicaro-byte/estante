import type { Metadata } from "next";
import { FavoritesList } from "@/components/favorites-list";

export const metadata: Metadata = {
  title: "Favoritos",
  robots: { index: false },
};

export default function FavoritesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Favoritos</h1>
      <p className="text-muted">Seus livros salvos ficam guardados neste navegador.</p>
      <FavoritesList />
    </div>
  );
}
