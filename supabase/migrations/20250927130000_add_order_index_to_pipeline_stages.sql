-- Add order_index column to pipeline_stages table
ALTER TABLE pipeline_stages ADD COLUMN IF NOT EXISTS order_index INTEGER;

-- Update existing records to set order_index equal to position
UPDATE pipeline_stages SET order_index = position WHERE order_index IS NULL;

-- Make order_index NOT NULL after setting values
ALTER TABLE pipeline_stages ALTER COLUMN order_index SET NOT NULL;