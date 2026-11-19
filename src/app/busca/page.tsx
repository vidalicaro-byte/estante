import type { Metadata } from "next";
import { Suspense } from "react";
import { BookGrid } from "@/components/book-grid";
import { BookShelfSkeleton } from "@/components/book-shelf";
import { GenreChips } from "@/components/genre-chips";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { SearchForm } from "@/components/search-form";
import { StateMessage } from "@/components/state-message";
import { toCardBook } from "@/lib/card-book";
import { searchCatalog } from "@/lib/catalog";
import { MAX_PAGE, parsePage } from "@/lib/pagination";
import { displayQuery } from "@/lib/search-query";

export const metadata: Metadata = { title: "Busca" };

export default function SearchPage({ searchParams }: PageProps<"/busca">) {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <SearchForm />
          <BookShelfSkeleton />
        </div>
      }
    >
      <SearchContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchContent({ searchParams }: Pick<PageProps<"/busca">, "searchParams">) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (rawQuery ?? "").trim().slice(0, 200);
  const page = parsePage(params.page);

  return (
    <div className="space-y-8">
      {query === "" ? (
        <PageHeader
          eyebrow="Busca"
          title="O que você quer ler?"
          description="Digite um título, autor ou assunto."
        />
      ) : (
        <PageHeader eyebrow="Resultados para" title={displayQuery(query)} />
      )}

      <SearchForm defaultValue={query} />

      {query === "" ? (
        <section aria-labelledby="explorar" className="space-y-3">
          <h2 id="explorar" className="text-muted text-sm font-medium tracking-widest uppercase">
            Ou explore por gênero
          </h2>
          <GenreChips />
        </section>
      ) : (
        <Results query={query} page={page} />
      )}
    </div>
  );
}

async function Results({ query, page }: { query: string; page: number }) {
  let result: Awaited<ReturnType<typeof searchCatalog>>;
  try {
    result = await searchCatalog(query, page);
  } catch {
    return (
      <StateMessage tone="error" title="A busca está indisponível agora">
        A Open Library não respondeu. Atualize a página em instantes.
      </StateMessage>
    );
  }

  if (result.books.length === 0) {
    return (
      <StateMessage title="Nenhum resultado encontrado">
        Confira a ortografia ou tente termos mais gerais, como só o sobrenome do autor.
      </StateMessage>
    );
  }

  const totalPages = Math.min(result.totalPages, MAX_PAGE);

  return (
    <>
      <p aria-live="polite" className="text-muted text-sm">
        {result.total.toLocaleString("pt-BR")} {result.total === 1 ? "resultado" : "resultados"}
        {totalPages > 1 && ` · página ${result.page} de ${totalPages}`}
      </p>
      <BookGrid books={result.books.map(toCardBook)} eagerCount={5} />
      <Pagination query={query} page={result.page} totalPages={totalPages} />
    </>
  );
}
