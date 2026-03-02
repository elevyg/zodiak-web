"use client";

import { useRef } from "react";
import { useUploadThing } from "@/utils/uploadthing";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  alt?: string;
  onAltChange?: (alt: string) => void;
  buttonLabel?: string;
};

export function ImageUpload({ value, onChange, alt, onAltChange, buttonLabel }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const file = res?.[0];
      const url = file?.url;
      if (url) onChangeRef.current(url);
    }
  });

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    startUpload([file]);
    e.target.value = "";
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
          disabled={isUploading}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--surface-strong)] disabled:opacity-50"
        >
          {isUploading ? "Uploading…" : (buttonLabel ?? "Upload image")}
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
