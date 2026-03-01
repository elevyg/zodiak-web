import type { NextRequest } from "next/server";
import { ADMIN_CSRF_COOKIE, verifyAdminSessionToken } from "@/lib/admin/auth";

const parseOrigin = (value: string | null) => {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

export const hasValidAdminSession = (request: NextRequest) => {
  const token = request.cookies.get("zodiak_admin_session")?.value;
  return verifyAdminSessionToken(token);
};

export const verifyCsrf = (request: NextRequest) => {
  const csrfCookie = request.cookies.get(ADMIN_CSRF_COOKIE)?.value;
  const csrfHeader = request.headers.get("x-csrf-token");

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return false;
  }

  const origin = parseOrigin(request.headers.get("origin"));
  const host = request.headers.get("host");
  if (!origin || !host) {
    return false;
  }

  const expectedOrigin = `${request.nextUrl.protocol}//${host}`;
  return origin === expectedOrigin;
};
