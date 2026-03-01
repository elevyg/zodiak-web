import { NextResponse } from "next/server";
import { listDocuments } from "@/lib/content/repository";

export async function GET() {
  const docs = await listDocuments();
  return NextResponse.json(docs);
}
