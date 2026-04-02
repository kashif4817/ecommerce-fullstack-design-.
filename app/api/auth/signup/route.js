import { NextResponse } from 'next/server';
import {
  buildAuthCookie,
  isValidEmail,
  normalizeEmail,
  signAuthToken,
} from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export const runtime = 'nodejs';

function getSignupErrorStatus(error) {
  if (error?.message?.toLowerCase().includes('already exists')) {
    return 409;
  }

  return 500;
}

function getSignupErrorMessage(error) {
  if (error?.code === 'PGRST202') {
    return 'Run supabase/users_auth_setup.sql in your Supabase SQL editor first.';
  }

  if (error?.message?.toLowerCase().includes('already exists')) {
    return 'An account with this email already exists.';
  }

  return error?.message || 'Unable to create your account right now.';
}

export async function POST(request) {
  let body = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const fullName = String(body?.name ?? body?.fullName ?? '').trim();
  const email = normalizeEmail(body?.email);
  const password = String(body?.password || '');

  if (fullName.length < 2) {
    return NextResponse.json(
      { success: false, error: 'Enter your full name.' },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { success: false, error: 'Enter a valid email address.' },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { success: false, error: 'Password must be at least 8 characters.' },
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

  const { data, error } = await supabase.rpc('register_app_user', {
    full_name_input: fullName,
    email_input: email,
    password_input: password,
  });

  if (error) {
    return NextResponse.json(
      { success: false, error: getSignupErrorMessage(error) },
      { status: getSignupErrorStatus(error) }
    );
  }

  const user = Array.isArray(data) ? data[0] : data;

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unable to create your account right now.' },
      { status: 500 }
    );
  }

  try {
    const session = await signAuthToken(user);
    const response = NextResponse.json(
      { success: true, user: session.user },
      { status: 201 }
    );

    response.cookies.set(buildAuthCookie(session.token));

    return response;
  } catch (signError) {
    return NextResponse.json(
      { success: false, error: signError.message },
      { status: 500 }
    );
  }
}
