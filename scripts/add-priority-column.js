const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkAndAddPriorityColumn() {
  try {
    console.log('Checking if priority column exists in leads table...')
    
    // Try to select priority column to see if it exists
    const { data, error } = await supabase
      .from('leads')
      .select('priority')
      .limit(1)
    
    if (error) {
      if (error.message.includes('column "priority" does not exist')) {
        console.log('Priority column does not exist. The column needs to be added manually via Supabase dashboard.')
        console.log('Please go to Supabase dashboard > Table Editor > leads table and add a "priority" column with type VARCHAR(20) and default value "medium"')
      } else {
        console.error('Error checking priority column:', error)
      }
    } else {
      console.log('Priority column exists and is accessible!')
    }
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

checkAndAddPriorityColumn()