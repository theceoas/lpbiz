const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function insertSampleProjects() {
  try {
    console.log('Inserting sample content projects...\n');
    
    const sampleProjects = [
      {
        title: 'E-commerce Product Showcase',
        description: 'Transform raw product photos into stunning e-commerce visuals with professional lighting, backgrounds, and styling.',
        category: 'E-commerce',
        before_image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
        after_image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        is_video: false,
        is_featured: true,
        display_order: 1,
        is_active: true
      },
      {
        title: 'Social Media Campaign',
        description: 'Convert basic images into engaging social media content with branded overlays, text, and visual effects.',
        category: 'Social Media',
        before_image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
        after_image_url: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop',
        is_video: false,
        is_featured: true,
        display_order: 2,
        is_active: true
      },
      {
        title: 'Product Demo Video',
        description: 'Transform static product images into dynamic video content with motion graphics and professional transitions.',
        category: 'Video',
        before_image_url: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop',
        after_image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        is_video: true,
        is_featured: true,
        display_order: 3,
        is_active: true
      },
      {
        title: 'Website Hero Section',
        description: 'Create compelling hero section visuals from basic images with professional composition and design elements.',
        category: 'Web Design',
        before_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        after_image_url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
        is_video: false,
        is_featured: false,
        display_order: 4,
        is_active: true
      },
      {
        title: 'Instagram Story Series',
        description: 'Transform regular photos into engaging Instagram story content with animations and interactive elements.',
        category: 'Social Media',
        before_image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
        after_image_url: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop',
        is_video: true,
        is_featured: false,
        display_order: 5,
        is_active: true
      },
      {
        title: 'Email Newsletter Design',
        description: 'Convert basic content into professional email newsletter layouts with responsive design and visual hierarchy.',
        category: 'Email Marketing',
        before_image_url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
        after_image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
        is_video: false,
        is_featured: false,
        display_order: 6,
        is_active: true
      }
    ];

    // First, let's check if we need to delete existing projects (except the test one)
    const { data: existingProjects } = await supabase
      .from('content_projects')
      .select('id, title');
    
    console.log('Existing projects:', existingProjects?.map(p => p.title));

    // Insert the sample projects
    const { data: insertedProjects, error: insertError } = await supabase
      .from('content_projects')
      .insert(sampleProjects)
      .select();

    if (insertError) {
      console.error('Error inserting projects:', insertError);
      return;
    }

    console.log(`Successfully inserted ${insertedProjects.length} projects:`);
    insertedProjects.forEach(project => {
      console.log(`  - ${project.title} (Featured: ${project.is_featured})`);
    });

    // Also update the test project to be featured if needed
    const { error: updateError } = await supabase
      .from('content_projects')
      .update({ is_featured: false, display_order: 0 })
      .eq('title', 'test');

    if (updateError) {
      console.error('Error updating test project:', updateError);
    }

    console.log('\nFinal check - Featured projects:');
    const { data: featuredProjects } = await supabase
      .from('content_projects')
      .select('title, is_featured')
      .eq('is_featured', true)
      .order('display_order');

    featuredProjects?.forEach(project => {
      console.log(`  ✓ ${project.title}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

insertSampleProjects();