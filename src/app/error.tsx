"use client";

import { StateMessage } from "@/components/state-message";

export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <StateMessage
      tone="error"
      title="Algo deu errado"
      action={
        <button
          type="button"
          onClick={() => retry()}
          className="bg-ink text-paper hover:bg-ink/80 rounded-full px-5 py-2 text-sm font-medium transition-colors"
        >
          Tentar de novo
        </button>
      }
    >
      Não foi possível carregar esta página. Costuma ser uma instabilidade passageira da Open
      Library.
    </StateMessage>
  );
}
