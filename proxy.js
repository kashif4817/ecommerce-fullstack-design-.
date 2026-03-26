import { NextResponse } from 'next/server'
import {
  ADMIN_PIN_COOKIE,
  ADMIN_PIN_COOKIE_VALUE,
} from './lib/adminPin'

export function proxy(request) {
  const { pathname, search } = request.nextUrl

  if (!pathname.startsWith('/admin') || pathname === '/admin/unlock') {
    return NextResponse.next()
  }

  const isUnlocked =
    request.cookies.get(ADMIN_PIN_COOKIE)?.value === ADMIN_PIN_COOKIE_VALUE

  if (isUnlocked) {
    return NextResponse.next()
  }

  const unlockUrl = new URL('/admin/unlock', request.url)
  unlockUrl.searchParams.set('next', `${pathname}${search}`)
  return NextResponse.redirect(unlockUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}
