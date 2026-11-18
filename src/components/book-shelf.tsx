import { searchCatalog } from "@/lib/catalog";
import { BookGrid } from "./book-grid";

async function loadBooks(query: string, limit: number) {
  try {
    return (await searchCatalog(query, 1, limit)).books;
  } catch {
    return null;
  }
}

export async function BookShelf({
  query,
  limit = 5,
  eager = false,
}: {
  query: string;
  limit?: number;
  /** Mark the first row of covers as above-the-fold. */
  eager?: boolean;
}) {
  const books = await loadBooks(query, limit);

  if (books === null) {
    return (
      <p className="rounded-md bg-amber-50 p-4 text-sm text-amber-900">
        Não foi possível carregar esta prateleira agora. Tente novamente em instantes.
      </p>
    );
  }

  return <BookGrid books={books} eagerCount={eager ? 5 : 0} />;
}

export function BookShelfSkeleton() {
  return (
    <div aria-hidden className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="aspect-[2/3] animate-pulse rounded-md bg-stone-200" />
      ))}
    </div>
  );
}
