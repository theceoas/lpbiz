require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  try {
    // Check if before_after_images table exists
    const { data: beforeAfterData, error: beforeAfterError } = await supabase
      .from('before_after_images')
      .select('*')
      .limit(1);
    
    console.log('before_after_images table exists:', !beforeAfterError);
    if (beforeAfterError) console.log('before_after_images error:', beforeAfterError.message);
    
    // Check if content_projects table exists
    const { data: contentData, error: contentError } = await supabase
      .from('content_projects')
      .select('*')
      .limit(1);
    
    console.log('content_projects table exists:', !contentError);
    if (contentError) console.log('content_projects error:', contentError.message);
    
  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

checkTables();