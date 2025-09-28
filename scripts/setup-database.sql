-- BizPilot Database Schema Setup
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    company VARCHAR(255),
    business VARCHAR(255), -- Keep for backward compatibility
    content TEXT NOT NULL,
    quote TEXT, -- Keep for backward compatibility
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    image_url TEXT,
    text_message_image_url TEXT,
    is_text_message BOOLEAN DEFAULT false,
    display_order INTEGER,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create before_after_images table
CREATE TABLE IF NOT EXISTS before_after_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    before_image_url TEXT NOT NULL,
    after_image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pipeline_stages table
CREATE TABLE IF NOT EXISTS pipeline_stages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Default blue color
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default pipeline stages
INSERT INTO pipeline_stages (name, color, order_index) VALUES
    ('New Lead', '#10B981', 1),
    ('Contacted', '#3B82F6', 2),
    ('Qualified', '#F59E0B', 3),
    ('Proposal Sent', '#8B5CF6', 4),
    ('Negotiation', '#EF4444', 5),
    ('Closed Won', '#059669', 6),
    ('Closed Lost', '#6B7280', 7)
ON CONFLICT DO NOTHING;

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'medium',
    pipeline_stage_id UUID REFERENCES pipeline_stages(id),
    notes TEXT,
    estimated_value DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    contract_value DECIMAL(10,2),
    start_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('testimonials', 'testimonials', true),
    ('before-after', 'before-after', true)
ON CONFLICT DO NOTHING;

-- Set up Row Level Security (RLS) policies
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE before_after_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public read access for testimonials and before_after_images
CREATE POLICY "Public read access for testimonials" ON testimonials
    FOR SELECT USING (true);

CREATE POLICY "Public read access for before_after_images" ON before_after_images
    FOR SELECT USING (true);

-- Admin full access to all tables
CREATE POLICY "Admin full access to testimonials" ON testimonials
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@bizpilot.com');

CREATE POLICY "Admin full access to before_after_images" ON before_after_images
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@bizpilot.com');

CREATE POLICY "Admin full access to chat_messages" ON chat_messages
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@bizpilot.com');

CREATE POLICY "Admin full access to pipeline_stages" ON pipeline_stages
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@bizpilot.com');

CREATE POLICY "Admin full access to leads" ON leads
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@bizpilot.com');

CREATE POLICY "Admin full access to clients" ON clients
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@bizpilot.com');

CREATE POLICY "Admin full access to notifications" ON notifications
    FOR ALL USING (auth.jwt() ->> 'email' = 'admin@bizpilot.com');

-- Public insert access for chat_messages (for the AI chat feature)
CREATE POLICY "Public insert access for chat_messages" ON chat_messages
    FOR INSERT WITH CHECK (true);

-- Storage policies for file uploads
CREATE POLICY "Admin upload access" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id IN ('testimonials', 'before-after') AND
        auth.jwt() ->> 'email' = 'admin@bizpilot.com'
    );

CREATE POLICY "Admin delete access" ON storage.objects
    FOR DELETE USING (
        bucket_id IN ('testimonials', 'before-after') AND
        auth.jwt() ->> 'email' = 'admin@bizpilot.com'
    );

CREATE POLICY "Public read access to storage" ON storage.objects
    FOR SELECT USING (bucket_id IN ('testimonials', 'before-after'));

-- Insert some sample data
INSERT INTO testimonials (name, company, content, rating, is_featured) VALUES
    ('Chioma', 'Beauty Products Seller', 'I went from missing 10+ orders every day to zero missed sales. My customers now get instant replies, and my revenue doubled in two months.', 5, true),
    ('Ada', 'Fashion Seller', 'BizPilot saved me 25 hours every week and boosted my sales by 40% in the first month.', 5, true),
    ('Emeka', 'Electronics Store', 'The automated responses are so natural, my customers think I''m personally replying to each message. Amazing!', 5, false)
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Database setup completed successfully!' as message;