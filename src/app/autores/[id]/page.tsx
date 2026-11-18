import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookShelf, BookShelfSkeleton } from "@/components/book-shelf";
import { getBookAuthor, getFeaturedAuthorIds } from "@/lib/catalog";
import { authorPhotoUrl } from "@/lib/open-library";
import { truncate } from "@/lib/text";

export async function generateStaticParams() {
  const ids = await getFeaturedAuthorIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/autores/[id]">): Promise<Metadata> {
  const { id } = await params;
  const author = await getBookAuthor(id);
  if (!author) return { title: "Autor não encontrado" };

  return {
    title: author.name,
    description: author.bio[0]
      ? truncate(author.bio[0], 160)
      : `Livros e informações sobre ${author.name}.`,
  };
}

export default function AuthorPage({ params }: PageProps<"/autores/[id]">) {
  return (
    <Suspense fallback={<AuthorSkeleton />}>
      <AuthorDetails params={params} />
    </Suspense>
  );
}

async function AuthorDetails({ params }: Pick<PageProps<"/autores/[id]">, "params">) {
  const { id } = await params;
  const author = await getBookAuthor(id);
  if (!author) notFound();

  const photo = author.photoIds[0];
  const years = [author.birthDate, author.deathDate].filter(Boolean).join(" – ");

  return (
    <article className="space-y-10">
      <div className="flex flex-col gap-8 sm:flex-row">
        <div className="bg-line relative aspect-square w-40 shrink-0 self-start overflow-hidden rounded-md shadow-md">
          {photo !== undefined ? (
            <Image
              src={authorPhotoUrl(photo, "L")}
              alt={`Foto de ${author.name}`}
              fill
              sizes="160px"
              loading="eager"
              className="object-cover object-top"
            />
          ) : (
            <div aria-hidden className="text-muted flex h-full items-center justify-center text-sm">
              Sem foto
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-4">
          <header className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{author.name}</h1>
            {years && <p className="text-muted">{years}</p>}
          </header>

          {author.bio.length > 0 && (
            <div className="text-ink/80 max-w-prose space-y-3">
              {author.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          {author.links.length > 0 && (
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {author.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline"
                  >
                    {link.title}
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <section aria-labelledby="obras" className="space-y-4">
        <h2 id="obras" className="text-xl font-semibold">
          Obras
        </h2>
        <Suspense fallback={<BookShelfSkeleton />}>
          <BookShelf query={`author_key:${author.id}`} limit={20} />
        </Suspense>
        <Link
          href={`/busca?q=${encodeURIComponent(`author_key:${author.id}`)}`}
          className="text-accent inline-block text-sm underline"
        >
          Ver todas as obras na busca
        </Link>
      </section>
    </article>
  );
}

function AuthorSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-8 sm:flex-row">
      <div className="bg-line aspect-square w-40 animate-pulse rounded-md" />
      <div className="flex-1 space-y-4">
        <div className="bg-line h-9 w-1/2 animate-pulse rounded" />
        <div className="bg-line h-24 w-full max-w-prose animate-pulse rounded" />
      </div>
    </div>
  );
}
