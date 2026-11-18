import type { Metadata } from "next";
import { Suspense } from "react";
import { BookGrid } from "@/components/book-grid";
import { BookShelfSkeleton } from "@/components/book-shelf";
import { Pagination } from "@/components/pagination";
import { SearchForm } from "@/components/search-form";
import { searchCatalog } from "@/lib/catalog";
import { parsePage } from "@/lib/pagination";

export const metadata: Metadata = { title: "Busca" };

export default function SearchPage({ searchParams }: PageProps<"/busca">) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <SearchForm />
          <BookShelfSkeleton />
        </div>
      }
    >
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchResults({ searchParams }: Pick<PageProps<"/busca">, "searchParams">) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (rawQuery ?? "").trim().slice(0, 200);
  const page = parsePage(params.page);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Busca</h1>
      <SearchForm defaultValue={query} />
      {query === "" ? (
        <p className="text-stone-600">Digite um título, autor ou assunto para começar.</p>
      ) : (
        <Results query={query} page={page} />
      )}
    </div>
  );
}

async function Results({ query, page }: { query: string; page: number }) {
  let result;
  try {
    result = await searchCatalog(query, page);
  } catch {
    return (
      <p role="alert" className="rounded-md bg-amber-50 p-4 text-amber-900">
        A busca está indisponível no momento. Tente novamente em instantes.
      </p>
    );
  }

  if (result.books.length === 0) {
    return <p className="text-stone-600">Nenhum resultado para “{query}”.</p>;
  }

  return (
    <>
      <p aria-live="polite" className="text-sm text-stone-600">
        {result.total.toLocaleString("pt-BR")} resultados para “{query}”
      </p>
      <BookGrid books={result.books} eagerCount={5} />
      <Pagination query={query} page={result.page} totalPages={Math.min(result.totalPages, 50)} />
    </>
  );
}
