-- Add is_urgent field to notices table (safe - only adds if not exists)
ALTER TABLE notices ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT FALSE;

-- Create index for urgent notices filtering (safe - only creates if not exists)
CREATE INDEX IF NOT EXISTS idx_notices_urgent ON notices(is_urgent);
