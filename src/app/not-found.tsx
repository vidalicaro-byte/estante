import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <Link href="/" className="text-amber-800 underline">
        Voltar para o início
      </Link>
    </div>
  );
}
