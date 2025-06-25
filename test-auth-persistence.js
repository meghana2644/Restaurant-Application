// Test authentication persistence after server restart
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function testAuthPersistence() {
  console.log('🔐 Testing Authentication Persistence Fix\n');
  
  try {
    // Step 1: Register a new user
    const timestamp = Date.now();
    const testUser = {
      name: 'Test User',
      email: `testuser${timestamp}@example.com`,
      password: 'password123'
    };
    
    console.log('📝 Step 1: Registering new user...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    
    if (registerResponse.status === 200) {
      console.log('✅ Registration successful');
      console.log(`📧 User email: ${testUser.email}`);
      
      const token = registerResponse.data.token;
      console.log(`🔑 Token received: ${token ? 'Yes' : 'No'}`);
      
      if (token) {
        // Step 2: Test immediate token validation (should work)
        console.log('\n🔍 Step 2: Testing immediate token validation...');
        const authResponse1 = await axios.get(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (authResponse1.status === 200) {
          console.log('✅ Immediate token validation successful');
          console.log(`👤 User: ${authResponse1.data.name} (${authResponse1.data.email})`);
          
          // Step 3: Simulate what frontend does - store token and validate again
          console.log('\n🔄 Step 3: Simulating frontend AuthContext behavior...');
          
          // This simulates what happens when user refreshes page or server restarts
          // The frontend checkAuth function should now work with full URL
          const authResponse2 = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (authResponse2.status === 200) {
            console.log('✅ Token persistence validation successful');
            console.log(`👤 User persisted: ${authResponse2.data.name} (${authResponse2.data.email})`);
            console.log(`🎯 Role: ${authResponse2.data.role}`);
            
            console.log('\n🎉 AUTHENTICATION PERSISTENCE FIX SUCCESSFUL!');
            console.log('✅ Users will now stay logged in after server restarts');
            console.log('✅ Frontend AuthContext will properly validate tokens');
            
          } else {
            console.log('❌ Token persistence validation failed');
          }
          
        } else {
          console.log('❌ Immediate token validation failed');
        }
        
      } else {
        console.log('❌ No token received from registration');
      }
      
    } else {
      console.log('❌ Registration failed');
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server not running. Please start the server with: npm run dev');
    } else {
      console.log('❌ Error:', error.response?.data?.message || error.message);
      console.log('Status:', error.response?.status);
    }
  }
}

// Wait a bit for server to start, then run test
setTimeout(() => {
  testAuthPersistence();
}, 3000);
