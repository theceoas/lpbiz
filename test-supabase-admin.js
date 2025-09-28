const { updateContentProject } = require('./src/lib/content-projects.ts');

async function testUpdate() {
  try {
    console.log('Testing updateContentProject function...');
    const result = await updateContentProject('4a12689d-e2bc-493c-8089-aa93f6686faf', { title: 'Test from lib' });
    console.log('Update result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testUpdate();