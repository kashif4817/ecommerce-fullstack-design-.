import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAME,
  buildExpiredAuthCookie,
  verifyAuthToken,
} from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const user = await verifyAuthToken(token);

  if (!user) {
    const response = NextResponse.json({ authenticated: false, user: null });
    response.cookies.set(buildExpiredAuthCookie());
    return response;
  }

  return NextResponse.json({ authenticated: true, user });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(buildExpiredAuthCookie());
  return response;
}
