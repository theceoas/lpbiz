-- Create content_projects table
CREATE TABLE IF NOT EXISTS content_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    before_image_url TEXT,
    after_image_url TEXT,
    is_video BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for content project images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('content-projects', 'content-projects', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE content_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for content_projects table
CREATE POLICY "Public can view active content projects" ON content_projects
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage content projects" ON content_projects
    FOR ALL USING (auth.role() = 'admin');

-- Create storage policies for content-projects bucket
CREATE POLICY "Admin can upload content project files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'content-projects' AND auth.role() = 'admin');

CREATE POLICY "Admin can delete content project files" ON storage.objects
    FOR DELETE USING (bucket_id = 'content-projects' AND auth.role() = 'admin');

CREATE POLICY "Public can view content project files" ON storage.objects
    FOR SELECT USING (bucket_id = 'content-projects');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_projects_updated_at 
    BEFORE UPDATE ON content_projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO content_projects (title, description, category, before_image_url, after_image_url, is_video, is_featured, display_order) VALUES
('E-commerce Product Showcase', 'Transform basic product photos into stunning e-commerce visuals with professional lighting and backgrounds', 'Product Photography', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop', false, true, 1),
('Social Media Campaign', 'Convert raw brand assets into engaging social media content with consistent styling and messaging', 'Marketing Content', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop', false, true, 2),
('Product Demo Video', 'Turn simple product footage into compelling demo videos with motion graphics and professional editing', 'Video Content', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop', true, true, 3),
('Website Hero Section', 'Transform basic layouts into modern, conversion-optimized hero sections with dynamic elements', 'Web Design', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop', false, false, 4),
('Instagram Story Series', 'Convert brand content into cohesive Instagram story templates with animations and interactive elements', 'Social Video', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', true, false, 5),
('Email Newsletter Design', 'Transform plain text content into visually appealing email templates with responsive design', 'Email Marketing', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop', false, false, 6);