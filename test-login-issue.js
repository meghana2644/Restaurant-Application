// Test login issue directly
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function testLogin() {
  try {
    console.log('🔓 Testing direct login...');
    
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'pizza@restaurant.com',
      password: 'owner123'
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

// Test with a regular user - let's create one first
async function testUserRegistrationAndLogin() {
  try {
    const timestamp = Date.now();
    const testUser = {
      name: 'Test User',
      email: `testuser${timestamp}@example.com`,
      password: 'password123'
    };
    
    console.log('\n📝 Testing user registration first...');
    
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ Registration successful!');
    
    console.log('\n🔓 Now testing login with same credentials...');
    
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    console.log('✅ Login successful!');
    console.log('Login response:', loginResponse.data);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

async function runTests() {
  console.log('🧪 Testing login functionality...\n');
  
  // Test with restaurant owner
  await testLogin();
  
  // Test with a new regular user
  await testUserRegistrationAndLogin();
}

// Handle connection errors
process.on('unhandledRejection', (error) => {
  if (error.code === 'ECONNREFUSED') {
    console.error('❌ Connection refused. Make sure the server is running on port 5000');
  } else {
    console.error('Unhandled error:', error);
  }
  process.exit(1);
});

runTests().catch(console.error);
