# Authentication System - Complete Setup Guide

## Overview
A complete authentication system with JWT + Cookie-based sessions, role-based access control (user/admin), and protected admin routes.

---

## 1. DATABASE SETUP (Supabase SQL)

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create a trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 2. ENVIRONMENT VARIABLES

Add to your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

---

## 3. INSTALL DEPENDENCIES

```bash
npm install
```

This will install `bcrypt` for password hashing.

---

## 4. FILE STRUCTURE

### New files created:
- `/lib/auth.js` - JWT and password utilities
- `/hooks/useAuth.js` - Auth hook with login, signup, logout
- `/context/AuthContext.js` - Auth context provider
- `/app/api/auth/signup/route.js` - Signup API endpoint
- `/app/api/auth/login/route.js` - Login API endpoint
- `/app/api/auth/logout/route.js` - Logout API endpoint
- `/app/api/auth/verify/route.js` - JWT verification endpoint
- `/middleware.js` - Admin route protection middleware

### Updated files:
- `/app/(auth)/login/page.js` - Login page with API integration
- `/app/(auth)/signup/page.js` - Signup page with API integration
- `/app/admin/layout.js` - Admin layout with role protection
- `/app/providers.js` - Already includes AuthProvider
- `/package.json` - Added bcrypt dependency

---

## 5. FEATURES IMPLEMENTED

### Authentication Flow
✅ **Signup**
- User creates account with full_name, email, password
- Password hashed with bcrypt (10 salt rounds)
- Default user role = 'user'
- Stores in Supabase users table
- Redirects to login with success toast

✅ **Login**
- Email & password authentication
- Password verified against hash
- JWT token created (7 days expiration)
- Token stored in HTTP-only cookie
- "Remember Me" option extends cookie to 7 days (default 24h)
- Role-based redirect:
  - Admin → `/admin/dashboard`
  - User → `/`

✅ **Protected Routes**
- Middleware checks `/admin/*` routes
- Requires valid JWT token
- Requires `role === 'admin'`
- Non-admin users redirected to `/login`
- Unauthenticated redirected to `/login`

✅ **Admin Dashboard Protection**
- Client-side check in admin layout
- Auth context verifies user role
- Shows loading state while checking
- Prevents accessing admin pages without admin role

✅ **Social Auth Icons**
- Google, Facebook, Apple buttons show Toast
- Message: "Coming soon" informational toast
- Easy to implement later

✅ **Session Management**
- Auth verification via `/api/auth/verify` endpoint
- Cookie-based sessions (no localStorage)
- Auto-check on app load via AuthContext useEffect
- JWT + Cookie expiration handling

---

## 6. API ENDPOINTS

### POST `/api/auth/signup`
Create new user account
```json
Request: {
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
Response: {
  "message": "Account created successfully",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "full_name": "John Doe",
    "role": "user"
  }
}
```

### POST `/api/auth/login`
Authenticate user
```json
Request: {
  "email": "john@example.com",
  "password": "securepassword",
  "rememberMe": true
}
Response: {
  "message": "Login successful",
  "user": { ... }
}
Sets cookie: authToken (HttpOnly, Secure, SameSite=Lax)
```

### GET `/api/auth/verify`
Verify JWT token (called on app load)
```json
Response: {
  "message": "Token verified",
  "user": { ... }
}
```

### POST `/api/auth/logout`
Clear session
```json
Response: {
  "message": "Logged out successfully"
}
Clears cookie: authToken
```

---

## 7. HOOKS & CONTEXT

### useAuth() Hook
```javascript
import useAuth from '@/hooks/useAuth';

export function MyComponent() {
  const { user, isLoading, login, signup, logout } = useAuth();
  
  // user: { id, email, full_name, role }
  // isLoading: boolean
  // login(email, password, rememberMe) → { success, user, error }
  // signup(fullName, email, password) → { success, error }
  // logout() → { success }
}
```

### AuthContext
Provides auth state to entire app via Providers component

---

## 8. TESTING THE SYSTEM

### Create Admin User (via Supabase Dashboard)
1. Go to Supabase → SQL Editor
2. Add user with role = 'admin':
```sql
INSERT INTO users (email, password_hash, full_name, role)
VALUES (
  'admin@example.com',
  '$2b$10$...',  -- bcrypt hash of "password123"
  'Admin User',
  'admin'
);
```

Or use this command-line helper to generate bcrypt hash:
```bash
node -e "require('bcrypt').hash('password123', 10).then(h => console.log(h))"
```

### Test Signup Flow
1. Visit `/signup`
2. Fill form, click social buttons (see toast)
3. Submit → redirects to `/login` with toast

### Test Login Flow
1. Visit `/login`
2. Login as regular user → redirected to `/`
3. Login as admin → redirected to `/admin/dashboard`

### Test Admin Protection
1. Try accessing `/admin` without login → redirected to `/login`
2. Login as user → middleware redirects back
3. Login as admin → access granted

### Test Social Auth Toast
- Click Google/Facebook/Apple button
- See informational toast: "Coming soon"

---

## 9. SECURITY FEATURES

✅ HTTP-Only Cookies
- JWT stored in HTTP-only cookie
- Cannot be accessed via JavaScript
- Protected against XSS attacks

✅ Secure Cookie Attributes
- httpOnly: true
- secure: true (in production)
- sameSite: 'lax'

✅ Password Hashing
- bcrypt with 10 salt rounds
- Never store plain passwords
- Passwords compared securely

✅ JWT Expiration
- Default 7 days with "Remember Me"
- 24 hours without "Remember Me"
- Server verifies expiration

✅ Admin Route Protection
- Middleware-level validation
- Client-side checks prevent render
- Cannot access admin pages without proper role

---

## 10. TROUBLESHOOTING

### Issue: "useAuth must be used within AuthProvider"
**Solution:** Ensure component is wrapped by Providers component (already in RootLayout)

### Issue: Login fails with "Invalid email or password"
**Solution:** 
- Check email exists in users table
- Verify bcrypt hash is correct
- Clear browser cookies

### Issue: Admin pages show loading indefinitely
**Solution:**
- Check JWT_SECRET env var is set
- Verify cookie is being set (DevTools → Application → Cookies)
- Check auth/verify endpoint returns correct user

### Issue: Social buttons show error instead of toast
**Solution:** Check sonner Toast is properly configured in providers.js (already done)

---

## 11. NEXT STEPS (TO IMPLEMENT LATER)

- [ ] Google OAuth integration
- [ ] Facebook OAuth integration
- [ ] Apple OAuth integration
- [ ] Forgot password flow
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Refresh token rotation
- [ ] Session management dashboard
- [ ] Admin user management

---

## 12. QUICK START CHECKLIST

- [ ] Run SQL table creation script in Supabase
- [ ] Add env vars to `.env.local`
- [ ] Run `npm install` to install bcrypt
- [ ] Start dev server: `npm run dev`
- [ ] Test signup at `http://localhost:3000/signup`
- [ ] Test login at `http://localhost:3000/login`
- [ ] Create admin user in Supabase dashboard
- [ ] Test admin access at `http://localhost:3000/admin`
- [ ] Verify middleware protection works

---

**Status:** ✅ Complete - Ready for testing!
