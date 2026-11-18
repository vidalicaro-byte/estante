import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookShelf, BookShelfSkeleton } from "@/components/book-shelf";
import { findGenre, GENRES } from "@/lib/genres";

export function generateStaticParams() {
  return GENRES.map((genre) => ({ slug: genre.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/generos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const genre = findGenre(slug);
  if (!genre) return { title: "Gênero não encontrado" };

  return {
    title: genre.label,
    description: `Livros de ${genre.label.toLowerCase()} para descobrir no Estante.`,
  };
}

export default function GenrePage({ params }: PageProps<"/generos/[slug]">) {
  return (
    <Suspense fallback={<BookShelfSkeleton />}>
      <GenreBooks params={params} />
    </Suspense>
  );
}

async function GenreBooks({ params }: Pick<PageProps<"/generos/[slug]">, "params">) {
  const { slug } = await params;
  const genre = findGenre(slug);
  if (!genre) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{genre.label}</h1>
      <BookShelf query={genre.query} limit={20} eager />
    </div>
  );
}
