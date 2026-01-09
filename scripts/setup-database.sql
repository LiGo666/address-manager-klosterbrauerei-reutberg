-- Complete database setup script
-- This script creates the members table and all required structures
-- It uses IF NOT EXISTS to be idempotent

-- Create members table for storing member data
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_number TEXT UNIQUE NOT NULL,
  salutation TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  name2 TEXT,
  street TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  notes TEXT,
  token TEXT UNIQUE NOT NULL,
  expiry_date TIMESTAMPTZ NOT NULL,
  modified BOOLEAN DEFAULT FALSE,
  modified_at TIMESTAMPTZ,
  original_street TEXT,
  original_postal_code TEXT,
  original_city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_members_token ON members(token);
CREATE INDEX IF NOT EXISTS idx_members_customer_number ON members(customer_number);
CREATE INDEX IF NOT EXISTS idx_members_expiry_date ON members(expiry_date);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to ensure clean state)
DROP POLICY IF EXISTS "Allow public read via token" ON members;
DROP POLICY IF EXISTS "Allow public update via token" ON members;
DROP POLICY IF EXISTS "Allow read for non-expired" ON members;
DROP POLICY IF EXISTS "Allow update for non-expired" ON members;
DROP POLICY IF EXISTS "Allow insert" ON members;
DROP POLICY IF EXISTS "Allow delete" ON members;

-- Policy: Allow read only for non-expired tokens
-- This provides a basic layer of protection - full token validation is in app layer
CREATE POLICY "Allow read for non-expired" ON members
  FOR SELECT
  USING (expiry_date > NOW());

-- Policy: Allow update only for non-expired tokens
-- Full token matching validation happens in application layer
CREATE POLICY "Allow update for non-expired" ON members
  FOR UPDATE
  USING (expiry_date > NOW())
  WITH CHECK (expiry_date > NOW());

-- Policy: Allow insert (admin operations use service role, so this is safe)
CREATE POLICY "Allow insert" ON members
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow delete (admin operations use service role, so this is safe)
CREATE POLICY "Allow delete" ON members
  FOR DELETE
  USING (true);
