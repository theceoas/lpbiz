const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkFeaturedProjects() {
  try {
    console.log('Checking all content projects...\n');
    
    const { data: projects, error } = await supabase
      .from('content_projects')
      .select('*')
      .order('display_order');
    
    if (error) {
      console.error('Error fetching projects:', error);
      return;
    }
    
    console.log(`Total projects: ${projects.length}\n`);
    
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   - ID: ${project.id}`);
      console.log(`   - Category: ${project.category}`);
      console.log(`   - Featured: ${project.is_featured ? 'YES' : 'NO'}`);
      console.log(`   - Active: ${project.is_active ? 'YES' : 'NO'}`);
      console.log(`   - Display Order: ${project.display_order}`);
      console.log(`   - Has Before Image: ${project.before_image_url ? 'YES' : 'NO'}`);
      console.log(`   - Has After Image: ${project.after_image_url ? 'YES' : 'NO'}`);
      console.log('');
    });
    
    const featuredProjects = projects.filter(p => p.is_featured);
    console.log(`Featured projects: ${featuredProjects.length}`);
    featuredProjects.forEach(p => console.log(`  - ${p.title}`));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkFeaturedProjects();