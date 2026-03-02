"use client";

import { useCallback, useState } from "react";
import { SaveBar } from "./autosave-bar";
import { ImageUpload } from "./image-upload";
import { ProductImageUpload } from "./product-image-upload";

type Status = "idle" | "saving" | "saved" | "error";

const DEFAULT_CONTENT: Record<string, unknown> = {
  site: {
    meta: { title: "", description: "", ogTitle: "", ogDescription: "" },
    nav: [],
    hero: {
      eyebrow: "",
      title: "",
      subtitle: "",
      ctaPrimary: { label: "", href: "" },
      ctaSecondary: { label: "", href: "" },
      image: "",
      imageAlt: ""
    },
    brandStory: { title: "", paragraphs: [] },
    reviews: { title: "", subtitle: "", items: [] },
    contact: { title: "", subtitle: "", location: "", phone: "", whatsappLink: "" },
    social: { instagram: "" }
  },
  story: { image: "", imageAlt: "", paragraphs: [] },
  products: [],
  faq: [],
  gallery: [],
  about: { markdown: "" }
};

type DocumentEditorProps = {
  slug: string;
  locale: "es" | "en";
  initialContent: unknown;
  version: number;
  updatedAt: string | null;
};

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function DocumentEditor({ slug, locale, initialContent, version, updatedAt }: DocumentEditorProps) {
  const [content, setContent] = useState<unknown>(() => initialContent ?? DEFAULT_CONTENT[slug] ?? {});
  const [status, setStatus] = useState<Status>("idle");
  const [lastSaved, setLastSaved] = useState<string | null>(updatedAt ? formatTime(updatedAt) : null);
  const [dirty, setDirty] = useState(false);

  const save = useCallback(
    async (overrideContent?: unknown) => {
      const toSave = overrideContent !== undefined ? overrideContent : content;
      setStatus("saving");
      try {
        const res = await fetch(`/api/admin/documents/${slug}?locale=${locale}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toSave)
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Save failed");
        }
        const data = await res.json();
        setContent(data.content);
        setLastSaved(formatTime(data.updated_at));
        setDirty(false);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } catch {
        setStatus("error");
      }
    },
    [slug, locale, content]
  );

  const setContentAndDirty = useCallback((arg: unknown | ((prev: unknown) => unknown)) => {
    setDirty(true);
    if (typeof arg === "function") setContent(arg as (prev: unknown) => unknown);
    else setContent(arg);
  }, []);

  const update = useCallback((path: string[], value: unknown) => {
    setDirty(true);
    setContent((prev: unknown) => {
      const next = typeof prev === "object" && prev !== null ? { ...(prev as object) } : {};
      let current: Record<string, unknown> = next as Record<string, unknown>;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        const nextPart = typeof current[key] === "object" && current[key] !== null ? { ...(current[key] as object) } : {};
        current[key] = nextPart;
        current = nextPart as Record<string, unknown>;
      }
      current[path[path.length - 1]] = value;
      return next;
    });
  }, []);

  const updateNested = useCallback(
    (path: string[], key: string, value: unknown) => {
      setDirty(true);
      setContent((prev: unknown) => {
        const o = prev as Record<string, unknown>;
        let current: unknown = o;
        for (const p of path) {
          current = (current as Record<string, unknown>)?.[p];
        }
        const target = typeof current === "object" && current !== null ? { ...(current as object), [key]: value } : { [key]: value };
        const next = JSON.parse(JSON.stringify(prev));
        let cursor: Record<string, unknown> = next;
        for (let i = 0; i < path.length - 1; i++) {
          cursor = cursor[path[i]] as Record<string, unknown>;
        }
        cursor[path[path.length - 1]] = target;
        return next;
      });
    },
    []
  );

  if (slug === "story") {
    const c = content as { image?: string; imageAlt?: string; paragraphs?: string[] };
    return (
      <>
        <SaveBar status={status} lastSaved={lastSaved} dirty={dirty} onSave={save} />
        <div className="p-6 space-y-6 max-w-2xl">
          <h2 className="text-lg font-semibold">Story</h2>
          <div className="rounded border border-[var(--border)] bg-white p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--ink-muted)] mb-1">Image</label>
              <ImageUpload
                value={c?.image ?? ""}
                onChange={(url) => update(["image"], url)}
                alt={c?.imageAlt}
                onAltChange={(v) => update(["imageAlt"], v)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--ink-muted)] mb-1">Paragraphs</label>
              {(c?.paragraphs ?? []).map((p, i) => (
                <textarea
                  key={i}
                  value={p}
                  onChange={(e) => {
                    const next = [...(c?.paragraphs ?? [])];
                    next[i] = e.target.value;
                    update(["paragraphs"], next);
                  }}
                  className="w-full rounded border border-[var(--border)] p-2 text-sm mb-2"
                  rows={3}
                />
              ))}
              <button
                type="button"
                onClick={() => update(["paragraphs"], [...(c?.paragraphs ?? []), ""])}
                className="text-sm text-[var(--accent)] hover:underline"
              >
                + Add paragraph
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (slug === "about") {
    const c = content as { markdown?: string };
    return (
      <>
        <SaveBar status={status} lastSaved={lastSaved} dirty={dirty} onSave={save} />
        <div className="p-6 space-y-6 max-w-2xl">
          <h2 className="text-lg font-semibold">About</h2>
          <div className="rounded border border-[var(--border)] bg-white p-4">
            <label className="block text-sm font-medium text-[var(--ink-muted)] mb-2">Markdown</label>
            <textarea
              value={c?.markdown ?? ""}
              onChange={(e) => update(["markdown"], e.target.value)}
              className="w-full rounded border border-[var(--border)] p-2 text-sm font-mono min-h-[200px]"
            />
          </div>
        </div>
      </>
    );
  }

  if (slug === "site") {
    const c = content as Record<string, unknown>;
    const meta = (c?.meta as Record<string, string>) ?? {};
    const hero = (c?.hero as Record<string, unknown>) ?? {};
    const heroCtas = hero.ctaPrimary as Record<string, string> | undefined;
    const heroCtas2 = hero.ctaSecondary as Record<string, string> | undefined;
    return (
      <>
        <SaveBar status={status} lastSaved={lastSaved} dirty={dirty} onSave={save} />
        <div className="p-6 space-y-6 max-w-2xl">
          <h2 className="text-lg font-semibold">Site</h2>
          <div className="rounded border border-[var(--border)] bg-white p-4 space-y-4">
            <h3 className="font-medium">Meta / SEO</h3>
            {["title", "description", "ogTitle", "ogDescription"].map((key) => (
              <div key={key}>
                <label className="block text-sm text-[var(--ink-muted)] mb-1">{key}</label>
                <input
                  type="text"
                  value={meta[key] ?? ""}
                  onChange={(e) => updateNested(["meta"], key, e.target.value)}
                  className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
                />
              </div>
            ))}
          </div>
          <div className="rounded border border-[var(--border)] bg-white p-4 space-y-4">
            <h3 className="font-medium">Hero</h3>
            {["eyebrow", "title", "subtitle"].map((key) => (
              <div key={key}>
                <label className="block text-sm text-[var(--ink-muted)] mb-1">{key}</label>
                <input
                  type="text"
                  value={(hero[key] as string) ?? ""}
                  onChange={(e) => updateNested(["hero"], key, e.target.value)}
                  className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm text-[var(--ink-muted)] mb-1">Image</label>
              <ImageUpload
                value={(hero.image as string) ?? ""}
                onChange={(url) => updateNested(["hero"], "image", url)}
                alt={(hero.imageAlt as string) ?? ""}
                onAltChange={(v) => updateNested(["hero"], "imageAlt", v)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--ink-muted)] mb-1">CTA Primary label</label>
                <input
                  type="text"
                  value={heroCtas?.label ?? ""}
                  onChange={(e) => updateNested(["hero", "ctaPrimary"], "label", e.target.value)}
                  className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--ink-muted)] mb-1">CTA Primary href</label>
                <input
                  type="text"
                  value={heroCtas?.href ?? ""}
                  onChange={(e) => updateNested(["hero", "ctaPrimary"], "href", e.target.value)}
                  className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--ink-muted)] mb-1">CTA Secondary label</label>
                <input
                  type="text"
                  value={heroCtas2?.label ?? ""}
                  onChange={(e) => updateNested(["hero", "ctaSecondary"], "label", e.target.value)}
                  className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--ink-muted)] mb-1">CTA Secondary href</label>
                <input
                  type="text"
                  value={heroCtas2?.href ?? ""}
                  onChange={(e) => updateNested(["hero", "ctaSecondary"], "href", e.target.value)}
                  className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="rounded border border-[var(--border)] bg-white p-4 space-y-4">
            <h3 className="font-medium">Brand story</h3>
            <div>
              <label className="block text-sm text-[var(--ink-muted)] mb-1">Title</label>
              <input
                type="text"
                value={((c?.brandStory as Record<string, unknown>)?.title as string) ?? ""}
                onChange={(e) => updateNested(["brandStory"], "title", e.target.value)}
                className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--ink-muted)] mb-1">Paragraphs</label>
              {(((c?.brandStory as Record<string, unknown>)?.paragraphs as string[]) ?? []).map((p, i) => (
                <textarea
                  key={i}
                  value={p}
                  onChange={(e) => {
                    const par = (c?.brandStory as Record<string, unknown>)?.paragraphs as string[];
                    const next = [...(par ?? [])];
                    next[i] = e.target.value;
                    updateNested(["brandStory"], "paragraphs", next);
                  }}
                  className="w-full rounded border border-[var(--border)] p-2 text-sm mb-2"
                  rows={2}
                />
              ))}
            </div>
          </div>
          <div className="rounded border border-[var(--border)] bg-white p-4 space-y-4">
            <h3 className="font-medium">Reviews</h3>
            <div>
              <label className="block text-sm text-[var(--ink-muted)] mb-1">Title</label>
              <input
                type="text"
                value={((c?.reviews as Record<string, unknown>)?.title as string) ?? ""}
                onChange={(e) => updateNested(["reviews"], "title", e.target.value)}
                className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--ink-muted)] mb-1">Subtitle</label>
              <input
                type="text"
                value={((c?.reviews as Record<string, unknown>)?.subtitle as string) ?? ""}
                onChange={(e) => updateNested(["reviews"], "subtitle", e.target.value)}
                className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
              />
            </div>
          </div>
          <div className="rounded border border-[var(--border)] bg-white p-4 space-y-4">
            <h3 className="font-medium">Contact</h3>
            {["title", "subtitle", "location", "phone", "whatsappLink"].map((key) => (
              <div key={key}>
                <label className="block text-sm text-[var(--ink-muted)] mb-1">{key}</label>
                <input
                  type="text"
                  value={((c?.contact as Record<string, string>)?.[key]) ?? ""}
                  onChange={(e) => updateNested(["contact"], key, e.target.value)}
                  className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
                />
              </div>
            ))}
          </div>
          <div className="rounded border border-[var(--border)] bg-white p-4">
            <h3 className="font-medium mb-2">Social</h3>
            <label className="block text-sm text-[var(--ink-muted)] mb-1">Instagram URL</label>
            <input
              type="text"
              value={((c?.social as Record<string, string>)?.instagram) ?? ""}
              onChange={(e) => updateNested(["social"], "instagram", e.target.value)}
              className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
            />
          </div>
        </div>
      </>
    );
  }

  if (slug === "faq") {
    const items = (content as { question?: string; answer?: string }[]) ?? [];
    return (
      <>
        <SaveBar status={status} lastSaved={lastSaved} dirty={dirty} onSave={save} />
        <div className="p-6 space-y-6 max-w-2xl">
          <h2 className="text-lg font-semibold">FAQ</h2>
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="rounded border border-[var(--border)] bg-white p-4 space-y-2">
                <input
                  type="text"
                  placeholder="Question"
                  value={item?.question ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], question: e.target.value, answer: next[i]?.answer ?? "" };
                    setContentAndDirty(next);
                  }}
                  className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
                />
                <textarea
                  placeholder="Answer"
                  value={item?.answer ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], question: next[i]?.question ?? "", answer: e.target.value };
                    setContentAndDirty(next);
                  }}
                  className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={() => setContentAndDirty(items.filter((_, j) => j !== i))}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setContentAndDirty([...items, { question: "", answer: "" }])}
              className="text-sm text-[var(--accent)] hover:underline"
            >
              + Add FAQ
            </button>
          </div>
        </div>
      </>
    );
  }

  if (slug === "products") {
    const items = (content as Array<Record<string, unknown>>) ?? [];
    return (
      <>
        <SaveBar status={status} lastSaved={lastSaved} dirty={dirty} onSave={save} />
        <div className="p-6 space-y-6 max-w-2xl">
          <h2 className="text-lg font-semibold">Products</h2>
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="rounded border border-[var(--border)] bg-white p-4 space-y-2">
                <input
                  type="text"
                  placeholder="ID"
                  value={(item?.id as string) ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], id: e.target.value };
                    setContentAndDirty(next);
                  }}
                  className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={(item?.name as string) ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], name: e.target.value };
                    setContentAndDirty(next);
                  }}
                  className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
                />
                <textarea
                  placeholder="Description"
                  value={(item?.description as string) ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], description: e.target.value };
                    setContentAndDirty(next);
                  }}
                  className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
                  rows={2}
                />
                <input
                  type="text"
                  placeholder="Composition"
                  value={(item?.composition as string) ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], composition: e.target.value };
                    setContentAndDirty(next);
                  }}
                  className="w-full rounded border border-[var(--border)] px-2 py-1.5 text-sm"
                />
                <div>
                  <label className="block text-sm text-[var(--ink-muted)] mb-2">Image</label>
                  <ProductImageUpload
                    value={(Array.isArray(item?.images) ? (item.images as string[])[0] : "") ?? ""}
                    onChange={(url) => {
                      setContentAndDirty((prev: unknown) => {
                        const arr = (prev as Array<Record<string, unknown>>) ?? [];
                        const next = arr.map((it, idx) =>
                          idx === i ? { ...it, images: [url] } : it
                        );
                        save(next);
                        return next;
                      });
                    }}
                    onRemove={() => {
                      setContentAndDirty((prev: unknown) => {
                        const arr = (prev as Array<Record<string, unknown>>) ?? [];
                        const next = arr.map((it, idx) => (idx === i ? { ...it, images: [] } : it));
                        save(next);
                        return next;
                      });
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setContentAndDirty(items.filter((_, j) => j !== i))}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove product
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setContentAndDirty([
                  ...items,
                  { id: "", name: "", description: "", features: [], composition: "", images: [] }
                ])
              }
              className="text-sm text-[var(--accent)] hover:underline"
            >
              + Add product
            </button>
          </div>
        </div>
      </>
    );
  }

  if (slug === "gallery") {
    const items = (content as Array<{ src?: string; alt?: string; width?: number; height?: number; priority?: boolean }>) ?? [];
    return (
      <>
        <SaveBar status={status} lastSaved={lastSaved} dirty={dirty} onSave={save} />
        <div className="p-6 space-y-6 max-w-2xl">
          <h2 className="text-lg font-semibold">Gallery</h2>
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="rounded border border-[var(--border)] bg-white p-4 space-y-2 flex flex-wrap gap-4">
                <div className="w-24 h-24 shrink-0">
                  {item?.src ? (
                    <img src={item.src} alt={item?.alt ?? ""} className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="w-full h-full rounded border border-dashed border-[var(--border)] flex items-center justify-center text-[var(--ink-muted)] text-xs">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-[200px] space-y-2">
                  <ImageUpload
                    value={item?.src ?? ""}
                    onChange={(url) => {
                      setContentAndDirty((prev: unknown) => {
                        const arr = (prev as Array<Record<string, unknown>>) ?? [];
                        const next = arr.map((it, idx) => (idx === i ? { ...it, src: url } : it));
                        save(next);
                        return next;
                      });
                    }}
                    alt={item?.alt}
                    onAltChange={(v) => {
                      setContentAndDirty((prev: unknown) => {
                        const arr = (prev as Array<Record<string, unknown>>) ?? [];
                        return arr.map((it, idx) => (idx === i ? { ...it, alt: v } : it));
                      });
                    }}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item?.priority ?? false}
                      onChange={(e) => {
                        setContentAndDirty((prev: unknown) => {
                          const arr = (prev as Array<Record<string, unknown>>) ?? [];
                          return arr.map((it, idx) => (idx === i ? { ...it, priority: e.target.checked } : it));
                        });
                      }}
                    />
                    Priority
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setContentAndDirty(items.filter((_, j) => j !== i))}
                  className="text-sm text-red-600 hover:underline self-start"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setContentAndDirty([...items, { src: "", alt: "", width: 0, height: 0 }])}
              className="text-sm text-[var(--accent)] hover:underline"
            >
              + Add image
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SaveBar status={status} lastSaved={lastSaved} dirty={dirty} onSave={save} />
      <div className="p-6">
        <p className="text-[var(--ink-muted)]">Unknown document type: {slug}</p>
      </div>
    </>
  );
}
