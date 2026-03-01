import { config } from "dotenv";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { UTApi, UTFile } from "uploadthing/server";

config({ path: join(process.cwd(), ".env") });

const PUBLIC = join(process.cwd(), "public");
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

function collectImages(dir: string, base = ""): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const paths: string[] = [];
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const full = join(dir, e.name);
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) {
      paths.push(...collectImages(full, rel));
    } else if (IMAGE_EXT.some((ext) => e.name.toLowerCase().endsWith(ext))) {
      paths.push(rel);
    }
  }
  return paths;
}

function mimeFromExt(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  const m: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp"
  };
  return m[ext ?? ""] ?? "application/octet-stream";
}

async function main() {
  const token = process.env.UPLOADTHING_TOKEN;
  if (!token) {
    console.error("Set UPLOADTHING_TOKEN in .env (from dashboard: API Keys → V7)");
    process.exit(1);
  }
  const utapi = new UTApi({ token });
  const imagesDir = join(PUBLIC, "images");
  const paths = collectImages(imagesDir);
  const mapping: Record<string, string> = {};

  for (const rel of paths) {
    const fullPath = join(imagesDir, rel);
    const buf = readFileSync(fullPath);
    const name = rel.replace(/\//g, "-");
    const file = new UTFile([buf], name, { type: mimeFromExt(rel) });
    try {
      const res = await utapi.uploadFiles([file]);
      const item = res[0];
      const url = item?.url ?? (item as { data?: { url?: string } })?.data?.url;
      const err = (item as { error?: { message?: string } })?.error;
      if (err) {
        console.error(`Upload failed for ${rel}:`, err.message ?? JSON.stringify(err));
      } else if (url) {
        const publicPath = `/images/${rel}`;
        mapping[publicPath] = url;
        console.log(`${publicPath} -> ${url}`);
      } else {
        console.error(`Upload failed for ${rel}: no url in response`);
      }
    } catch (err) {
      console.error(`Upload failed for ${rel}:`, err instanceof Error ? err.message : err);
    }
  }

  const outPath = join(process.cwd(), "scripts", "upload-mapping.json");
  const { writeFileSync } = await import("node:fs");
  writeFileSync(outPath, JSON.stringify(mapping, null, 2));
  console.log(`\nMapping written to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
