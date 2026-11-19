import Link from "next/link";
import { StateMessage } from "@/components/state-message";

export default function NotFound() {
  return (
    <StateMessage
      title="Página não encontrada"
      action={
        <Link
          href="/"
          className="bg-ink text-paper hover:bg-ink/80 inline-block rounded-full px-5 py-2 text-sm font-medium transition-colors"
        >
          Voltar ao início
        </Link>
      }
    >
      O endereço pode estar errado, ou este livro pode ter saído do catálogo.
    </StateMessage>
  );
}
