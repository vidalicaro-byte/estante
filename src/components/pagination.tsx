import Link from "next/link";
import { pageWindow } from "@/lib/pagination";

function hrefFor(query: string, page: number): string {
  const params = new URLSearchParams({ q: query });
  if (page > 1) params.set("page", String(page));
  return `/busca?${params.toString()}`;
}

const base =
  "inline-flex min-w-10 items-center justify-center rounded-full border px-3 py-1.5 text-sm transition-colors";
const idle = "border-line text-ink/80 hover:border-accent hover:text-accent";
const current = "border-ink bg-ink text-paper";

export function Pagination({
  query,
  page,
  totalPages,
}: {
  query: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginação" className="mt-12">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {page > 1 && (
          <li>
            <Link href={hrefFor(query, page - 1)} rel="prev" className={`${base} ${idle}`}>
              Anterior
            </Link>
          </li>
        )}
        {pageWindow(page, totalPages).map((item, index) =>
          item === "…" ? (
            <li key={`gap-${index}`} aria-hidden className="text-muted px-1">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={hrefFor(query, item)}
                aria-current={item === page ? "page" : undefined}
                className={`${base} ${item === page ? current : idle}`}
              >
                {item}
              </Link>
            </li>
          ),
        )}
        {page < totalPages && (
          <li>
            <Link href={hrefFor(query, page + 1)} rel="next" className={`${base} ${idle}`}>
              Próxima
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
