import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { bookJsonLd } from "@/lib/book-json-ld";
import { getBookWork, getFeaturedWorkIds, loadAuthors } from "@/lib/catalog";
import { coverUrl, type Work } from "@/lib/open-library";
import { truncate } from "@/lib/text";
import { FavoriteButton } from "@/components/favorite-button";
import type { CardBook } from "@/lib/card-book";

export async function generateStaticParams() {
  const ids = await getFeaturedWorkIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/livros/[id]">): Promise<Metadata> {
  const { id } = await params;
  const work = await getBookWork(id);
  if (!work) return { title: "Livro não encontrado" };

  const description = work.description[0]
    ? truncate(work.description[0], 160)
    : `Detalhes, assuntos e links sobre “${work.title}”.`;
  const cover = work.coverIds[0];

  return {
    title: work.title,
    description,
    openGraph: {
      type: "book",
      title: work.title,
      description,
      ...(cover !== undefined ? { images: [coverUrl(cover, "L")] } : {}),
    },
  };
}

export default function BookPage({ params }: PageProps<"/livros/[id]">) {
  return (
    <Suspense fallback={<BookSkeleton />}>
      <BookDetails params={params} />
    </Suspense>
  );
}

async function AuthorLine({ authorIds }: { authorIds: string[] }) {
  const authors = await loadAuthors(authorIds);
  if (authors.length === 0) return null;

  return (
    <p className="text-muted text-lg">
      {authors.map((author, index) => (
        <span key={author.id}>
          {index > 0 && ", "}
          <Link href={`/autores/${author.id}`} className="hover:text-ink hover:underline">
            {author.name}
          </Link>
        </span>
      ))}
    </p>
  );
}

async function BookStructuredData({ work }: { work: Work }) {
  const authors = await loadAuthors(work.authorIds);
  return <JsonLd data={bookJsonLd(work, authors)} />;
}

async function FavoriteAction({ work }: { work: Work }) {
  const authors = await loadAuthors(work.authorIds);
  const book: CardBook = {
    id: work.id,
    title: work.title,
    authors: authors.map((author) => author.name).join(", "),
    coverId: work.coverIds[0],
  };

  return <FavoriteButton book={book} variant="full" />;
}

async function BookDetails({ params }: Pick<PageProps<"/livros/[id]">, "params">) {
  const { id } = await params;
  const work = await getBookWork(id);
  if (!work) notFound();

  const cover = work.coverIds[0];

  return (
    <article className="space-y-8">
      <Suspense fallback={null}>
        <BookStructuredData work={work} />
      </Suspense>

      <Link href="/busca" className="text-muted hover:text-ink text-sm hover:underline">
        ← Voltar à busca
      </Link>

      <div className="flex flex-col gap-8 sm:flex-row">
        <div className="bg-line relative aspect-[2/3] w-48 shrink-0 self-start overflow-hidden rounded-md shadow-md sm:w-64">
          {cover !== undefined ? (
            <Image
              src={coverUrl(cover, "L")}
              alt={`Capa de ${work.title}`}
              fill
              sizes="(min-width: 640px) 256px, 192px"
              loading="eager"
              className="object-cover"
            />
          ) : (
            <div aria-hidden className="text-muted flex h-full items-center justify-center text-sm">
              Sem capa
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-6">
          <header className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{work.title}</h1>
            <Suspense
              fallback={<div aria-hidden className="bg-line h-7 w-40 animate-pulse rounded" />}
            >
              <AuthorLine authorIds={work.authorIds} />
            </Suspense>
          </header>

          <Suspense
            fallback={<div aria-hidden className="bg-line h-10 w-32 animate-pulse rounded-md" />}
          >
            <FavoriteAction work={work} />
          </Suspense>

          {work.description.length > 0 ? (
            <div className="text-ink/80 max-w-prose space-y-3">
              {work.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className="text-muted">Este livro ainda não tem descrição.</p>
          )}

          {work.subjects.length > 0 && (
            <section aria-labelledby="assuntos" className="space-y-2">
              <h2 id="assuntos" className="text-muted text-sm font-semibold uppercase">
                Assuntos
              </h2>
              <ul className="flex flex-wrap gap-2">
                {work.subjects.slice(0, 10).map((subject) => (
                  <li key={subject} className="bg-line text-ink/80 rounded-full px-3 py-1 text-sm">
                    {subject}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {work.links.length > 0 && (
            <section aria-labelledby="links" className="space-y-2">
              <h2 id="links" className="text-muted text-sm font-semibold uppercase">
                Links externos
              </h2>
              <ul className="space-y-1">
                {work.links.map((link) => (
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
            </section>
          )}
        </div>
      </div>
    </article>
  );
}

function BookSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-8 sm:flex-row">
      <div className="bg-line aspect-[2/3] w-48 animate-pulse rounded-md sm:w-64" />
      <div className="flex-1 space-y-4">
        <div className="bg-line h-9 w-2/3 animate-pulse rounded" />
        <div className="bg-line h-5 w-1/3 animate-pulse rounded" />
        <div className="bg-line h-24 w-full max-w-prose animate-pulse rounded" />
      </div>
    </div>
  );
}
