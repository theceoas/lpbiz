-- Content Projects Schema Setup
-- Run this in your Supabase SQL Editor to add content projects functionality

-- Create content_projects table
CREATE TABLE IF NOT EXISTS content_projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    before_image_url TEXT NOT NULL,
    after_image_url TEXT NOT NULL,
    is_video BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for content projects
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('content-projects', 'content-projects', true)
ON CONFLICT DO NOTHING;

-- Enable RLS for content_projects
ALTER TABLE content_projects ENABLE ROW LEVEL SECURITY;

-- Public read access for content_projects
CREATE POLICY "Public read access for content_projects" ON content_projects
    FOR SELECT USING (is_active = true);

-- Admin full access to content_projects
CREATE POLICY "Admin full access to content_projects" ON content_projects
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@bizpilot.com');

-- Storage policies for content projects
CREATE POLICY "Admin upload access to content projects" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'content-projects' AND
        auth.jwt() ->> 'email' = 'admin@bizpilot.com'
    );

CREATE POLICY "Admin delete access to content projects" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'content-projects' AND
        auth.jwt() ->> 'email' = 'admin@bizpilot.com'
    );

CREATE POLICY "Public read access to content projects storage" ON storage.objects
    FOR SELECT USING (bucket_id = 'content-projects');

-- Add updated_at trigger for content_projects
CREATE TRIGGER update_content_projects_updated_at BEFORE UPDATE ON content_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample content projects
INSERT INTO content_projects (title, description, category, before_image_url, after_image_url, is_video, is_featured, display_order) VALUES
    ('E-commerce Product Shot', 'Raw product photo transformed into professional e-commerce listing', 'Product Photography', '/api/placeholder/300/200', '/api/placeholder/300/200', false, true, 1),
    ('Social Media Ad', 'Basic image converted to engaging social media advertisement', 'Marketing Content', '/api/placeholder/300/200', '/api/placeholder/300/200', false, true, 2),
    ('Brand Story Video', 'Product showcase transformed into compelling brand story', 'Video Content', '/api/placeholder/300/200', '/api/placeholder/300/200', true, true, 3),
    ('Website Banner', 'Simple photo elevated to professional website banner', 'Web Design', '/api/placeholder/300/200', '/api/placeholder/300/200', false, false, 4),
    ('Instagram Reel', 'Raw footage edited into viral-ready Instagram content', 'Social Video', '/api/placeholder/300/200', '/api/placeholder/300/200', true, false, 5),
    ('Email Campaign Visual', 'Product image optimized for email marketing campaigns', 'Email Marketing', '/api/placeholder/300/200', '/api/placeholder/300/200', false, false, 6)
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Content projects schema setup completed successfully!' as message;