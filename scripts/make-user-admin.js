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

async function makeUserAdmin(userId) {
  try {
    console.log(`Making user ${userId} an admin...`)
    
    // First, get the user to see current details
    const { data: user, error: getUserError } = await supabase.auth.admin.getUserById(userId)
    
    if (getUserError) {
      throw getUserError
    }
    
    if (!user.user) {
      throw new Error('User not found')
    }
    
    console.log('Current user details:')
    console.log('- Email:', user.user.email)
    console.log('- Current metadata:', user.user.user_metadata)
    
    // Update the user to have admin privileges
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      { 
        email: 'admin@bizpilot.com', // Change email to admin email
        email_confirm: true,
        user_metadata: {
          ...user.user.user_metadata,
          role: 'admin',
          name: user.user.user_metadata?.name || 'Admin User',
          original_email: user.user.email // Keep track of original email
        }
      }
    )
    
    if (updateError) {
      throw updateError
    }
    
    console.log('✅ User successfully updated to admin!')
    console.log('- New email: admin@bizpilot.com')
    console.log('- Role: admin')
    console.log('- Original email stored in metadata:', user.user.email)
    console.log('\n🔗 Admin URL: http://localhost:3001/admin')
    
  } catch (error) {
    console.error('❌ Error making user admin:', error.message)
    process.exit(1)
  }
}

// Get user ID from command line argument
const userId = process.argv[2]

if (!userId) {
  console.error('Please provide a user ID as an argument')
  console.error('Usage: node make-user-admin.js <user-id>')
  process.exit(1)
}

makeUserAdmin(userId)