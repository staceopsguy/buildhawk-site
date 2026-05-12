/**
 * AES-256-GCM encryption for tenant integration credentials.
 *
 * Set BH_ENCRYPTION_KEY to a 32-byte base64 string (`openssl rand -base64 32`).
 * Rotating the key requires re-encrypting every row in the integrations table.
 */

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

function getKey(): Buffer {
  const raw = process.env.BH_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      "BH_ENCRYPTION_KEY not set. Generate with: openssl rand -base64 32",
    );
  }
  try {
    const decoded = Buffer.from(raw, "base64");
    if (decoded.length === 32) return decoded;
  } catch {
    // fall through
  }
  // Derive a 32-byte key via scrypt for non-base64 inputs (e.g. raw text).
  return scryptSync(raw, "buildhawk-saas-v1", 32);
}

export function encryptJson(value: unknown): {
  ciphertext: string;
  iv: string;
  tag: string;
} {
  const key = getKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const plaintext = Buffer.from(JSON.stringify(value), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
}

export function decryptJson<T = unknown>(
  ciphertext: string,
  iv: string,
  tag: string,
): T {
  const key = getKey();
  const ivBuf = Buffer.from(iv, "base64");
  const tagBuf = Buffer.from(tag, "base64");
  if (tagBuf.length !== TAG_LEN) {
    throw new Error("Invalid auth tag length");
  }
  const decipher = createDecipheriv(ALGO, key, ivBuf);
  decipher.setAuthTag(tagBuf);
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64")),
    decipher.final(),
  ]);
  return JSON.parse(plaintext.toString("utf8")) as T;
}

export const isEncryptionConfigured = () => Boolean(process.env.BH_ENCRYPTION_KEY);
