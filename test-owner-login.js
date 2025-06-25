// Test restaurant owner login
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function testRestaurantOwnerLogin() {
  console.log('🏪 Testing Restaurant Owner Login');
  
  try {
    console.log('🔓 Testing restaurant owner login via regular endpoint...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'pizza@restaurant.com',
      password: 'owner123'
    }, {
      timeout: 5000
    });
    
    if (response.status === 200) {
      console.log('✅ Restaurant owner login successful!');
      console.log('User:', response.data.user);
      console.log('Role:', response.data.user.role);
      
      if (response.data.user.role === 'restaurant_owner') {
        console.log('🎉 Restaurant owner role confirmed!');
      }
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server not running');
    } else {
      console.log('❌ Error:', error.response?.data?.message || error.message);
      console.log('Status:', error.response?.status);
    }
  }
}

testRestaurantOwnerLogin();
