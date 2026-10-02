import "server-only";

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getCustomerAuth } from "@/lib/admin-data";

const COOKIE = "eldivan_customer";
const AGE = 60 * 60 * 24 * 14;
function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("Configura ADMIN_SESSION_SECRET para habilitar las sesiones.");
  return value;
}
function safeEqual(a: Buffer, b: Buffer) { return a.length === b.length && timingSafeEqual(a, b); }
function sign(payload: string) { return createHmac("sha256", secret()).update(payload).digest("base64url"); }
export function hashCustomerPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  return `${salt}.${scryptSync(password, salt, 64).toString("base64url")}`;
}
export function verifyCustomerPassword(password: string, hash: string) {
  const [salt, expected] = hash.split(".");
  if (!salt || !expected) return false;
  try { return safeEqual(scryptSync(password, salt, 64), Buffer.from(expected, "base64url")); } catch { return false; }
}
export function createCustomerSession(email: string) {
  const payload = `${email}:${Math.floor(Date.now() / 1000) + AGE}`;
  return `${payload}.${sign(payload)}`;
}
export function readCustomerSession(token?: string) {
  if (!token) return null;
  const split = token.lastIndexOf(".");
  if (split < 1) return null;
  const payload = token.slice(0, split);
  const [email, expires] = payload.split(":");
  try {
    if (!email || Number(expires) <= Math.floor(Date.now() / 1000) || !safeEqual(Buffer.from(token.slice(split + 1)), Buffer.from(sign(payload)))) return null;
    return email;
  } catch { return null; }
}
export async function getSignedInCustomer() {
  const jar = await cookies();
  const email = readCustomerSession(jar.get(COOKIE)?.value);
  return email ? getCustomerAuth(email) : null;
}
export const customerCookieName = COOKIE;
export const customerSessionMaxAge = AGE;
