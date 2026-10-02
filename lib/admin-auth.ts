import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "eldivan_admin";
const SESSION_AGE = 60 * 60 * 8;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET debe tener al menos 32 caracteres.");
  }
  return value;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword || expectedPassword.length < 8) return false;
  return safeEqual(username, expectedUser) && safeEqual(password, expectedPassword);
}

export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_AGE;
  const payload = `admin:${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidAdminSession(token?: string) {
  if (!token) return false;
  const separator = token.lastIndexOf(".");
  if (separator < 1) return false;
  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const [role, expires] = payload.split(":");
  return role === "admin" && Number(expires) > Math.floor(Date.now() / 1000) && safeEqual(signature, sign(payload));
}

export async function hasAdminSession() {
  const jar = await cookies();
  return isValidAdminSession(jar.get(COOKIE_NAME)?.value);
}

export const adminCookieName = COOKIE_NAME;
export const adminSessionMaxAge = SESSION_AGE;

