import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  email: 'testuser@example.com',
  password: 'password123',
  name: 'Test User'
};

const testOrder = {
  restaurantId: null, // Will be populated
  items: [
    {
      menuItemId: null, // Will be populated
      name: "Margherita Pizza",
      quantity: 2,
      price: 299,
      imageUrl: "https://example.com/pizza.jpg"
    }
  ],
  orderType: "takeout",
  deliveryAddress: {
    street: "123 Test Street",
    city: "Test City",
    state: "Test State",
    zipCode: "12345",
    phone: "1234567890"
  },
  specialInstructions: "Test order",
  subtotal: 598,
  tax: 59.8,
  total: 657.8
};

let authToken = null;

// Helper function for authenticated requests
const authAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

authAxios.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Test functions
async function testUserRegistration() {
  console.log('\n🔄 Testing user registration...');
  try {
    const response = await axios.post(`${BASE_URL}/register`, testUser);
    console.log('✅ User registration successful');
    return true;
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.message?.includes('already exists')) {
      console.log('ℹ️ User already exists, proceeding with login');
      return true;
    }
    console.error('❌ User registration failed:', error.response?.data || error.message);
    return false;
  }
}

async function testUserLogin() {
  console.log('\n🔄 Testing user login...');
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    authToken = response.data.token;
    console.log('✅ User login successful');
    console.log('Token received:', authToken ? 'Yes' : 'No');
    return true;
  } catch (error) {
    console.error('❌ User login failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetRestaurants() {
  console.log('\n🔄 Testing get restaurants...');
  try {
    const response = await axios.get(`${BASE_URL}/restaurants`);
    const restaurants = response.data;
    
    if (restaurants.length === 0) {
      console.error('❌ No restaurants found');
      return null;
    }
    
    console.log(`✅ Found ${restaurants.length} restaurants`);
    console.log('First restaurant:', restaurants[0].name);
    return restaurants[0]._id;
  } catch (error) {
    console.error('❌ Get restaurants failed:', error.response?.data || error.message);
    return null;
  }
}

async function testGetMenuItems(restaurantId) {
  console.log('\n🔄 Testing get menu items...');
  try {
    const response = await axios.get(`${BASE_URL}/restaurants/${restaurantId}/menu-items`);
    const menuItems = response.data;
    
    if (menuItems.length === 0) {
      console.error('❌ No menu items found');
      return null;
    }
    
    console.log(`✅ Found ${menuItems.length} menu items`);
    console.log('First menu item:', menuItems[0].name);
    return menuItems[0]._id;
  } catch (error) {
    console.error('❌ Get menu items failed:', error.response?.data || error.message);
    return null;
  }
}

async function testCreateOrder(restaurantId, menuItemId) {
  console.log('\n🔄 Testing order creation...');
  
  // Update test order with actual IDs
  testOrder.restaurantId = restaurantId;
  testOrder.items[0].menuItemId = menuItemId;
  
  console.log('Order data being sent:');
  console.log(JSON.stringify(testOrder, null, 2));
  
  try {
    const response = await authAxios.post('/orders', testOrder);
    console.log('✅ Order creation successful');
    console.log('Order ID:', response.data._id);
    console.log('Order status:', response.data.status);
    return response.data;
  } catch (error) {
    console.error('❌ Order creation failed');
    console.error('Status:', error.response?.status);
    console.error('Error message:', error.response?.data?.error || error.message);
    console.error('Full error response:', error.response?.data);
    return null;
  }
}

async function testGetUserOrders() {
  console.log('\n🔄 Testing get user orders...');
  try {
    const response = await authAxios.get('/orders');
    console.log(`✅ Retrieved ${response.data.length} orders`);
    return response.data;
  } catch (error) {
    console.error('❌ Get orders failed:', error.response?.data || error.message);
    return null;
  }
}

// Main test function
async function runOrderFlowTest() {
  console.log('🚀 Starting Order Flow Test');
  console.log('=====================================');
  
  try {
    // Step 1: Register user
    const registrationSuccess = await testUserRegistration();
    if (!registrationSuccess) return;
    
    // Step 2: Login user
    const loginSuccess = await testUserLogin();
    if (!loginSuccess) return;
    
    // Step 3: Get restaurants
    const restaurantId = await testGetRestaurants();
    if (!restaurantId) return;
    
    // Step 4: Get menu items
    const menuItemId = await testGetMenuItems(restaurantId);
    if (!menuItemId) return;
    
    // Step 5: Create order
    const order = await testCreateOrder(restaurantId, menuItemId);
    if (!order) return;
    
    // Step 6: Get user orders
    const orders = await testGetUserOrders();
    
    console.log('\n🎉 Order flow test completed successfully!');
    console.log('=====================================');
    
  } catch (error) {
    console.error('\n💥 Unexpected error during test:', error);
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

// Run the test
runOrderFlowTest().catch(console.error);
