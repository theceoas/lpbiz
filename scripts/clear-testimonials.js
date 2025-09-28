const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function clearTestimonials() {
  try {
    console.log('🗑️  Clearing all testimonials...')
    
    // Delete all testimonials
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records
    
    if (error) {
      console.error('❌ Error clearing testimonials:', error)
      process.exit(1)
    }
    
    console.log('✅ All testimonials have been successfully deleted!')
    console.log('📝 You can now upload your own testimonials through the admin panel.')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

clearTestimonials()