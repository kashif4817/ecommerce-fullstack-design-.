import { NextResponse } from 'next/server';
import {
  buildAuthCookie,
  isValidEmail,
  normalizeEmail,
  signAuthToken,
} from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export const runtime = 'nodejs';

function getSupabaseErrorMessage(error) {
  if (error?.code === 'PGRST202') {
    return 'Run supabase/users_auth_setup.sql in your Supabase SQL editor first.';
  }

  return error?.message || 'Unable to sign you in right now.';
}

export async function POST(request) {
  let body = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const email = normalizeEmail(body?.email);
  const password = String(body?.password || '');
  const rememberMe = Boolean(body?.rememberMe);

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { success: false, error: 'Enter a valid email address.' },
      { status: 400 }
    );
  }

  if (!password) {
    return NextResponse.json(
      { success: false, error: 'Password is required.' },
      { status: 400 }
    );
  }

  let supabase;

  try {
    supabase = createSupabaseServerClient();
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  const { data, error } = await supabase.rpc('login_app_user', {
    email_input: email,
    password_input: password,
  });

  if (error) {
    return NextResponse.json(
      { success: false, error: getSupabaseErrorMessage(error) },
      { status: 500 }
    );
  }

  const user = Array.isArray(data) ? data[0] : data;

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Invalid email or password.' },
      { status: 401 }
    );
  }

  try {
    const session = await signAuthToken(user, { rememberMe });
    const response = NextResponse.json({ success: true, user: session.user });

    response.cookies.set(buildAuthCookie(session.token, rememberMe));

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
