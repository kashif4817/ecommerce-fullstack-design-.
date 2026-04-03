import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Only check admin routes
  if (pathname.startsWith('/admin')) {
    const authToken = request.cookies.get('authToken')?.value;

    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verify JWT and check role
    const payload = await verifyJWT(authToken);
    if (!payload || payload.role !== 'admin') {
      // Redirect back to where they came from or home
      const referer = request.headers.get('referer') || '/';
      return NextResponse.redirect(new URL(referer, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
