import "dotenv/config";
import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const url = process.env.TURSO_URL;
const authToken = process.env.TURSO_TOKEN;
if (!url || !authToken) {
  console.error("Set TURSO_URL and TURSO_TOKEN");
  process.exit(1);
}

const client = createClient({ url, authToken });
const sql = readFileSync(join(process.cwd(), "scripts", "migrations", "001_cms.sql"), "utf-8");
const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

async function run() {
  for (const statement of statements) {
    await client.execute(statement + ";");
    console.log("Executed:", statement.slice(0, 50) + "...");
  }
  console.log("Migration complete.");
}
run().catch((err) => {
  console.error(err);
  process.exit(1);
});
