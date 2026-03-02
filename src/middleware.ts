import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/lib/auth";

const ADMIN_COOKIE = "zodiak_admin_session";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdmin = path.startsWith("/admin");
  const isAdminApi = path.startsWith("/api/admin");
  const isUploadThing = path.startsWith("/api/uploadthing");
  if (!isAdmin && !isAdminApi && !isUploadThing) return NextResponse.next();

  if (path === "/admin/login" || (path === "/api/admin/login" && request.method === "POST")) {
    return NextResponse.next();
  }

  if (isUploadThing) return NextResponse.next();

  const cookieHeader = request.headers.get("cookie");
  const session = await getSessionFromCookie(cookieHeader);
  if (session) {
    const res = isAdmin ? NextResponse.next() : NextResponse.next();
    if (isAdmin) res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", path);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/uploadthing/:path*"]
};
