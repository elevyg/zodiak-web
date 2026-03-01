import * as jose from "jose";

const COOKIE_NAME = "zodiak_admin_session";
const EXPIRY = "7d";

function getSecret(): Uint8Array | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export async function createSession(): Promise<{ cookie: string }> {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET must be set and at least 32 characters");
  const token = await new jose.SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(secret);
  return {
    cookie: `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
  };
}

export async function getSessionFromCookie(cookieHeader: string | null): Promise<{ sub: string } | null> {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const token = match?.[1]?.trim();
  if (!token) return null;
  const secret = getSecret();
  if (!secret) return null;
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload.sub ? { sub: payload.sub } : null;
  } catch {
    return null;
  }
}

export function clearSession(): { cookie: string } {
  return {
    cookie: `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  };
}

export { COOKIE_NAME };
