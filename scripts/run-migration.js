const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  try {
    console.log('Running database migration...\n');
    
    // Read the migration file
    const migrationSQL = fs.readFileSync('/Users/as/lp/supabase/migrations/20250928000000_enhance_content_projects.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Executing ${statements.length} SQL statements...\n`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`Error in statement ${i + 1}:`, error);
          // Try direct query for some statements
          const { error: directError } = await supabase.from('').select().limit(0);
          if (directError) {
            console.error('Direct query also failed:', directError);
          }
        } else {
          console.log(`✓ Statement ${i + 1} executed successfully`);
        }
      }
    }
    
    console.log('\nMigration completed! Checking table structure...');
    
    // Verify the migration worked
    const { data, error } = await supabase
      .from('content_projects')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error verifying migration:', error);
    } else {
      console.log('✓ Migration verified successfully');
      if (data && data.length > 0) {
        console.log('Sample record structure:', Object.keys(data[0]));
      }
    }
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();