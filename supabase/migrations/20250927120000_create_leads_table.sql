-- Create pipeline_stages table first (if it doesn't exist)
CREATE TABLE IF NOT EXISTS pipeline_stages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position INTEGER NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default pipeline stages
INSERT INTO pipeline_stages (name, position, color) VALUES
('New Lead', 1, '#3B82F6'),
('Contacted', 2, '#F59E0B'),
('Qualified', 3, '#10B981'),
('Proposal Sent', 4, '#8B5CF6'),
('Negotiation', 5, '#F97316'),
('Closed Won', 6, '#059669'),
('Closed Lost', 7, '#EF4444')
ON CONFLICT DO NOTHING;

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pipeline_stages_updated_at ON pipeline_stages;
CREATE TRIGGER update_pipeline_stages_updated_at
    BEFORE UPDATE ON pipeline_stages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();