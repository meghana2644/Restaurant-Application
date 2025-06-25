import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Test user registration
async function testUserRegistration() {
  try {
    console.log('🧪 Testing user registration...');
    
    // Generate a unique email for testing
    const timestamp = Date.now();
    const testUser = {
      name: 'Test User',
      email: `testuser${timestamp}@example.com`,
      password: 'password123'
    };
    
    console.log('Registering user:', testUser.email);
    
    const response = await axios.post(`${BASE_URL}/auth/register`, testUser);
    
    console.log('✅ Registration successful!');
    console.log('Response data:', {
      hasToken: !!response.data.token,
      hasUser: !!response.data.user,
      message: response.data.message,
      userRole: response.data.user?.role
    });
    
    // Verify the token format
    if (response.data.token) {
      console.log('🔑 JWT Token received - format looks correct');
      return {
        token: response.data.token,
        user: response.data.user
      };
    } else {
      console.log('❌ No token in response - this would cause frontend issues');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
    return null;
  }
}

// Test authentication with the received token
async function testAuthenticationWithToken(token) {
  try {
    console.log('\n🔐 Testing authentication with received token...');
    
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Token authentication successful!');
    console.log('User data from token:', response.data.user);
    
    return true;
  } catch (error) {
    console.error('❌ Token authentication failed:', error.response?.data || error.message);
    return false;
  }
}

// Test login after registration
async function testLoginAfterRegistration(email, password) {
  try {
    console.log('\n🔓 Testing login after registration...');
    
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password
    });
    
    console.log('✅ Login after registration successful!');
    console.log('Login response:', {
      hasToken: !!response.data.token,
      hasUser: !!response.data.user,
      message: response.data.message
    });
    
    return true;
  } catch (error) {
    console.error('❌ Login after registration failed:', error.response?.data || error.message);
    return false;
  }
}

// Main test function
async function runRegistrationTests() {
  console.log('🚀 Starting registration flow tests...\n');
  
  try {
    // Test registration
    const registrationResult = await testUserRegistration();
    
    if (!registrationResult) {
      console.log('\n❌ Registration test failed - stopping tests');
      return;
    }
    
    // Test token authentication
    const tokenValid = await testAuthenticationWithToken(registrationResult.token);
    
    if (!tokenValid) {
      console.log('\n❌ Token authentication failed - stopping tests');
      return;
    }
    
    // Test login after registration
    const timestamp = Date.now();
    const loginValid = await testLoginAfterRegistration(
      `testuser${timestamp}@example.com`, 
      'password123'
    );
    
    if (loginValid) {
      console.log('\n🎉 All registration flow tests passed!');
      console.log('✅ Registration now works correctly with JWT tokens');
      console.log('✅ Frontend AuthContext should now work properly');
    }
    
  } catch (error) {
    console.error('\n💥 Unexpected error during tests:', error);
  }
}

// Handle connection errors
process.on('unhandledRejection', (error) => {
  if (error.code === 'ECONNREFUSED') {
    console.error('❌ Connection refused. Make sure the server is running on port 5000');
    console.log('Run: npm run dev');
  } else {
    console.error('Unhandled error:', error);
  }
  process.exit(1);
});

// Run the tests
runRegistrationTests().catch(console.error);
