import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookShelf, BookShelfSkeleton } from "@/components/book-shelf";
import { getBookAuthor, getFeaturedAuthorIds } from "@/lib/catalog";
import { authorPhotoUrl, type TextSection } from "@/lib/open-library";
import { truncate } from "@/lib/text";

const LANGUAGE_NAME = { pt: "português", en: "inglês", other: "outro idioma" } as const;

/** The lang attribute lets screen readers pronounce each block correctly. */
function langOf(section: TextSection): string | undefined {
  return section.language === "other" ? undefined : section.language;
}

export async function generateStaticParams() {
  const ids = await getFeaturedAuthorIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/autores/[id]">): Promise<Metadata> {
  const { id } = await params;
  const author = await getBookAuthor(id);
  if (!author) return { title: "Autor não encontrado" };

  const intro = author.bio[0]?.paragraphs[0];

  return {
    title: author.name,
    description: intro ? truncate(intro, 160) : `Livros e informações sobre ${author.name}.`,
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
  const [mainBio, ...otherBios] = author.bio;

  return (
    <article className="space-y-14">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="bg-line ring-ink/10 relative size-40 shrink-0 overflow-hidden rounded-full shadow-lg ring-1">
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
            <div
              aria-hidden
              className="font-display text-muted flex h-full items-center justify-center text-5xl"
            >
              {author.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-5">
          <header className="space-y-2">
            <p className="text-accent text-sm font-medium tracking-widest uppercase">Autor</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {author.name}
            </h1>
            {years && <p className="text-muted">{years}</p>}
          </header>

          {mainBio && (
            <div
              lang={langOf(mainBio)}
              className="text-ink/90 max-w-prose space-y-4 text-lg leading-relaxed"
            >
              {mainBio.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          {otherBios.map((section, index) => (
            <details key={index} className="max-w-prose">
              <summary className="text-accent cursor-pointer text-sm hover:underline">
                Ler também em {LANGUAGE_NAME[section.language]}
              </summary>
              <div
                lang={langOf(section)}
                className="text-ink/90 mt-4 space-y-4 text-lg leading-relaxed"
              >
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
              </div>
            </details>
          ))}

          {author.links.length > 0 && (
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
              {author.links.map((link) => (
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
          )}
        </div>
      </div>

      <section aria-labelledby="obras" className="border-line space-y-6 border-t pt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="obras" className="font-display text-2xl font-semibold tracking-tight">
            Obras
          </h2>
          <Link
            href={`/busca?q=${encodeURIComponent(`author_key:${author.id}`)}`}
            className="text-accent shrink-0 text-sm hover:underline"
          >
            Ver todas →
          </Link>
        </div>
        <Suspense fallback={<BookShelfSkeleton />}>
          <BookShelf query={`author_key:${author.id}`} limit={20} />
        </Suspense>
      </section>
    </article>
  );
}

function AuthorSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-8 sm:flex-row">
      <div className="bg-line size-40 animate-pulse rounded-full" />
      <div className="flex-1 space-y-4">
        <div className="bg-line h-12 w-1/2 animate-pulse rounded" />
        <div className="bg-line h-32 w-full max-w-prose animate-pulse rounded" />
      </div>
    </div>
  );
}
