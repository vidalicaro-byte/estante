import Image from "next/image";
import Link from "next/link";
import { coverUrl, type BookSummary } from "@/lib/open-library";

export function BookCard({ book, eager = false }: { book: BookSummary; eager?: boolean }) {
  const authors = book.authors.map((author) => author.name).join(", ");

  return (
    <article className="group relative flex flex-col gap-3">
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-stone-200 shadow-sm">
        {book.coverId ? (
          <Image
            src={coverUrl(book.coverId, "M")}
            alt={`Capa de ${book.title}`}
            fill
            sizes="(min-width: 1024px) 200px, (min-width: 640px) 25vw, 45vw"
            loading={eager ? "eager" : undefined}
            className="object-cover"
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
        <h3 className="leading-snug font-semibold text-stone-900">
          <Link
            href={`/livros/${book.id}`}
            className="rounded-sm group-hover:underline after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700"
          >
            {book.title}
          </Link>
        </h3>
        {authors && <p className="text-sm text-stone-600">{authors}</p>}
        {book.firstPublishYear && <p className="text-sm text-stone-500">{book.firstPublishYear}</p>}
      </div>
    </article>
  );
}
