import { notFound } from "next/navigation";
import { getDocumentBySlug, type Locale } from "@/lib/content/repository";
import { CMS_SLUGS } from "@/lib/content/schemas";
import { DocumentEditor } from "@/components/admin/document-editor";
import { AdminShell } from "@/components/admin/admin-shell";

type PageProps = {
  params: Promise<{ doc: string }>;
  searchParams: Promise<{ locale?: string }>;
};

function parseLocale(value: string | undefined): Locale {
  return value === "en" ? "en" : "es";
}

export default async function AdminDocPage({ params, searchParams }: PageProps) {
  const { doc: slug } = await params;
  const { locale: localeParam } = await searchParams;
  if (!(CMS_SLUGS as readonly string[]).includes(slug)) notFound();
  const locale = parseLocale(localeParam);
  const row = await getDocumentBySlug(slug, locale);
  const content = row ? JSON.parse(row.content_json) : null;
  const version = row?.version ?? 0;
  const updatedAt = row?.updated_at ?? null;
  return (
    <AdminShell locale={locale}>
      <DocumentEditor
        slug={slug}
        locale={locale}
        initialContent={content}
        version={version}
        updatedAt={updatedAt}
      />
    </AdminShell>
  );
}
