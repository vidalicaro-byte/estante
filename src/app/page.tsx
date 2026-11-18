import { Suspense } from "react";
import { BookShelf, BookShelfSkeleton } from "@/components/book-shelf";
import { SearchForm } from "@/components/search-form";

const SHELVES = [
  { title: "Machado de Assis", query: 'author:"Machado de Assis"' },
  { title: "Clarice Lispector", query: 'author:"Clarice Lispector"' },
  { title: "Guimarães Rosa", query: 'author:"João Guimarães Rosa"' },
  { title: "Lima Barreto", query: 'author:"Lima Barreto"' },
];

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
