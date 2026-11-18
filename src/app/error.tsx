"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="space-y-4">
      <h1 className="text-2xl font-bold">Algo deu errado</h1>
      <p className="text-stone-600">Não foi possível carregar esta página.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-stone-900 px-4 py-2 font-medium text-white hover:bg-stone-700"
      >
        Tentar de novo
      </button>
    </div>
  );
}
