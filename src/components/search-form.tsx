export function SearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form
      action="/busca"
      role="search"
      className="border-line bg-surface focus-within:border-accent focus-within:ring-accent/25 flex w-full max-w-xl items-center gap-2 rounded-full border p-1.5 shadow-sm transition focus-within:ring-2"
    >
      <label htmlFor="q" className="sr-only">
        Buscar livros, autores ou assuntos
      </label>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Buscar livros, autores ou assuntos"
        className="text-ink placeholder:text-muted min-w-0 flex-1 bg-transparent px-4 py-2 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-ink text-paper hover:bg-ink/80 rounded-full px-5 py-2 text-sm font-medium transition-colors"
      >
        Buscar
      </button>
    </form>
  );
}
