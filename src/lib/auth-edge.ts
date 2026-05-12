/**
 * Edge-runtime-safe session verification.
 *
 * The proxy runs in the Edge runtime and cannot import Drizzle / Neon / node
 * crypto. This module re-implements just the HMAC check needed to gate routes.
 * Full session details (userId, tenantId) are resolved in server route handlers
 * via /lib/auth.ts which has the DB client.
 */

export const SESSION_COOKIE = "bh_session";

const enc = new TextEncoder();
const dec = new TextDecoder();

const b64urlEncode = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
};

const fromB64url = (s: string): Uint8Array => {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

export type EdgeSession = {
  userId: string;
  tenantId: string;
  email: string;
  exp: number;
};

export async function verifyEdgeSession(
  token: string | undefined,
  secret: string | undefined,
): Promise<EdgeSession | null> {
  if (!token || !token.includes(".") || !secret) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  const expectedSig = b64urlEncode(
    await crypto.subtle.sign("HMAC", key, enc.encode(body)),
  );
  if (expectedSig.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < expectedSig.length; i++) {
    diff |= expectedSig.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  if (diff !== 0) return null;

  try {
    const payload = JSON.parse(dec.decode(fromB64url(body))) as EdgeSession;
    if (
      typeof payload.userId !== "string" ||
      typeof payload.tenantId !== "string" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
