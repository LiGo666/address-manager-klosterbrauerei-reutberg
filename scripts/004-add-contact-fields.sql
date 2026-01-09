-- Add contact fields to members table
-- This migration adds email, phone, mobile, and communication_preference fields

ALTER TABLE members
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS mobile TEXT,
ADD COLUMN IF NOT EXISTS communication_preference TEXT;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email) WHERE email IS NOT NULL;
