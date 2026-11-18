"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="space-y-4">
      <h1 className="text-2xl font-bold">Algo deu errado</h1>
      <p className="text-muted">Não foi possível carregar esta página.</p>
      <button
        type="button"
        onClick={reset}
        className="bg-ink text-paper hover:bg-ink/80 rounded-md px-4 py-2 font-medium"
      >
        Tentar de novo
      </button>
    </div>
  );
}
