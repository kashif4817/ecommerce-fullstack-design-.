// Quick Testing Helper
// Run in Node to generate bcrypt hashes for testing

// TO USE:
// 1. Install: npm install bcrypt
// 2. Create passwords: node scripts/test-auth.js

const bcrypt = require('bcrypt');

async function generateHash(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log(`Password: "${password}"`);
  console.log(`Hash: ${hash}\n`);
  return hash;
}

async function main() {
  console.log('=== Generate Test User Passwords ===\n');

  console.log('Regular User:');
  await generateHash('password123');

  console.log('Admin User:');
  await generateHash('admin123');
}

main().catch(console.error);

// Run this SQL in Supabase to add test users:
/*
INSERT INTO users (email, password_hash, full_name, role) VALUES
(
  'user@example.com',
  '$2b$10$...paste_hash_here...',
  'Test User',
  'user'
),
(
  'admin@example.com',
  '$2b$10$...paste_hash_here...',
  'Test Admin',
  'admin'
);
*/
