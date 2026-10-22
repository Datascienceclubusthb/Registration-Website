import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE = 'dsc-admin-session';
const TTL_SECONDS = 60 * 60 * 12;
function secret() { return process.env.ADMIN_SESSION_SECRET || ''; }
function signature(value: string) { return createHmac('sha256', secret()).update(value).digest('base64url'); }

export function adminSetupReady() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && secret().length >= 32);
}

export function validAdminCredentials(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL || '';
  const expectedPassword = process.env.ADMIN_PASSWORD || '';
  const safeCompare = (left: string, right: string) => {
    const a = Buffer.from(left); const b = Buffer.from(right);
    return a.length === b.length && timingSafeEqual(a, b);
  };
  return adminSetupReady() && safeCompare(email.trim().toLowerCase(), expectedEmail.trim().toLowerCase()) && safeCompare(password, expectedPassword);
}

export function createAdminToken() {
  const payload = Buffer.from(JSON.stringify({ expires: Date.now() + TTL_SECONDS * 1000 })).toString('base64url');
  return `${payload}.${signature(payload)}`;
}

export function isAdminTokenValid(token: string | undefined) {
  if (!token || !adminSetupReady()) return false;
  const [payload, supplied] = token.split('.');
  if (!payload || !supplied) return false;
  const expected = signature(payload);
  const a = Buffer.from(expected); const b = Buffer.from(supplied);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try { return JSON.parse(Buffer.from(payload, 'base64url').toString()).expires > Date.now(); } catch { return false; }
}

export async function hasAdminSession() {
  const jar = await cookies();
  return isAdminTokenValid(jar.get(COOKIE)?.value);
}

export const adminCookie = { name: COOKIE, maxAge: TTL_SECONDS };
