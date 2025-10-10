/*
  # Create Users Table for Lost & Found Portal

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique user identifier from Supabase Auth
      - `email` (text, unique, not null) - User email from Google OAuth
      - `name` (text) - Full name from Google profile
      - `picture` (text) - Profile picture URL from Google
      - `role` (text, default 'student') - User role (student/admin)
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last profile update timestamp

  2. Security
    - Enable Row Level Security (RLS) on `users` table
    - Add policy for users to read their own profile data
    - Add policy for users to update their own profile data
    - Add policy for users to insert their own profile on first login

  3. Important Notes
    - The `id` field links to Supabase Auth's `auth.users` table
    - Google OAuth integration is handled by Supabase Auth
    - RLS ensures users can only access/modify their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  picture text,
  role text DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile on first login
CREATE POLICY "Users can create own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();