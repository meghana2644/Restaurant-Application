import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Test admin login
async function testAdminLogin() {
  try {
    console.log('🔐 Testing admin login...');
    
    const response = await axios.post(`${BASE_URL}/admin/login`, {
      email: 'admin@restaurant.com',
      password: 'admin123'
    });
    
    console.log('✅ Admin login successful!');
    console.log('Token received:', response.data.token ? 'Yes' : 'No');
    console.log('User data:', response.data.user);
    
    return response.data.token;
  } catch (error) {
    console.error('❌ Admin login failed:', error.response?.data || error.message);
    return null;
  }
}

// Test admin profile access
async function testAdminProfile(token) {
  try {
    console.log('\n👤 Testing admin profile access...');
    
    const response = await axios.get(`${BASE_URL}/admin/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Admin profile access successful!');
    console.log('Profile data:', response.data);
    
    return true;
  } catch (error) {
    console.error('❌ Admin profile access failed:', error.response?.data || error.message);
    return false;
  }
}

// Test restaurant creation
async function testRestaurantCreation(token) {
  try {
    console.log('\n🏪 Testing restaurant creation...');
    
    const restaurantData = {
      name: "Test Restaurant",
      description: "A test restaurant created by admin",
      imageUrl: "https://example.com/image.jpg",
      bannerUrl: "https://example.com/banner.jpg",
      address: {
        street: "123 Test Street",
        city: "Test City",
        state: "Test State",
        zipCode: "12345",
        country: "Test Country"
      },
      priceLevel: 2,
      cuisine: ["Test Cuisine"],
      distance: 1.5,
      deliveryTime: "30-45 min",
      freeDelivery: true,
      latitude: 12.9716,
      longitude: 77.5946,
      openingHours: {
        monday: { open: "09:00", close: "22:00" },
        tuesday: { open: "09:00", close: "22:00" },
        wednesday: { open: "09:00", close: "22:00" },
        thursday: { open: "09:00", close: "22:00" },
        friday: { open: "09:00", close: "22:00" },
        saturday: { open: "09:00", close: "22:00" },
        sunday: { open: "09:00", close: "22:00" }
      },
      ownerEmail: "owner@restaurant.com" // This should exist from seed data
    };
    
    const response = await axios.post(`${BASE_URL}/admin/restaurants`, restaurantData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Restaurant creation successful!');
    console.log('Restaurant created:', response.data.restaurant.name);
    console.log('Restaurant ID:', response.data.restaurant._id);
    
    return response.data.restaurant._id;
  } catch (error) {
    console.error('❌ Restaurant creation failed:', error.response?.data || error.message);
    return null;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Admin API Tests...\n');
  
  // Test 1: Admin Login
  const token = await testAdminLogin();
  if (!token) {
    console.log('\n❌ Cannot proceed with other tests without valid token');
    return;
  }
  
  // Test 2: Admin Profile
  const profileSuccess = await testAdminProfile(token);
  
  // Test 3: Restaurant Creation
  const restaurantId = await testRestaurantCreation(token);
  
  console.log('\n📊 Test Summary:');
  console.log(`Admin Login: ${token ? '✅' : '❌'}`);
  console.log(`Admin Profile: ${profileSuccess ? '✅' : '❌'}`);
  console.log(`Restaurant Creation: ${restaurantId ? '✅' : '❌'}`);
  
  if (token && profileSuccess && restaurantId) {
    console.log('\n🎉 All admin functionality tests passed!');
  } else {
    console.log('\n⚠️ Some tests failed. Check the logs above for details.');
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
runTests().catch(console.error);
