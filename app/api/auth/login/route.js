import { NextResponse } from 'next/server';
import { verifyPassword, getUserFromDatabase, createJWT, formatUserResponse } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password, rememberMe } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await getUserFromDatabase(email);
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await createJWT(user);

    // Set cookie (7 days or 24 hours based on rememberMe)
    const maxAge = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60;

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: formatUserResponse(user),
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'authToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
