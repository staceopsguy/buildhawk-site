/**
 * Password hashing + verification via scrypt (built into node:crypto).
 *
 * Hash format: "<derived-key-hex>:<salt-hex>:<N>:<r>:<p>"
 *
 * scrypt parameters chosen for ~100ms server-side at deploy CPU. Adjust N if
 * latency budget changes. Constant-time comparison via timingSafeEqual.
 */

import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const DEFAULTS = {
  N: 1 << 15, // 32768
  r: 8,
  p: 1,
  keyLen: 64,
  saltLen: 16,
} as const;

const scryptAsync = (password: string, salt: Buffer, keyLen: number, N: number, r: number, p: number): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    scrypt(password, salt, keyLen, { N, r, p, maxmem: 256 * 1024 * 1024 }, (err, derived) => {
      if (err) reject(err);
      else resolve(derived as Buffer);
    });
  });

export async function hashPassword(plain: string): Promise<string> {
  if (typeof plain !== "string" || plain.length < 8 || plain.length > 512) {
    throw new Error("Password must be 8-512 characters");
  }
  const salt = randomBytes(DEFAULTS.saltLen);
  const derived = await scryptAsync(plain, salt, DEFAULTS.keyLen, DEFAULTS.N, DEFAULTS.r, DEFAULTS.p);
  return `${derived.toString("hex")}:${salt.toString("hex")}:${DEFAULTS.N}:${DEFAULTS.r}:${DEFAULTS.p}`;
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  if (!stored || typeof plain !== "string") return false;
  const parts = stored.split(":");
  if (parts.length !== 5) return false;
  const [keyHex, saltHex, N, r, p] = parts;
  const keyBuf = Buffer.from(keyHex, "hex");
  const saltBuf = Buffer.from(saltHex, "hex");
  let derived: Buffer;
  try {
    derived = await scryptAsync(plain, saltBuf, keyBuf.length, parseInt(N, 10), parseInt(r, 10), parseInt(p, 10));
  } catch {
    return false;
  }
  if (derived.length !== keyBuf.length) return false;
  return timingSafeEqual(derived, keyBuf);
}

/**
 * Lightweight strength heuristic used for the UI. Backend always accepts >=8 chars.
 * Returns 0..4 (0 = bad, 4 = strong).
 */
export function passwordStrength(plain: string): number {
  if (!plain) return 0;
  let score = 0;
  if (plain.length >= 12) score++;
  if (plain.length >= 16) score++;
  if (/[a-z]/.test(plain) && /[A-Z]/.test(plain)) score++;
  if (/\d/.test(plain) && /[^A-Za-z0-9]/.test(plain)) score++;
  return Math.min(4, score);
}
