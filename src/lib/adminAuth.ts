export const ADMIN_SESSION_COOKIE = "stiffler_admin_session";

const encoder = new TextEncoder();

function bytesToHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getConfiguredPassword() {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password || password === "\"\"" || password === "''") return "";
  return password;
}

function readCookie(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : "";
}

export async function createAdminSessionToken(password = getConfiguredPassword()) {
  if (!password) return "";
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(`stiffler-admin-session:${password}`));
  return bytesToHex(digest);
}

export async function isAdminSessionTokenValid(token: string | undefined | null) {
  if (!token) return false;
  const expected = await createAdminSessionToken();
  return Boolean(expected) && token === expected;
}

export async function isAdminAuthorized(request: Request) {
  const configuredPassword = getConfiguredPassword();
  if (!configuredPassword) return false;

  if (request.headers.get("x-admin-password") === configuredPassword) return true;

  const sessionToken = readCookie(request.headers.get("cookie"), ADMIN_SESSION_COOKIE);
  return isAdminSessionTokenValid(sessionToken);
}
