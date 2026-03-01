"use client";

import { useRef, useState } from "react";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  alt?: string;
  onAltChange?: (alt: string) => void;
};

export function ImageUpload({ value, onChange, alt, onAltChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (res.ok && data.url) onChange(data.url);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--surface-strong)]"
        >
          {uploading ? "Uploading…" : "Upload image"}
        </button>
      </div>
      {value && (
        <div className="flex gap-4">
          <img src={value} alt={alt ?? ""} className="h-20 w-20 object-cover rounded border" />
          {onAltChange && (
            <input
              type="text"
              value={alt ?? ""}
              onChange={(e) => onAltChange(e.target.value)}
              placeholder="Alt text"
              className="flex-1 rounded border border-[var(--border)] px-2 py-1 text-sm"
            />
          )}
        </div>
      )}
    </div>
  );
}
