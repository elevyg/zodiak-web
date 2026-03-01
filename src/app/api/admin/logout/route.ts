import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export async function POST() {
  const { cookie } = clearSession();
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", cookie);
  return res;
}
