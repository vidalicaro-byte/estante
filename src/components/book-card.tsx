import Image from "next/image";
import Link from "next/link";
import type { CardBook } from "@/lib/card-book";
import { coverUrl } from "@/lib/open-library";
import { FavoriteButton } from "./favorite-button";

export function BookCard({ book, eager = false }: { book: CardBook; eager?: boolean }) {
  return (
    <article className="group relative flex flex-col gap-3">
      <div className="relative">
        <div className="bg-line ring-ink/10 relative aspect-[2/3] overflow-hidden rounded-sm shadow-md ring-1 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
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
            <div aria-hidden className="bg-surface flex h-full flex-col justify-between p-4">
              <span className="font-display text-ink text-lg leading-tight font-semibold">
                {book.title}
              </span>
              <span className="text-muted text-xs">{book.authors}</span>
            </div>
          )}
        </div>

        {/*
          Sibling of the cover, not a child: the cover gets a transform on hover, which
          creates a stacking context and would trap this button's z-index below the
          card's stretched link.
        */}
        <div className="absolute top-2 right-2 z-10 transition-transform duration-300 group-hover:-translate-y-1">
          <FavoriteButton book={book} />
        </div>
      </div>

      <div className="space-y-0.5">
        <h3 className="font-display text-ink text-lg leading-snug font-semibold">
          <Link
            href={`/livros/${book.id}`}
            className="group-hover:text-accent rounded-sm after:absolute after:inset-0"
          >
            {book.title}
          </Link>
        </h3>
        {book.authors && <p className="text-muted text-sm">{book.authors}</p>}
        {book.firstPublishYear && <p className="text-muted text-xs">{book.firstPublishYear}</p>}
      </div>
    </article>
  );
}
