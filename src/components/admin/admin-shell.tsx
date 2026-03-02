"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

async function logout() {
  await fetch("/api/admin/logout", { method: "POST" });
  window.location.href = "/admin/login";
}

const PAGES: { slug: string; label: string }[] = [
  { slug: "site", label: "Site" },
  { slug: "story", label: "Story" },
  { slug: "products", label: "Products" },
  { slug: "faq", label: "FAQ" },
  { slug: "gallery", label: "Gallery" },
  { slug: "about", label: "About" }
];

const LOCALES = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" }
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get("locale") === "en" ? "en" : "es";

  if (pathname === "/admin/login") return <>{children}</>;

  const docHref = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("locale", currentLocale);
    const q = params.toString();
    return `/admin/${slug}${q ? `?${q}` : ""}`;
  };

  return (
    <div className="flex min-h-screen bg-[var(--surface)]">
      <aside className="w-56 shrink-0 border-r border-[var(--border)] bg-white p-4">
        <Link href="/admin" className="block text-lg font-semibold text-[var(--ink)] mb-6">
          Zodiak CMS
        </Link>
        <div className="mb-4">
          <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Locale</label>
          <select
            value={currentLocale}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              params.set("locale", e.target.value);
              const slug = pathname.replace(/^\/admin\/?/, "") || "site";
              router.push(`/admin/${slug}?${params.toString()}`);
            }}
            className="w-full rounded border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--ink)]"
          >
            {LOCALES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <nav className="flex flex-col gap-1">
          {PAGES.map(({ slug, label }) => {
            const href = docHref(slug);
            const active = pathname === `/admin/${slug}`;
            return (
              <Link
                key={slug}
                href={href}
                className={`rounded px-3 py-2 text-sm ${active ? "bg-[var(--accent)] text-white" : "text-[var(--ink-muted)] hover:bg-[var(--surface-strong)]"}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 pt-4 border-t border-[var(--border)] space-y-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="block text-sm text-[var(--ink-muted)] hover:underline">
            View site
          </a>
          <button type="button" onClick={logout} className="block text-sm text-[var(--ink-muted)] hover:underline">
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
