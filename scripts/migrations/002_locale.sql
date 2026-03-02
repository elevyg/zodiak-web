PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS cms_documents_new;

CREATE TABLE cms_documents_new (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'es',
  title TEXT NOT NULL,
  content_json TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL DEFAULT 'admin',
  UNIQUE(slug, locale)
);

INSERT INTO cms_documents_new (id, slug, locale, title, content_json, version, updated_at, updated_by)
SELECT id, slug, 'es', title, content_json, version, updated_at, updated_by FROM cms_documents;

DROP TABLE cms_documents;

ALTER TABLE cms_documents_new RENAME TO cms_documents;

PRAGMA foreign_keys = ON;
