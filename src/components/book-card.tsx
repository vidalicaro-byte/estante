import Image from "next/image";
import { coverUrl, type BookSummary } from "@/lib/open-library";

export function BookCard({ book, eager = false }: { book: BookSummary; eager?: boolean }) {
  const authors = book.authors.map((author) => author.name).join(", ");

  return (
    <article className="flex flex-col gap-3">
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-stone-200 shadow-sm">
        {book.coverId ? (
          <Image
            src={coverUrl(book.coverId, "M")}
            alt={`Capa de ${book.title}`}
            fill
            sizes="(min-width: 1024px) 200px, (min-width: 640px) 25vw, 45vw"
            className="object-cover"
            loading={eager ? "eager" : undefined}
          />
        ) : (
          <div
            aria-hidden
            className="flex h-full items-center justify-center p-3 text-center text-sm text-stone-500"
          >
            Sem capa
          </div>
        )}
      </div>
      <div>
        <h3 className="leading-snug font-semibold text-stone-900">{book.title}</h3>
        {authors && <p className="text-sm text-stone-600">{authors}</p>}
        {book.firstPublishYear && <p className="text-sm text-stone-500">{book.firstPublishYear}</p>}
      </div>
    </article>
  );
}
