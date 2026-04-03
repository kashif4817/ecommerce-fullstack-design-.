# SQL Setup - Users Table

Run this SQL in Supabase SQL Editor to create the users table:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- Note: Stores plain text password (not hashed)
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

**Note:** This table has NO row-level security policy as per requirements. Passwords are stored in plain text (not recommended for production).

## Create Admin User

Run this SQL to create an admin user (replace with your desired credentials):

```sql
INSERT INTO users (email, password_hash, full_name, role)
VALUES ('admin@example.com', 'admin123', 'Admin User', 'admin');
```

**Example with different credentials:**
```sql
INSERT INTO users (email, password_hash, full_name, role)
VALUES ('your-admin-email@example.com', 'your-secure-password', 'Your Admin Name', 'admin');
```
