"use client";

type Status = "idle" | "saving" | "saved" | "error";

export function AutosaveBar({ status, lastSaved }: { status: Status; lastSaved: string | null }) {
  const label =
    status === "saving" ? "Autosaving…" : status === "saved" ? `Saved ${lastSaved ?? ""}` : status === "error" ? "Error saving" : "";
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-white px-6 py-3 text-sm text-[var(--ink-muted)]">
      <span className={status === "error" ? "text-red-600" : ""}>{label}</span>
    </div>
  );
}
