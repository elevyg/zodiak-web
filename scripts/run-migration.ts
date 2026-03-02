import "dotenv/config";
import { createClient } from "@libsql/client";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const url = process.env.TURSO_URL;
const authToken = process.env.TURSO_TOKEN;
if (!url || !authToken) {
  console.error("Set TURSO_URL and TURSO_TOKEN");
  process.exit(1);
}

const client = createClient({ url, authToken });
const migrationsDir = join(process.cwd(), "scripts", "migrations");
const files = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();

async function run() {
  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf-8");
    const statements = sql.split(";").map((s) => s.trim()).filter(Boolean);
    for (const statement of statements) {
      await client.execute(statement + ";");
      console.log("[%s] Executed: %s...", file, statement.slice(0, 50));
    }
  }
  console.log("Migration complete.");
}
run().catch((err) => {
  console.error(err);
  process.exit(1);
});
