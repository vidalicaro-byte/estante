import Link from "next/link";
import { FavoritesLink } from "./favorites-link";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-line bg-paper/85 sticky top-0 z-20 border-b backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-display text-ink text-2xl font-semibold tracking-tight">
          Estante
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-5 text-sm">
          <Link href="/busca" className="text-ink/80 hover:text-ink hover:underline">
            Buscar
          </Link>
          <FavoritesLink />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
