-- Enhance content_projects table to support multiple after media and better video support
-- Add new columns for enhanced functionality
ALTER TABLE content_projects 
ADD COLUMN IF NOT EXISTS after_media JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS after_video_url TEXT,
ADD COLUMN IF NOT EXISTS video_thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video', 'mixed'));

-- Update existing records to migrate data to new structure
UPDATE content_projects 
SET after_media = CASE 
    WHEN after_image_url IS NOT NULL THEN 
        jsonb_build_array(
            jsonb_build_object(
                'type', 'image',
                'url', after_image_url,
                'order', 1
            )
        )
    ELSE '[]'::jsonb
END
WHERE after_media = '[]'::jsonb;

-- Create index for better performance on featured projects
CREATE INDEX IF NOT EXISTS idx_content_projects_featured ON content_projects(is_featured, display_order) WHERE is_featured = true;

-- Create index for media type filtering
CREATE INDEX IF NOT EXISTS idx_content_projects_media_type ON content_projects(media_type);

-- Create index for active projects
CREATE INDEX IF NOT EXISTS idx_content_projects_active ON content_projects(is_active, display_order) WHERE is_active = true;

-- Add comment to explain the after_media structure
COMMENT ON COLUMN content_projects.after_media IS 'JSON array of media objects with structure: [{"type": "image|video", "url": "...", "order": 1, "thumbnail": "..."}]';

-- Create function to validate after_media JSON structure
CREATE OR REPLACE FUNCTION validate_after_media(media_data JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if it's an array
    IF jsonb_typeof(media_data) != 'array' THEN
        RETURN FALSE;
    END IF;
    
    -- Check each item in the array
    FOR i IN 0..jsonb_array_length(media_data) - 1 LOOP
        IF NOT (
            media_data->i ? 'type' AND
            media_data->i ? 'url' AND
            media_data->i ? 'order' AND
            (media_data->i->>'type') IN ('image', 'video')
        ) THEN
            RETURN FALSE;
        END IF;
    END LOOP;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Add constraint to validate after_media structure
ALTER TABLE content_projects 
ADD CONSTRAINT check_after_media_structure 
CHECK (validate_after_media(after_media));

-- Update the updated_at trigger
DROP TRIGGER IF EXISTS update_content_projects_updated_at ON content_projects;
CREATE TRIGGER update_content_projects_updated_at
    BEFORE UPDATE ON content_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();