-- Update existing content projects with actual image URLs

-- Update E-commerce Product Showcase
UPDATE content_projects 
SET 
  before_image_url = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
  after_image_url = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop'
WHERE title = 'E-commerce Product Showcase';

-- Update Social Media Campaign
UPDATE content_projects 
SET 
  before_image_url = 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
  after_image_url = 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop'
WHERE title = 'Social Media Campaign';

-- Update Product Demo Video
UPDATE content_projects 
SET 
  before_image_url = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  after_image_url = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
WHERE title = 'Product Demo Video';

-- Update Website Hero Section
UPDATE content_projects 
SET 
  before_image_url = 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
  after_image_url = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop'
WHERE title = 'Website Hero Section';

-- Update Instagram Story Series
UPDATE content_projects 
SET 
  before_image_url = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
  after_image_url = 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop'
WHERE title = 'Instagram Story Series';

-- Update Email Newsletter Design
UPDATE content_projects 
SET 
  before_image_url = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
  after_image_url = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
WHERE title = 'Email Newsletter Design';

-- Verify the updates
SELECT title, before_image_url, after_image_url FROM content_projects WHERE is_active = true ORDER BY display_order;