export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="space-y-3">
      {eyebrow && (
        <p className="text-accent text-sm font-medium tracking-widest uppercase">{eyebrow}</p>
      )}
      <h1 className="font-display text-4xl font-semibold tracking-tight text-balance break-words sm:text-5xl">
        {title}
      </h1>
      {description && <p className="text-muted max-w-2xl text-lg">{description}</p>}
    </header>
  );
}
