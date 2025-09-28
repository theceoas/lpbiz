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

async function makeProjectFeatured() {
  try {
    console.log('🔄 Updating existing project to be featured...')
    
    // Update the existing project to be featured
    const { data, error } = await supabase
      .from('content_projects')
      .update({ 
        is_featured: true,
        display_order: 1 
      })
      .eq('id', 'ad6b2342-72c2-4cd2-a8e0-38e198cfe200')
      .select()

    if (error) {
      console.error('❌ Error updating project:', error)
      return
    }

    console.log('✅ Successfully updated project to be featured:', data)
    
    // Verify the update
    const { data: featuredProjects, error: fetchError } = await supabase
      .from('content_projects')
      .select('id, title, is_featured, is_active')
      .eq('is_featured', true)
      .eq('is_active', true)

    if (fetchError) {
      console.error('❌ Error fetching featured projects:', fetchError)
      return
    }

    console.log('🎯 Featured projects:', featuredProjects)
    
  } catch (error) {
    console.error('❌ Script error:', error)
  }
}

makeProjectFeatured()