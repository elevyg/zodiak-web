"use client";

type Status = "idle" | "saving" | "saved" | "error";

type SaveBarProps = {
  status: Status;
  lastSaved: string | null;
  dirty: boolean;
  onSave: () => void;
};

export function SaveBar({ status, lastSaved, dirty, onSave }: SaveBarProps) {
  const label =
    status === "saving" ? "Saving…" : status === "saved" ? `Saved ${lastSaved ?? ""}` : status === "error" ? "Error saving" : dirty ? "Unsaved changes" : "";
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-white px-6 py-3 text-sm text-[var(--ink-muted)]">
      <span className={status === "error" ? "text-red-600" : ""}>{label}</span>
      {dirty && status !== "saving" && (
        <button
          type="button"
          onClick={onSave}
          className="rounded bg-[var(--accent)] px-4 py-1.5 text-white font-medium hover:bg-[var(--accent-strong)] disabled:opacity-50"
        >
          Save
        </button>
      )}
    </div>
  );
}
