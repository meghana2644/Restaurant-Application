// Complete End-to-End Test
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function completeE2ETest() {
  console.log('🔄 Complete End-to-End Test');
  console.log('================================');
  
  let userToken = null;
  let ownerToken = null;
  let orderId = null;
  
  try {
    // Step 1: Register a new user
    console.log('\n📝 Step 1: User Registration');
    const timestamp = Date.now();
    const testUser = {
      name: 'Test Customer',
      email: `customer${timestamp}@example.com`,
      password: 'password123'
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ User registered successfully');
    userToken = registerResponse.data.token;
    
    // Step 2: User login
    console.log('\n🔓 Step 2: User Login');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ User login successful');
    userToken = loginResponse.data.token;
    
    // Step 3: Get restaurants
    console.log('\n🏪 Step 3: Get Restaurants');
    const restaurantsResponse = await axios.get(`${BASE_URL}/restaurants`);
    console.log(`✅ Found ${restaurantsResponse.data.length} restaurants`);
    
    if (restaurantsResponse.data.length === 0) {
      console.log('❌ No restaurants found - run seed data');
      return;
    }
    
    const restaurant = restaurantsResponse.data[0];
    console.log(`📍 Testing with: ${restaurant.name}`);
    
    // Step 4: Get restaurant menu
    console.log('\n🍽️ Step 4: Get Restaurant Menu');
    const menuResponse = await axios.get(`${BASE_URL}/restaurants/${restaurant._id}`);
    console.log(`✅ Menu loaded with ${menuResponse.data.menuItems?.length || 0} items`);
    
    // Step 5: Place an order (if menu items exist)
    if (menuResponse.data.menuItems && menuResponse.data.menuItems.length > 0) {
      console.log('\n🛒 Step 5: Place Order');
      const menuItem = menuResponse.data.menuItems[0];
      
      const orderData = {
        restaurantId: restaurant._id,
        items: [{
          menuItem: menuItem._id,
          quantity: 2,
          price: menuItem.price
        }],
        deliveryAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country'
        },
        totalAmount: menuItem.price * 2
      };
      
      const orderResponse = await axios.post(`${BASE_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log('✅ Order placed successfully');
      orderId = orderResponse.data._id;
      console.log(`📋 Order ID: ${orderId}`);
    }
    
    // Step 6: Restaurant owner login
    console.log('\n🏪 Step 6: Restaurant Owner Login');
    const ownerLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'pizza@restaurant.com',
      password: 'owner123'
    });
    console.log('✅ Restaurant owner login successful');
    ownerToken = ownerLoginResponse.data.token;
    
    // Step 7: Restaurant owner gets orders
    console.log('\n📋 Step 7: Restaurant Owner Gets Orders');
    const ordersResponse = await axios.get(`${BASE_URL}/restaurant-owner/orders`, {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    console.log(`✅ Found ${ordersResponse.data.length} orders for restaurant owner`);
    
    // Step 8: Update order status (if orders exist)
    if (ordersResponse.data.length > 0) {
      console.log('\n🔄 Step 8: Update Order Status');
      const orderToUpdate = ordersResponse.data[0];
      
      const updateResponse = await axios.put(
        `${BASE_URL}/restaurant-owner/orders/${orderToUpdate._id}/status`,
        { status: 'confirmed' },
        { headers: { Authorization: `Bearer ${ownerToken}` } }
      );
      console.log('✅ Order status updated successfully');
    }
    
    console.log('\n🎉 ALL TESTS PASSED! The application is working correctly.');
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.response?.data?.message || error.message);
    console.log('Status:', error.response?.status);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running: npm run dev');
    }
  }
}

completeE2ETest();
