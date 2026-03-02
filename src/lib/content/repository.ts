import { randomUUID } from "node:crypto";
import { getDb } from "./db";
import {
  type CmsSlug,
  DOCUMENT_SCHEMAS,
  CMS_SLUGS,
  aboutSchema,
  faqSchema,
  gallerySchema,
  productsSchema,
  siteSchema,
  storySchema
} from "./schemas";

export type Locale = "es" | "en";

export type DocumentRow = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  content_json: string;
  version: number;
  updated_at: string;
  updated_by: string;
};

export type DocumentListItem = { slug: string; locale: string; title: string; updated_at: string };

export async function listDocuments(): Promise<DocumentListItem[]> {
  const db = getDb();
  const rs = await db.execute({
    sql: "SELECT slug, locale, title, updated_at FROM cms_documents ORDER BY slug, locale",
    args: {}
  });
  return rs.rows as unknown as DocumentListItem[];
}

export async function getDocumentBySlug(slug: string, locale: Locale): Promise<DocumentRow | null> {
  const db = getDb();
  const rs = await db.execute({
    sql: "SELECT id, slug, locale, title, content_json, version, updated_at, updated_by FROM cms_documents WHERE slug = ? AND locale = ?",
    args: [slug, locale]
  });
  const row = rs.rows[0];
  return row ? (row as unknown as DocumentRow) : null;
}

function getSchemaForSlug(slug: string) {
  const schema = DOCUMENT_SCHEMAS[slug];
  if (!schema) throw new Error(`Unknown slug: ${slug}`);
  return schema;
}

export async function getParsedDocument<T>(slug: CmsSlug, locale: Locale): Promise<{ content: T; version: number; updated_at: string } | null> {
  const row = await getDocumentBySlug(slug, locale);
  if (!row) return null;
  const schema = getSchemaForSlug(slug);
  const content = schema.parse(JSON.parse(row.content_json)) as T;
  return { content, version: row.version, updated_at: row.updated_at };
}

export async function upsertDocument(
  slug: string,
  locale: Locale,
  title: string,
  contentJson: string,
  updatedBy = "admin"
): Promise<DocumentRow> {
  const db = getDb();
  const now = new Date().toISOString();
  const existing = await getDocumentBySlug(slug, locale);
  if (existing) {
    const newVersion = existing.version + 1;
    await db.execute({
      sql: `UPDATE cms_documents SET title = ?, content_json = ?, version = ?, updated_at = ?, updated_by = ? WHERE slug = ? AND locale = ?`,
      args: [title, contentJson, newVersion, now, updatedBy, slug, locale]
    });
    const revId = randomUUID();
    await db.execute({
      sql: `INSERT INTO cms_revisions (id, document_id, version, content_json, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [revId, existing.id, newVersion, contentJson, now, updatedBy]
    });
    const rs = await db.execute({
      sql: "SELECT id, slug, locale, title, content_json, version, updated_at, updated_by FROM cms_documents WHERE slug = ? AND locale = ?",
      args: [slug, locale]
    });
    return rs.rows[0] as unknown as DocumentRow;
  }
  const id = randomUUID();
  await db.execute({
    sql: `INSERT INTO cms_documents (id, slug, locale, title, content_json, version, updated_at, updated_by) VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
    args: [id, slug, locale, title, contentJson, now, updatedBy]
  });
  await db.execute({
    sql: `INSERT INTO cms_revisions (id, document_id, version, content_json, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), id, 1, contentJson, now, updatedBy]
  });
  const rs = await db.execute({
    sql: "SELECT id, slug, locale, title, content_json, version, updated_at, updated_by FROM cms_documents WHERE slug = ? AND locale = ?",
    args: [slug, locale]
  });
  return rs.rows[0] as unknown as DocumentRow;
}

export type AssetRow = {
  id: string;
  url: string;
  pathname: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

export async function createAsset(asset: {
  url: string;
  pathname: string;
  alt?: string;
  width?: number;
  height?: number;
  mime_type?: string;
  size_bytes?: number;
}): Promise<AssetRow> {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO cms_assets (id, url, pathname, alt, width, height, mime_type, size_bytes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      asset.url,
      asset.pathname,
      asset.alt ?? null,
      asset.width ?? null,
      asset.height ?? null,
      asset.mime_type ?? null,
      asset.size_bytes ?? null,
      now
    ]
  });
  const rs = await db.execute({
    sql: "SELECT * FROM cms_assets WHERE id = ?",
    args: [id]
  });
  return rs.rows[0] as unknown as AssetRow;
}

export { siteSchema, productsSchema, faqSchema, gallerySchema, aboutSchema, storySchema, CMS_SLUGS };
export type { CmsSlug };
