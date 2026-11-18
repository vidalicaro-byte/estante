import { Suspense } from "react";
import { BookShelf, BookShelfSkeleton } from "@/components/book-shelf";
import { SearchForm } from "@/components/search-form";
import { SHELVES } from "@/lib/shelves";
import Link from "next/link";
import { GENRES } from "@/lib/genres";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Encontre o próximo livro</h1>
        <p className="max-w-prose text-stone-600">
          Busque entre milhões de títulos ou comece pela literatura brasileira.
        </p>
        <SearchForm />
      </section>

      <nav aria-label="Gêneros">
        <h2 className="mb-3 text-sm font-semibold text-stone-500 uppercase">Explorar por gênero</h2>
        <ul className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <li key={genre.slug}>
              <Link
                href={`/generos/${genre.slug}`}
                className="rounded-full border border-stone-300 bg-white px-4 py-1.5 text-sm text-stone-700 hover:border-stone-500 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              >
                {genre.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {SHELVES.map((shelf, index) => (
        <section key={shelf.title} aria-labelledby={`shelf-${shelf.title}`} className="space-y-4">
          <h2 id={`shelf-${shelf.title}`} className="text-xl font-semibold">
            {shelf.title}
          </h2>
          <Suspense fallback={<BookShelfSkeleton />}>
            <BookShelf query={shelf.query} eager={index === 0} />
          </Suspense>
        </section>
      ))}
    </div>
  );
}
