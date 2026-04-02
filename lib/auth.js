import { SignJWT, jwtVerify } from 'jose';

export const AUTH_COOKIE_NAME = 'marketplace_auth';

const DEFAULT_SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const REMEMBERED_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function getJwtSecret() {
  const secret = process.env.AUTH_JWT_SECRET;

  if (!secret) {
    throw new Error('AUTH_JWT_SECRET is missing.');
  }

  return new TextEncoder().encode(secret);
}

function getBaseCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };
}

export function normalizeEmail(email = '') {
  if (email == null) {
    return '';
  }

  return String(email).trim().toLowerCase();
}

export function isValidEmail(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function formatAuthUser(user) {
  return {
    id: String(user?.id || ''),
    fullName: String(user?.full_name ?? user?.fullName ?? ''),
    email: normalizeEmail(user?.email),
    role: String(user?.role || 'customer'),
  };
}

export function getSessionMaxAge(rememberMe = false) {
  return rememberMe ? REMEMBERED_SESSION_MAX_AGE : DEFAULT_SESSION_MAX_AGE;
}

export function buildAuthCookie(token, rememberMe = false) {
  return {
    name: AUTH_COOKIE_NAME,
    value: token,
    ...getBaseCookieOptions(),
    maxAge: getSessionMaxAge(rememberMe),
  };
}

export function buildExpiredAuthCookie() {
  return {
    name: AUTH_COOKIE_NAME,
    value: '',
    ...getBaseCookieOptions(),
    maxAge: 0,
  };
}

export async function signAuthToken(user, options = {}) {
  const authUser = formatAuthUser(user);
  const maxAge = getSessionMaxAge(options.rememberMe);
  const now = Math.floor(Date.now() / 1000);

  const token = await new SignJWT({
    email: authUser.email,
    fullName: authUser.fullName,
    role: authUser.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(authUser.id)
    .setIssuedAt(now)
    .setExpirationTime(now + maxAge)
    .sign(getJwtSecret());

  return { token, maxAge, user: authUser };
}

export async function verifyAuthToken(token) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());

    return {
      id: String(payload.sub || ''),
      fullName: String(payload.fullName || ''),
      email: normalizeEmail(payload.email),
      role: String(payload.role || 'customer'),
    };
  } catch {
    return null;
  }
}
