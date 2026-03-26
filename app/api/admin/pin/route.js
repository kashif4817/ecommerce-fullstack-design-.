import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import {
  ADMIN_PIN_COOKIE,
  ADMIN_PIN_COOKIE_VALUE,
  ADMIN_PIN_RPC,
} from '@/lib/adminPin'

export async function POST(request) {
  let pin = ''

  try {
    const body = await request.json()
    pin = String(body?.pin || '').replace(/\D/g, '').slice(0, 4)
  } catch {
    pin = ''
  }

  if (pin.length !== 4) {
    return NextResponse.json(
      { success: false, error: 'Enter a valid 4-digit PIN.' },
      { status: 400 }
    )
  }

  const { data: isValid, error } = await supabase.rpc(ADMIN_PIN_RPC, {
    pin_input: pin,
  })

  if (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'PIN verification is not configured correctly in Supabase yet.',
        details: error.message,
      },
      { status: 500 }
    )
  }

  if (!isValid) {
    return NextResponse.json(
      { success: false, error: 'Incorrect PIN. Please try again.' },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set({
    name: ADMIN_PIN_COOKIE,
    value: ADMIN_PIN_COOKIE_VALUE,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set({
    name: ADMIN_PIN_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  return response
}
