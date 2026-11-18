import Link from "next/link";
import { Suspense } from "react";
import { BookShelf, BookShelfSkeleton } from "@/components/book-shelf";
import { SearchForm } from "@/components/search-form";
import { GENRES } from "@/lib/genres";
import { SHELVES } from "@/lib/shelves";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="animate-fade-up space-y-6 pt-4 sm:pt-12">
        <p className="text-accent text-sm font-medium tracking-widest uppercase">
          Catálogo de livros
        </p>
        <h1 className="font-display max-w-3xl text-5xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
          Encontre o próximo livro de que você vai <em className="text-accent">se lembrar</em>.
        </h1>
        <p className="text-muted max-w-xl text-lg">
          Busque entre milhões de títulos ou comece pela literatura brasileira.
        </p>
        <SearchForm />
      </section>

      <nav aria-label="Gêneros" className="space-y-3">
        <h2 className="text-muted text-sm font-medium tracking-widest uppercase">
          Explorar por gênero
        </h2>
        <ul className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <li key={genre.slug}>
              <Link
                href={`/generos/${genre.slug}`}
                className="border-line text-ink/80 hover:border-accent hover:text-accent inline-block rounded-full border px-4 py-1.5 text-sm transition-colors"
              >
                {genre.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {SHELVES.map((shelf, index) => (
        <section
          key={shelf.title}
          aria-labelledby={`shelf-${index}`}
          className="border-line space-y-6 border-t pt-8"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2
              id={`shelf-${index}`}
              className="font-display text-2xl font-semibold tracking-tight"
            >
              {shelf.title}
            </h2>
            <Link
              href={`/busca?q=${encodeURIComponent(shelf.query)}`}
              className="text-accent shrink-0 text-sm hover:underline"
            >
              Ver mais<span className="sr-only"> de {shelf.title}</span> →
            </Link>
          </div>
          <Suspense fallback={<BookShelfSkeleton />}>
            <BookShelf query={shelf.query} eager={index === 0} />
          </Suspense>
        </section>
      ))}
    </div>
  );
}
