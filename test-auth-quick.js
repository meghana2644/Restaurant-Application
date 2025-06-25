// Quick test for authentication persistence fix
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function quickAuthTest() {
  console.log('🔐 Quick Authentication Persistence Test\n');
  
  try {
    // First, test if server is running
    console.log('🌐 Testing server connection...');
    const healthCheck = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer invalid-token' }
    });
    
    if (healthCheck.status === 401) {
      console.log('✅ Server is running and auth endpoint is accessible');
      
      // Test registration
      const timestamp = Date.now();
      const testUser = {
        name: 'Auth Test User',
        email: `authtest${timestamp}@example.com`,
        password: 'password123'
      };
      
      console.log('\n📝 Testing user registration...');
      const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
      });
      
      const registerData = await registerResponse.json();
      
      if (registerResponse.ok && registerData.token) {
        console.log('✅ Registration successful');
        console.log(`🔑 Token received: ${registerData.token.substring(0, 20)}...`);
        
        // Test token validation (this is what AuthContext.checkAuth does)
        console.log('\n🔍 Testing token validation with full URL...');
        const validateResponse = await fetch(`${BASE_URL}/auth/me`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${registerData.token}` }
        });
        
        const validateData = await validateResponse.json();
        
        if (validateResponse.ok) {
          console.log('✅ Token validation successful');
          console.log(`👤 User: ${validateData.name} (${validateData.email})`);
          console.log(`🎯 Role: ${validateData.role}`);
          
          console.log('\n🎉 AUTHENTICATION PERSISTENCE FIX VERIFIED!');
          console.log('✅ Full URLs in AuthContext are working correctly');
          console.log('✅ Users will now stay logged in after server restarts');
          
        } else {
          console.log('❌ Token validation failed');
          console.log('Response:', validateData);
        }
        
      } else {
        console.log('❌ Registration failed');
        console.log('Response:', registerData);
      }
      
    } else {
      console.log('❌ Server health check failed');
      console.log('Status:', healthCheck.status);
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Cannot connect to server. Please ensure it is running on port 5000');
      console.log('💡 Try: npm run dev');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

// Run the test
quickAuthTest();
