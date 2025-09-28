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

async function createAdminUser() {
  const adminEmail = 'admin@bizpilot.com'
  const adminPassword = 'BizPilot2024!Admin'

  try {
    console.log('Setting up admin user...')
    
    // First, try to get the existing user
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      throw listError
    }
    
    const existingUser = users.users.find(user => user.email === adminEmail)
    
    if (existingUser) {
      console.log('✅ Admin user already exists')
      console.log('User ID:', existingUser.id)
      
      // Update the password for the existing user
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { 
          password: adminPassword,
          email_confirm: true,
          user_metadata: {
            role: 'admin',
            name: 'Admin User'
          }
        }
      )
      
      if (updateError) {
        console.log('⚠️  Could not update password:', updateError.message)
      } else {
        console.log('✅ Admin password updated successfully')
      }
    } else {
      // Create the admin user
      const { data, error } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          role: 'admin',
          name: 'Admin User'
        }
      })

      if (error) {
        throw error
      } else {
        console.log('✅ Admin user created successfully')
        console.log('User ID:', data.user.id)
      }
    }

    console.log('\n📋 Admin Credentials:')
    console.log('Email:', adminEmail)
    console.log('Password:', adminPassword)
    console.log('\n🔗 Admin URL: http://localhost:3001/admin')
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  }
}

createAdminUser()