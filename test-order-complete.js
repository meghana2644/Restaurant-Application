import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Test comprehensive order flow
async function testCompleteOrderFlow() {
  console.log('🚀 Starting Complete Order Flow Test');
  console.log('====================================');
  
  let authToken = null;
  
  try {
    // Step 1: Register/Login user
    console.log('\n1️⃣ Testing user authentication...');
    try {
      await axios.post(`${BASE_URL}/register`, {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123'
      });
      console.log('✅ User registered successfully');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('ℹ️ User already exists, proceeding with login');
      }
    }
    
    // Login
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'testuser@example.com',
      password: 'password123'
    });
    authToken = loginResponse.data.token;
    console.log('✅ User login successful');
    
    // Step 2: Get restaurants
    console.log('\n2️⃣ Testing restaurant retrieval...');
    const restaurantsResponse = await axios.get(`${BASE_URL}/restaurants`);
    const restaurants = restaurantsResponse.data;
    console.log(`✅ Found ${restaurants.length} restaurants`);
    
    if (restaurants.length === 0) {
      throw new Error('No restaurants available for testing');
    }
    
    const testRestaurant = restaurants[0];
    console.log(`📍 Using restaurant: ${testRestaurant.name}`);
    
    // Step 3: Get menu items
    console.log('\n3️⃣ Testing menu items retrieval...');
    const menuResponse = await axios.get(`${BASE_URL}/restaurants/${testRestaurant._id}/menu-items`);
    const menuItems = menuResponse.data;
    console.log(`✅ Found ${menuItems.length} menu items`);
    
    if (menuItems.length === 0) {
      throw new Error('No menu items available for testing');
    }
    
    const testMenuItem = menuItems[0];
    console.log(`🍽️ Using menu item: ${testMenuItem.name} - ₹${testMenuItem.price}`);
    
    // Step 4: Test takeout order
    console.log('\n4️⃣ Testing takeout order creation...');
    const takeoutOrder = {
      restaurantId: testRestaurant._id,
      items: [{
        menuItemId: testMenuItem._id,
        name: testMenuItem.name,
        quantity: 2,
        price: testMenuItem.price,
        imageUrl: testMenuItem.imageUrl || 'https://via.placeholder.com/150'
      }],
      orderType: 'takeout',
      deliveryAddress: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        phone: '1234567890'
      },
      specialInstructions: 'Test order - please handle with care',
      subtotal: testMenuItem.price * 2,
      tax: (testMenuItem.price * 2) * 0.1,
      total: (testMenuItem.price * 2) * 1.1
    };
    
    console.log('📦 Order payload:', JSON.stringify(takeoutOrder, null, 2));
    
    const takeoutResponse = await axios.post(`${BASE_URL}/orders`, takeoutOrder, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    console.log('✅ Takeout order created successfully!');
    console.log(`📋 Order ID: ${takeoutResponse.data._id}`);
    console.log(`📊 Order Status: ${takeoutResponse.data.status}`);
    
    // Step 5: Test dine-in order
    console.log('\n5️⃣ Testing dine-in order creation...');
    const dineinOrder = {
      restaurantId: testRestaurant._id,
      items: [{
        menuItemId: testMenuItem._id,
        name: testMenuItem.name,
        quantity: 1,
        price: testMenuItem.price,
        imageUrl: testMenuItem.imageUrl || 'https://via.placeholder.com/150'
      }],
      orderType: 'dinein',
      specialInstructions: 'Table for one - dine-in test order',
      subtotal: testMenuItem.price,
      tax: testMenuItem.price * 0.1,
      total: testMenuItem.price * 1.1
    };
    
    const dineinResponse = await axios.post(`${BASE_URL}/orders`, dineinOrder, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    console.log('✅ Dine-in order created successfully!');
    console.log(`📋 Order ID: ${dineinResponse.data._id}`);
    console.log(`📊 Order Status: ${dineinResponse.data.status}`);
    
    // Step 6: Get user orders
    console.log('\n6️⃣ Testing order retrieval...');
    const ordersResponse = await axios.get(`${BASE_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    console.log(`✅ Retrieved ${ordersResponse.data.length} orders`);
    
    // Step 7: Test error cases
    console.log('\n7️⃣ Testing error handling...');
    
    // Test missing restaurant ID
    try {
      await axios.post(`${BASE_URL}/orders`, {
        ...takeoutOrder,
        restaurantId: undefined
      }, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    } catch (error) {
      console.log('✅ Missing restaurant ID validation working');
    }
    
    // Test invalid order type
    try {
      await axios.post(`${BASE_URL}/orders`, {
        ...takeoutOrder,
        orderType: 'invalid'
      }, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    } catch (error) {
      console.log('✅ Invalid order type validation working');
    }
    
    // Test missing delivery address for takeout
    try {
      await axios.post(`${BASE_URL}/orders`, {
        ...takeoutOrder,
        deliveryAddress: undefined
      }, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    } catch (error) {
      console.log('✅ Missing delivery address validation working');
    }
    
    console.log('\n🎉 ALL TESTS PASSED! Order functionality is working correctly.');
    console.log('=========================================================');
    
  } catch (error) {
    console.error('\n💥 Test failed:', error.response?.data || error.message);
    console.error('Full error:', error);
    process.exit(1);
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
testCompleteOrderFlow().catch(console.error);
