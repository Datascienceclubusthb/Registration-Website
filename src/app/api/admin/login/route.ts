import { NextResponse } from 'next/server';
import { adminCookie, adminSetupReady, createAdminToken, validAdminCredentials } from '@/lib/admin-auth';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!adminSetupReady()) return NextResponse.json({ error: 'Admin access is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and a 32-character ADMIN_SESSION_SECRET.' }, { status: 503 });
  let body: { email?: unknown; password?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Enter your admin credentials.' }, { status: 400 }); }
  if (typeof body.email !== 'string' || typeof body.password !== 'string' || !validAdminCredentials(body.email, body.password)) return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
  const response = NextResponse.json({ success: true });
  response.cookies.set(adminCookie.name, createAdminToken(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: adminCookie.maxAge });
  return response;
}
