import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "zodiak_admin_session";
export const ADMIN_CSRF_COOKIE = "zodiak_admin_csrf";

const requireAdminPassword = () => {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD is required");
  }
  return password;
};

const requireSessionSecret = () => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is required");
  }
  return secret;
};

const encodeBase64Url = (input: string) => Buffer.from(input, "utf-8").toString("base64url");
const decodeBase64Url = (input: string) => Buffer.from(input, "base64url").toString("utf-8");

const sign = (payload: string) => {
  return createHmac("sha256", requireSessionSecret()).update(payload).digest("base64url");
};

export const createAdminSessionToken = () => {
  const payload = JSON.stringify({
    exp: Date.now() + 1000 * 60 * 60 * 24 * 14,
    nonce: randomBytes(16).toString("hex")
  });
  const encodedPayload = encodeBase64Url(payload);
  return `${encodedPayload}.${sign(encodedPayload)}`;
};

export const verifyAdminSessionToken = (token: string | undefined | null) => {
  if (!token) {
    return false;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return false;
  }

  const expectedSignature = sign(encodedPayload);
  const left = Buffer.from(signature);
  const right = Buffer.from(expectedSignature);

  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return false;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as { exp?: number };
    return Boolean(payload.exp && payload.exp > Date.now());
  } catch {
    return false;
  }
};

export const verifyAdminPassword = (inputPassword: string) => {
  const expected = Buffer.from(requireAdminPassword());
  const provided = Buffer.from(inputPassword);

  if (expected.length !== provided.length) {
    return false;
  }

  return timingSafeEqual(expected, provided);
};

export const createCsrfToken = () => randomBytes(24).toString("base64url");

export const requireAdminSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifyAdminSessionToken(token)) {
    throw new Error("Unauthorized");
  }
};
