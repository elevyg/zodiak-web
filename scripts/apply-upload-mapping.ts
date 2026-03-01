import "dotenv/config";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { getDocumentBySlug, upsertDocument } from "../src/lib/content/repository";

const SLUG_TITLES: Record<string, string> = {
  site: "Site",
  products: "Products",
  faq: "FAQ",
  gallery: "Gallery",
  about: "About",
  story: "Story"
};

const DOCS_WITH_IMAGES = ["site", "story", "products", "gallery"];

function replaceUrls(obj: unknown, mapping: Record<string, string>): unknown {
  if (typeof obj === "string") {
    return mapping[obj] ?? obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => replaceUrls(item, mapping));
  }
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = replaceUrls(v, mapping);
    }
    return out;
  }
  return obj;
}

async function main() {
  const mappingPath = join(process.cwd(), "scripts", "upload-mapping.json");
  if (!existsSync(mappingPath)) {
    console.error("Run npm run upload-images first to create upload-mapping.json");
    process.exit(1);
  }
  const mapping = JSON.parse(readFileSync(mappingPath, "utf-8")) as Record<string, string>;

  for (const slug of DOCS_WITH_IMAGES) {
    const row = await getDocumentBySlug(slug);
    if (!row) {
      console.log(`Skip ${slug} (not found)`);
      continue;
    }
    const content = JSON.parse(row.content_json);
    const updated = replaceUrls(content, mapping);
    const title = SLUG_TITLES[slug] ?? slug;
    await upsertDocument(slug, title, JSON.stringify(updated), "migration");
    console.log(`Updated ${slug}`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
