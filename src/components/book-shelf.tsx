import { toCardBook } from "@/lib/card-book";
import { searchCatalog } from "@/lib/catalog";
import { BookGrid } from "./book-grid";

/**
 * Errors are not caught here on purpose. This component renders inside statically
 * generated pages, and a caught error would be baked into the HTML. Letting it throw
 * fails the build (or keeps the last good page when a revalidation fails).
 */
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
  const { books } = await searchCatalog(query, 1, limit);
  return <BookGrid books={books.map(toCardBook)} eagerCount={eager ? 5 : 0} />;
}

export function BookShelfSkeleton() {
  return (
    <div aria-hidden className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="bg-line aspect-[2/3] animate-pulse rounded-md" />
      ))}
    </div>
  );
}
