CREATE TABLE IF NOT EXISTS cms_documents (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content_json TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL DEFAULT 'admin'
);

CREATE TABLE IF NOT EXISTS cms_revisions (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  content_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT 'admin',
  FOREIGN KEY (document_id) REFERENCES cms_documents(id)
);

CREATE TABLE IF NOT EXISTS cms_assets (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  pathname TEXT NOT NULL,
  alt TEXT,
  width INTEGER,
  height INTEGER,
  mime_type TEXT,
  size_bytes INTEGER,
  created_at TEXT NOT NULL
);
