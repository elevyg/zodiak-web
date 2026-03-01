import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDocumentBySlug, upsertDocument } from "@/lib/content/repository";
import { DOCUMENT_SCHEMAS, CMS_SLUGS } from "@/lib/content/schemas";

const SLUG_TITLES: Record<string, string> = {
  site: "Site",
  products: "Products",
  faq: "FAQ",
  gallery: "Gallery",
  about: "About",
  story: "Story"
};

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(CMS_SLUGS as readonly string[]).includes(slug)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const row = await getDocumentBySlug(slug);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const content = JSON.parse(row.content_json);
  return NextResponse.json({
    slug: row.slug,
    title: row.title,
    content,
    version: row.version,
    updated_at: row.updated_at
  });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(CMS_SLUGS as readonly string[]).includes(slug)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  if (request.method === "PUT" && origin && referer) {
    const url = new URL(request.url);
    const refUrl = new URL(referer);
    if (refUrl.origin !== url.origin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  const schema = DOCUMENT_SCHEMAS[slug];
  if (!schema) return NextResponse.json({ error: "Unknown slug" }, { status: 400 });
  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  const title = SLUG_TITLES[slug] ?? slug;
  const row = await upsertDocument(slug, title, JSON.stringify(parsed.data));
  revalidatePath("/");
  return NextResponse.json({
    slug: row.slug,
    title: row.title,
    content: JSON.parse(row.content_json),
    version: row.version,
    updated_at: row.updated_at
  });
}
