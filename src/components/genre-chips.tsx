import Link from "next/link";
import { GENRES } from "@/lib/genres";

export function GenreChips({ current }: { current?: string }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {GENRES.map((genre) => {
        const active = genre.slug === current;
        return (
          <li key={genre.slug}>
            <Link
              href={`/generos/${genre.slug}`}
              aria-current={active ? "page" : undefined}
              className={`inline-block rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink/80 hover:border-accent hover:text-accent"
              }`}
            >
              {genre.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
