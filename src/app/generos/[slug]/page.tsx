import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookShelf, BookShelfSkeleton } from "@/components/book-shelf";
import { GenreChips } from "@/components/genre-chips";
import { PageHeader } from "@/components/page-header";
import { findGenre, GENRES } from "@/lib/genres";
import Link from "next/link";

export function generateStaticParams() {
  return GENRES.map((genre) => ({ slug: genre.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/generos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const genre = findGenre(slug);
  if (!genre) return { title: "Gênero não encontrado" };

  return { title: genre.label, description: genre.blurb };
}

export default function GenrePage({ params }: PageProps<"/generos/[slug]">) {
  return (
    <Suspense fallback={<BookShelfSkeleton />}>
      <GenreContent params={params} />
    </Suspense>
  );
}

async function GenreContent({ params }: Pick<PageProps<"/generos/[slug]">, "params">) {
  const { slug } = await params;
  const genre = findGenre(slug);
  if (!genre) notFound();

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Gênero" title={genre.label} description={genre.blurb} />

      {genre.shelves ? (
        genre.shelves.map((shelf, index) => (
          <section key={shelf.title} aria-labelledby={`shelf-${index}`} className="space-y-4">
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
        ))
      ) : (
        <Suspense fallback={<BookShelfSkeleton />}>
          <BookShelf query={genre.query} limit={20} eager />
        </Suspense>
      )}

      <nav aria-labelledby="outros-generos" className="border-line space-y-3 border-t pt-8">
        <h2
          id="outros-generos"
          className="text-muted text-sm font-medium tracking-widest uppercase"
        >
          Outros gêneros
        </h2>
        <GenreChips current={genre.slug} />
      </nav>
    </div>
  );
}
