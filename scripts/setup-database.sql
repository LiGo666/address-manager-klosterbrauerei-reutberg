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
  email TEXT,
  phone TEXT,
  mobile TEXT,
  communication_preference TEXT,
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

-- Create optimized indexes for fast lookups
-- Composite index for token validation queries (most common operation)
CREATE INDEX IF NOT EXISTS idx_members_token_expiry ON members(token, expiry_date);
-- Index for customer_number lookups
CREATE INDEX IF NOT EXISTS idx_members_customer_number ON members(customer_number);
-- Index for expiry_date queries
CREATE INDEX IF NOT EXISTS idx_members_expiry_date ON members(expiry_date);

-- Disable Row Level Security
-- All access is controlled via API routes with Service Role Key
-- No direct client connections to Supabase
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
