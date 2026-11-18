import Link from "next/link";
import { pageWindow } from "@/lib/pagination";

function hrefFor(query: string, page: number): string {
  const params = new URLSearchParams({ q: query });
  if (page > 1) params.set("page", String(page));
  return `/busca?${params.toString()}`;
}

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

  const linkClass =
    "rounded-md border border-line px-3 py-1.5 text-sm hover:bg-line/50 focus-visible:outline-2 focus-visible:outline-accent";

  return (
    <nav aria-label="Paginação" className="mt-10">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {page > 1 && (
          <li>
            <Link href={hrefFor(query, page - 1)} rel="prev" className={linkClass}>
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
                className={`${linkClass} ${item === page ? "bg-ink text-paper hover:bg-ink" : ""}`}
              >
                {item}
              </Link>
            </li>
          ),
        )}
        {page < totalPages && (
          <li>
            <Link href={hrefFor(query, page + 1)} rel="next" className={linkClass}>
              Próxima
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
