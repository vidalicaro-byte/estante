import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FavoriteButton } from "@/components/favorite-button";
import { JsonLd } from "@/components/json-ld";
import { bookJsonLd } from "@/lib/book-json-ld";
import type { CardBook } from "@/lib/card-book";
import { getBookWork, getFeaturedWorkIds, loadAuthors } from "@/lib/catalog";
import { coverUrl, type Work } from "@/lib/open-library";
import { truncate } from "@/lib/text";
import { ShareButton } from "@/components/share-button";

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

const sectionTitle = "text-sm font-medium tracking-widest text-muted uppercase";

async function AuthorLine({ authorIds }: { authorIds: string[] }) {
  const authors = await loadAuthors(authorIds);
  if (authors.length === 0) return null;

  return (
    <p className="font-display text-muted text-xl">
      {authors.map((author, index) => (
        <span key={author.id}>
          {index > 0 && ", "}
          <Link href={`/autores/${author.id}`} className="hover:text-accent hover:underline">
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
    <>
      <Suspense fallback={null}>
        <BookStructuredData work={work} />
      </Suspense>

      <article className="space-y-8">
        <Link href="/" className="text-muted hover:text-ink inline-block text-sm hover:underline">
          ← Catálogo
        </Link>

        <div className="grid gap-10 md:grid-cols-[16rem_1fr] md:gap-14">
          <div className="bg-line ring-ink/10 relative mx-auto aspect-[2/3] w-52 self-start overflow-hidden rounded-sm shadow-xl ring-1 md:sticky md:top-24 md:w-full">
            {cover !== undefined ? (
              <Image
                src={coverUrl(cover, "L")}
                alt={`Capa de ${work.title}`}
                fill
                sizes="(min-width: 768px) 256px, 208px"
                preload
                className="object-cover"
              />
            ) : (
              <div aria-hidden className="bg-surface flex h-full flex-col justify-between p-5">
                <span className="font-display text-2xl leading-tight font-semibold">
                  {work.title}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-8">
            <header className="space-y-2">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                {work.title}
              </h1>
              <Suspense
                fallback={<div aria-hidden className="bg-line h-7 w-48 animate-pulse rounded" />}
              >
                <AuthorLine authorIds={work.authorIds} />
              </Suspense>
            </header>

            <div className="flex flex-wrap items-center gap-3">
              <Suspense
                fallback={
                  <div aria-hidden className="bg-line h-10 w-32 animate-pulse rounded-md" />
                }
              >
                <FavoriteAction work={work} />
              </Suspense>
              <ShareButton title={work.title} />
            </div>

            {work.description.length > 0 ? (
              <div className="text-ink/90 max-w-prose space-y-4 text-lg leading-relaxed">
                {work.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="text-muted">Este livro ainda não tem descrição.</p>
            )}

            {work.subjects.length > 0 && (
              <section aria-labelledby="assuntos" className="space-y-3">
                <h2 id="assuntos" className={sectionTitle}>
                  Assuntos
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {work.subjects.slice(0, 8).map((subject) => (
                    <li key={subject}>
                      <Link
                        href={`/busca?q=${encodeURIComponent(`subject:"${subject.replace(/"/g, "")}"`)}`}
                        className="bg-line/60 text-ink/80 hover:bg-accent hover:text-paper inline-block rounded-full px-3 py-1 text-sm transition-colors"
                      >
                        {subject}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {work.links.length > 0 && (
              <section aria-labelledby="links" className="space-y-3">
                <h2 id="links" className={sectionTitle}>
                  Links externos
                </h2>
                <ul className="space-y-1.5">
                  {work.links.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent decoration-accent/40 hover:decoration-accent underline underline-offset-4"
                      >
                        {link.title}
                        <span aria-hidden> ↗</span>
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
    </>
  );
}

function BookSkeleton() {
  return (
    <div aria-hidden className="grid gap-10 md:grid-cols-[16rem_1fr] md:gap-14">
      <div className="bg-line mx-auto aspect-[2/3] w-52 animate-pulse rounded-sm md:w-full" />
      <div className="space-y-4">
        <div className="bg-line h-12 w-2/3 animate-pulse rounded" />
        <div className="bg-line h-6 w-1/3 animate-pulse rounded" />
        <div className="bg-line h-32 w-full max-w-prose animate-pulse rounded" />
      </div>
    </div>
  );
}
