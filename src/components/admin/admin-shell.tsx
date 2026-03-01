"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[var(--surface)]">
      <aside className="w-56 shrink-0 border-r border-[var(--border)] bg-white p-4">
        <Link href="/admin" className="block text-lg font-semibold text-[var(--ink)] mb-6">
          Zodiak CMS
        </Link>
        <nav className="flex flex-col gap-1">
          {PAGES.map(({ slug, label }) => {
            const href = `/admin/${slug}`;
            const active = pathname === href;
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
