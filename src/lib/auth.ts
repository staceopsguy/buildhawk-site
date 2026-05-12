/**
 * Magic link auth for the BuildHawk Cost Plan Console.
 *
 * Required env vars:
 *   BH_AUTH_SECRET           Random 32+ char string for HMAC signing.
 *   BH_AUTHORIZED_EMAILS     Comma-separated allowlist of permitted emails.
 *   RESEND_API_KEY           Resend transactional email key (already required by site).
 *   NEXT_PUBLIC_SITE_URL     Public origin (defaults to https://www.buildhawk.com.au).
 */

import { cookies } from "next/headers";

const SESSION_COOKIE = "bh_cc_session";
const SESSION_DAYS = 30;
const MAGIC_TTL_SECONDS = 30 * 60; // 30 minutes

const enc = new TextEncoder();
const dec = new TextDecoder();

const b64url = (buf: ArrayBuffer | Uint8Array) =>
  Buffer.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf))
    .toString("base64")
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const fromB64url = (s: string) => {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
};

const getSecret = () => {
  const s = process.env.BH_AUTH_SECRET;
  if (!s || s.length < 16) return null;
  return s;
};

const sign = async (data: string): Promise<string> => {
  const secret = getSecret();
  if (!secret) throw new Error("BH_AUTH_SECRET not configured");
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return b64url(sig);
};

const verifySignature = async (data: string, sig: string): Promise<boolean> => {
  const expected = await sign(data);
  // Constant-time compare
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return diff === 0;
};

export type TokenPayload = {
  email: string;
  kind: "magic" | "session";
  exp: number; // unix seconds
  // Optional return path on magic verify
  redirect?: string;
};

export async function createToken(payload: TokenPayload): Promise<string> {
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = await sign(body);
  return `${body}.${sig}`;
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const ok = await verifySignature(body, sig);
  if (!ok) return null;
  try {
    const payload = JSON.parse(dec.decode(fromB64url(body))) as TokenPayload;
    if (typeof payload.exp !== "number") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function isAuthorizedEmail(email: string): boolean {
  const allow = process.env.BH_AUTHORIZED_EMAILS;
  if (!allow) return false;
  const normalized = normalizeEmail(email);
  return allow
    .split(",")
    .map((e) => normalizeEmail(e))
    .filter(Boolean)
    .includes(normalized);
}

export const isAuthConfigured = () =>
  Boolean(getSecret()) &&
  Boolean(process.env.BH_AUTHORIZED_EMAILS) &&
  Boolean(process.env.RESEND_API_KEY);

export async function setSessionCookie(email: string) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400;
  const token = await createToken({ email: normalizeEmail(email), kind: "session", exp });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionEmail(): Promise<string | null> {
  const jar = await cookies();
  const t = jar.get(SESSION_COOKIE)?.value;
  if (!t) return null;
  const payload = await verifyToken(t);
  if (!payload || payload.kind !== "session") return null;
  return payload.email;
}

export async function createMagicToken(email: string, redirect?: string) {
  const exp = Math.floor(Date.now() / 1000) + MAGIC_TTL_SECONDS;
  return createToken({ email: normalizeEmail(email), kind: "magic", exp, redirect });
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
