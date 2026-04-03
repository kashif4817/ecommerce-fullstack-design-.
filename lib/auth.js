import { SignJWT, jwtVerify } from 'jose';
import { supabase } from './supabase';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

export async function hashPassword(password) {
  return password; // Store plain text password
}

export async function verifyPassword(password, hash) {
  return password === hash; // Compare plain text
}

export async function createJWT(user) {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET);

  return token;
}

export async function verifyJWT(token) {
  try {
    const verified = await jwtVerify(token, SECRET);
    return verified.payload;
  } catch (error) {
    return null;
  }
}

export async function getUserFromDatabase(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function createUserInDatabase(email, password, fullName) {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        email,
        password_hash: password, // Store plain text
        full_name: fullName,
        role: 'user', // Default role
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function formatUserResponse(user) {
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
