const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAuth() {
  console.log('Testing admin login...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@bizpilot.com',
    password: 'BizPilot2024!Admin'
  });
  
  if (error) {
    console.error('Login error:', error);
    return;
  }
  
  console.log('Login successful, testing API...');
  const token = data.session.access_token;
  console.log('Token:', token.substring(0, 20) + '...');
  
  // Test GET
  const getResponse = await fetch('http://localhost:3001/api/testimonials', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('GET response:', getResponse.status);
  const getData = await getResponse.text();
  console.log('GET data:', getData);
  
  // Test POST
  const postResponse = await fetch('http://localhost:3001/api/testimonials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Test User',
      company: 'Test Company',
      content: 'This is a test testimonial',
      rating: 5
    })
  });
  console.log('POST response:', postResponse.status);
  const postData = await postResponse.text();
  console.log('POST data:', postData);
}

testAuth().catch(console.error);