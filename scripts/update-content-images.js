const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const contentProjects = [
  {
    title: 'E-commerce Product Showcase',
    before_image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    after_image_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop'
  },
  {
    title: 'Social Media Campaign',
    before_image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    after_image_url: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop'
  },
  {
    title: 'Product Demo Video',
    before_image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    after_image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
  },
  {
    title: 'Website Hero Section',
    before_image_url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
    after_image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop'
  },
  {
    title: 'Instagram Story Series',
    before_image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    after_image_url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop'
  },
  {
    title: 'Email Newsletter Design',
    before_image_url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
    after_image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
  }
]

async function updateContentProjects() {
  console.log('Updating content projects with image URLs...')
  
  for (const project of contentProjects) {
    try {
      const { data, error } = await supabase
        .from('content_projects')
        .update({
          before_image_url: project.before_image_url,
          after_image_url: project.after_image_url
        })
        .eq('title', project.title)
        .select()

      if (error) {
        console.error(`Error updating ${project.title}:`, error)
      } else {
        console.log(`✓ Updated ${project.title}`)
      }
    } catch (err) {
      console.error(`Exception updating ${project.title}:`, err)
    }
  }

  // Verify the updates
  console.log('\nVerifying updates...')
  const { data: allProjects, error } = await supabase
    .from('content_projects')
    .select('title, before_image_url, after_image_url, is_featured')
    .eq('is_active', true)
    .order('display_order')

  if (error) {
    console.error('Error fetching projects:', error)
  } else {
    console.log('\nCurrent content projects:')
    allProjects.forEach(project => {
      console.log(`- ${project.title} (Featured: ${project.is_featured})`)
      console.log(`  Before: ${project.before_image_url ? 'Has image' : 'No image'}`)
      console.log(`  After: ${project.after_image_url ? 'Has image' : 'No image'}`)
    })
  }
}

updateContentProjects().catch(console.error)