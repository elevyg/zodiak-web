import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { createAsset } from "@/lib/content/repository";
import { randomUUID } from "node:crypto";

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  const file = formData.get("file") ?? formData.get("image");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  const ext = file.name.split(".").pop() ?? "bin";
  const pathname = `cms/${randomUUID()}.${ext}`;
  const blob = await put(pathname, file, { access: "public" });
  await createAsset({
    url: blob.url,
    pathname: blob.pathname,
    ...(file.type && { mime_type: file.type }),
    size_bytes: file.size
  });
  return NextResponse.json({
    url: blob.url,
    pathname: blob.pathname
  });
}
