import type { Metadata } from "next";
import { FavoritesList } from "@/components/favorites-list";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Favoritos",
  robots: { index: false },
};

export default function FavoritesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Sua coleção"
        title="Favoritos"
        description="Os livros que você salvou ficam guardados neste navegador."
      />
      <FavoritesList />
    </div>
  );
}
