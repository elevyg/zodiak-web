"use client";

import { useRef } from "react";
import { useUploadThing } from "@/utils/uploadthing";

type ProductImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
};

export function ProductImageUpload({ value, onChange, onRemove }: ProductImageUploadProps) {
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

  function triggerUpload() {
    inputRef.current?.click();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    startUpload([file]);
    e.target.value = "";
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFile}
        disabled={isUploading}
        aria-label="Upload image"
      />
      {value ? (
        <div className="space-y-2">
          <div
            className="group relative aspect-square w-32 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] shadow-sm ring-1 ring-black/5"
            role="img"
            aria-label="Product image"
          >
            <img src={value} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
              <button
                type="button"
                onClick={triggerUpload}
                disabled={isUploading}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--ink)] shadow-lg transition-transform hover:scale-105 hover:bg-white disabled:opacity-50"
                aria-label="Replace image"
                title="Replace"
              >
                <UploadIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-lg transition-transform hover:scale-105 hover:bg-white"
                aria-label="Remove image"
                title="Remove"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--ink)]">
                  Uploading…
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-3 text-xs">
            <button
              type="button"
              onClick={triggerUpload}
              disabled={isUploading}
              className="text-[var(--accent)] hover:underline disabled:opacity-50"
            >
              Replace
            </button>
            <button type="button" onClick={onRemove} className="text-red-600 hover:underline">
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={triggerUpload}
          disabled={isUploading}
          className="flex aspect-square w-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-strong)] hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 disabled:opacity-50"
          aria-label="Add image"
        >
          {isUploading ? (
            <span className="text-xs font-medium">Uploading…</span>
          ) : (
            <>
              <PlusIcon className="h-8 w-8" />
              <span className="text-xs font-medium">Add image</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}
