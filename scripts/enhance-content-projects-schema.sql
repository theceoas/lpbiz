-- Enhance content_projects table to support multiple after media and videos
-- This migration adds proper support for the after_media JSONB column and ensures all necessary fields exist

-- Add after_media column if it doesn't exist (JSONB array for multiple images/videos)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'content_projects' 
        AND column_name = 'after_media'
    ) THEN
        ALTER TABLE content_projects ADD COLUMN after_media JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- Add media_type column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'content_projects' 
        AND column_name = 'media_type'
    ) THEN
        ALTER TABLE content_projects ADD COLUMN media_type VARCHAR(20) DEFAULT 'image';
    END IF;
END $$;

-- Add after_video_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'content_projects' 
        AND column_name = 'after_video_url'
    ) THEN
        ALTER TABLE content_projects ADD COLUMN after_video_url TEXT;
    END IF;
END $$;

-- Add video_thumbnail_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'content_projects' 
        AND column_name = 'video_thumbnail_url'
    ) THEN
        ALTER TABLE content_projects ADD COLUMN video_thumbnail_url TEXT;
    END IF;
END $$;

-- Update existing projects to have proper after_media structure
UPDATE content_projects 
SET after_media = CASE 
    WHEN after_media IS NULL OR after_media = 'null'::jsonb OR after_media = '[]'::jsonb THEN
        CASE 
            WHEN after_image_url IS NOT NULL AND after_image_url != '' THEN
                jsonb_build_array(
                    jsonb_build_object(
                        'type', 'image',
                        'url', after_image_url,
                        'order', 1
                    )
                )
            ELSE '[]'::jsonb
        END
    ELSE after_media
END
WHERE after_media IS NULL OR after_media = 'null'::jsonb OR after_media = '[]'::jsonb;

-- Add constraint to ensure media_type is valid
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'content_projects_media_type_check'
    ) THEN
        ALTER TABLE content_projects 
        ADD CONSTRAINT content_projects_media_type_check 
        CHECK (media_type IN ('image', 'video', 'mixed'));
    END IF;
END $$;

-- Create index on media_type for better query performance
CREATE INDEX IF NOT EXISTS idx_content_projects_media_type ON content_projects(media_type);

-- Create index on after_media for JSONB queries
CREATE INDEX IF NOT EXISTS idx_content_projects_after_media ON content_projects USING GIN(after_media);

COMMENT ON COLUMN content_projects.after_media IS 'JSONB array containing multiple after images/videos with structure: [{"type": "image|video", "url": "...", "order": 1, "thumbnail": "..."}]';
COMMENT ON COLUMN content_projects.media_type IS 'Type of media in after section: image, video, or mixed';