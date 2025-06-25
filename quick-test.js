// Quick login test
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function quickTest() {
  console.log('🧪 Quick Login Test');
  
  try {
    // Test regular user registration first
    const timestamp = Date.now();
    const testUser = {
      name: 'Test User',
      email: `testuser${timestamp}@example.com`,
      password: 'password123'
    };
    
    console.log('📝 Registering user...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser, {
      timeout: 5000
    });
    
    if (registerResponse.status === 200) {
      console.log('✅ Registration successful');
      
      console.log('🔓 Testing login...');
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      }, {
        timeout: 5000
      });
      
      if (loginResponse.status === 200) {
        console.log('✅ Login successful! The fix worked!');
        console.log('User:', loginResponse.data.user);
      } else {
        console.log('❌ Login failed:', loginResponse.status);
      }
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server not running');
    } else {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }
  }
}

quickTest();
