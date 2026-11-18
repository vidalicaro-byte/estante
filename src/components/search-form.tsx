export function SearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/busca" role="search" className="flex gap-2">
      <label htmlFor="q" className="sr-only">
        Buscar livros, autores ou assuntos
      </label>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Buscar livros, autores ou assuntos"
        className="min-w-0 flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
      />
      <button
        type="submit"
        className="rounded-md bg-stone-900 px-4 py-2 font-medium text-white hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
      >
        Buscar
      </button>
    </form>
  );
}
