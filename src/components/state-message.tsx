export function StateMessage({
  title,
  children,
  action,
  tone = "neutral",
}: {
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  tone?: "neutral" | "error";
}) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={`space-y-3 rounded-lg border border-dashed p-8 text-center ${
        tone === "error" ? "border-accent/50 bg-accent/5" : "border-line"
      }`}
    >
      <p className="font-display text-xl font-semibold">{title}</p>
      {children && <div className="text-muted mx-auto max-w-md">{children}</div>}
      {action}
    </div>
  );
}
