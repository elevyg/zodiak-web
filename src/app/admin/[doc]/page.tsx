import { notFound } from "next/navigation";
import { getDocumentBySlug } from "@/lib/content/repository";
import { CMS_SLUGS } from "@/lib/content/schemas";
import { DocumentEditor } from "@/components/admin/document-editor";

type PageProps = { params: Promise<{ doc: string }> };

export default async function AdminDocPage({ params }: PageProps) {
  const { doc: slug } = await params;
  if (!(CMS_SLUGS as readonly string[]).includes(slug)) notFound();
  const row = await getDocumentBySlug(slug);
  const content = row ? JSON.parse(row.content_json) : null;
  const version = row?.version ?? 0;
  const updatedAt = row?.updated_at ?? null;
  return (
    <DocumentEditor
      slug={slug}
      initialContent={content}
      version={version}
      updatedAt={updatedAt}
    />
  );
}
