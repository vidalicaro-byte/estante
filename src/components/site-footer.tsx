const linkClass =
  "underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent";

export function SiteFooter() {
  return (
    <footer className="border-line border-t">
      <div className="text-muted mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm sm:flex-row sm:justify-between">
        <p>
          Dados fornecidos pela{" "}
          <a
            href="https://openlibrary.org"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Open Library
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          .
        </p>
        <p>
          Código-fonte no{" "}
          <a
            href="https://github.com/vidalicaro-byte/estante"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            GitHub
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
