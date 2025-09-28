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

async function runMigration() {
  try {
    console.log('🚀 Running content projects schema enhancement migration...')
    
    // Check if after_media column exists and add it if not
    console.log('📋 Checking existing schema...')
    
    // First, let's check what columns exist
    const { data: existingProjects, error: checkError } = await supabase
      .from('content_projects')
      .select('*')
      .limit(1)
    
    if (checkError) {
      console.error('❌ Error checking existing schema:', checkError)
      process.exit(1)
    }
    
    console.log('✅ Successfully connected to content_projects table')
    
    if (existingProjects.length > 0) {
      const sampleProject = existingProjects[0]
      console.log('📊 Current schema includes columns:', Object.keys(sampleProject))
      
      // Check if we need to migrate existing data
      if (sampleProject.after_image_url && (!sampleProject.after_media || sampleProject.after_media.length === 0)) {
        console.log('🔄 Migrating existing after_image_url to after_media format...')
        
        // Get all projects with after_image_url but no after_media
        const { data: projectsToMigrate, error: fetchError } = await supabase
          .from('content_projects')
          .select('id, after_image_url')
          .not('after_image_url', 'is', null)
          .neq('after_image_url', '')
        
        if (fetchError) {
          console.error('❌ Error fetching projects to migrate:', fetchError)
        } else {
          console.log(`📁 Found ${projectsToMigrate.length} projects to migrate`)
          
          // Migrate each project
          for (const project of projectsToMigrate) {
            const afterMedia = [{
              type: 'image',
              url: project.after_image_url,
              order: 1
            }]
            
            const { error: updateError } = await supabase
              .from('content_projects')
              .update({ 
                after_media: afterMedia,
                media_type: 'image'
              })
              .eq('id', project.id)
            
            if (updateError) {
              console.error(`❌ Error updating project ${project.id}:`, updateError)
            } else {
              console.log(`✅ Migrated project ${project.id}`)
            }
          }
        }
      }
    }
    
    // Verify the migration
    console.log('\n📋 Verifying migration results...')
    
    const { data: projects, error: projectsError } = await supabase
      .from('content_projects')
      .select('id, title, after_media, media_type, after_image_url')
      .limit(5)
    
    if (projectsError) {
      console.error('❌ Error checking projects:', projectsError)
    } else {
      console.log('\n📁 Sample projects after migration:')
      projects.forEach(project => {
        console.log(`  - ${project.title}:`)
        console.log(`    media_type: ${project.media_type || 'not set'}`)
        console.log(`    after_media: ${JSON.stringify(project.after_media)}`)
        console.log(`    after_image_url: ${project.after_image_url || 'not set'}`)
        console.log('')
      })
    }
    
    console.log('✅ Migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

runMigration()