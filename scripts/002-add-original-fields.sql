-- Add fields to track original values for transparent change display
ALTER TABLE members
ADD COLUMN IF NOT EXISTS original_street TEXT,
ADD COLUMN IF NOT EXISTS original_postal_code TEXT,
ADD COLUMN IF NOT EXISTS original_city TEXT;
