// Simple server connectivity test
const axios = require('axios');

async function testServerConnection() {
  console.log('🔗 Testing server connection...');
  
  try {
    const response = await axios.get('http://localhost:5000/api/restaurants', {
      timeout: 5000
    });
    console.log('✅ Server is running and responding');
    console.log(`📊 Found ${response.data.length} restaurants`);
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running on port 5000');
      console.log('💡 Please run: npm run dev');
      return false;
    } else if (error.code === 'ENOTFOUND') {
      console.log('❌ Cannot resolve localhost');
      return false;
    } else {
      console.log('❌ Server error:', error.message);
      return false;
    }
  }
}

testServerConnection();
