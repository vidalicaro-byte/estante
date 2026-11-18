import Link from "next/link";
import { FavoritesLink } from "./favorites-link";

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-stone-900">
          Estante
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-5">
          <Link href="/busca" className="text-stone-700 hover:text-stone-900 hover:underline">
            Buscar
          </Link>
          <FavoritesLink />
        </nav>
      </div>
    </header>
  );
}
