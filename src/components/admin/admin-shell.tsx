"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type Locale = "es" | "en";

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

const LOCALES: { value: Locale; label: string }[] = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" }
];

type AdminShellProps = {
  locale: Locale;
  children: React.ReactNode;
};

export function AdminShell({ locale, children }: AdminShellProps) {
  const pathname = usePathname();

  const docHref = (slug: string) => `/admin/${slug}?locale=${locale}`;

  return (
    <div className="flex min-h-screen bg-[var(--surface)]">
      <aside className="w-56 shrink-0 border-r border-[var(--border)] bg-white p-4">
        <Link href="/admin" className="block text-lg font-semibold text-[var(--ink)] mb-6">
          Zodiak CMS
        </Link>
        <div className="mb-4">
          <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Locale</label>
          <select
            value={locale}
            onChange={(e) => {
              const newLocale = e.target.value as Locale;
              const slug = pathname.replace(/^\/admin\/?/, "") || "site";
              window.location.href = `/admin/${slug}?locale=${newLocale}`;
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
