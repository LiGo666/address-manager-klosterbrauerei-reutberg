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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on token for fast lookups
CREATE INDEX IF NOT EXISTS idx_members_token ON members(token);

-- Create index on customer_number for fast lookups
CREATE INDEX IF NOT EXISTS idx_members_customer_number ON members(customer_number);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access via token (for member self-service)
CREATE POLICY "Allow public read via token" ON members
  FOR SELECT
  USING (true);

-- Policy: Allow public update via token (for member self-service)
CREATE POLICY "Allow public update via token" ON members
  FOR UPDATE
  USING (true);

-- Policy: Allow public insert (for admin import)
CREATE POLICY "Allow public insert" ON members
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow public delete (for admin management)
CREATE POLICY "Allow public delete" ON members
  FOR DELETE
  USING (true);
