"use client";

import { useEffect, useRef, useState } from "react";
import { buildSharePayload, isAbortError } from "@/lib/share";

type Status = "idle" | "copied" | "failed";

const MESSAGES: Record<Status, string> = {
  idle: "",
  copied: "Link copiado",
  failed: "Não foi possível copiar o link",
};

function ShareIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      className="size-5"
    >
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" />
    </svg>
  );
}

export function ShareButton({ title }: { title: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function flash(next: Status) {
    setStatus(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2500);
  }

  async function share() {
    const payload = buildSharePayload(title, window.location.href);
    try {
      // Phones and tablets have a good native share sheet; on desktop, copying is faster.
      if (window.matchMedia("(pointer: coarse)").matches && typeof navigator.share === "function") {
        await navigator.share(payload);
        return;
      }
      await navigator.clipboard.writeText(payload.url);
      flash("copied");
    } catch (error) {
      if (isAbortError(error)) return;
      flash("failed");
    }
  }

  return (
    <div className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={share}
        className="border-line bg-surface text-ink/80 hover:bg-line/50 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"
      >
        <ShareIcon />
        Compartilhar
      </button>
      {/* Always rendered so screen readers announce the text when it appears. */}
      <span role="status" className="text-muted text-sm">
        {MESSAGES[status]}
      </span>
    </div>
  );
}
