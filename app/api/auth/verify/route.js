import { NextResponse } from 'next/server';
import { verifyJWT, getUserFromDatabase, formatUserResponse } from '@/lib/auth';

export async function GET(request) {
  try {
    const authToken = request.cookies.get('authToken')?.value;

    if (!authToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify JWT
    const payload = await verifyJWT(authToken);
    if (!payload) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user from database to ensure they still exist
    const user = await getUserFromDatabase(payload.email);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Token verified',
        user: formatUserResponse(user),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { message: 'Verification failed' },
      { status: 500 }
    );
  }
}
