import { createClient } from "@libsql/client";

const url = process.env.TURSO_URL!;
const authToken = process.env.TURSO_TOKEN!;

export function getDb() {
  if (!url || !authToken) {
    throw new Error("TURSO_URL and TURSO_TOKEN must be set");
  }
  return createClient({ url, authToken });
}
