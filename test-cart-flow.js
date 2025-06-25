import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

async function testCartFlow() {
  try {
    console.log('🧪 Testing Cart Flow...');
    
    // Step 1: Test if server is running
    console.log('\n1️⃣ Testing server connection...');
    try {
      const response = await axios.get(`${BASE_URL}/restaurants`);
      console.log('✅ Server is running, found', response.data.length, 'restaurants');
    } catch (error) {
      console.log('❌ Server is not running or not responding:', error.message);
      return;
    }
    
    // Step 2: Register a test user
    console.log('\n2️⃣ Creating test user...');
    const testUser = {
      name: 'Test User',
      email: `testuser${Date.now()}@example.com`,
      password: 'password123'
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    const { token } = registerResponse.data;
    console.log('✅ User registered successfully');
    
    // Step 3: Get restaurants
    console.log('\n3️⃣ Getting restaurants...');
    const restaurantsResponse = await axios.get(`${BASE_URL}/restaurants`);
    const restaurants = restaurantsResponse.data;
    
    if (restaurants.length === 0) {
      console.log('❌ No restaurants found');
      return;
    }
    
    const restaurant = restaurants[0];
    console.log('✅ Found restaurant:', restaurant.name);
    
    // Step 4: Get menu items
    console.log('\n4️⃣ Getting menu items...');
    const menuResponse = await axios.get(`${BASE_URL}/restaurants/${restaurant._id}/menu-items`);
    const menuItems = menuResponse.data;
    
    if (menuItems.length === 0) {
      console.log('❌ No menu items found');
      return;
    }
    
    const menuItem = menuItems[0];
    console.log('✅ Found menu item:', menuItem.name);
    
    // Step 5: Add item to cart
    console.log('\n5️⃣ Adding item to cart...');
    const cartResponse = await axios.post(`${BASE_URL}/cart`, {
      menuItemId: menuItem._id,
      quantity: 1
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Item added to cart:', cartResponse.data);
    
    // Step 6: Get cart
    console.log('\n6️⃣ Getting cart...');
    const getCartResponse = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Cart contents:', JSON.stringify(getCartResponse.data, null, 2));
    
    // Step 7: Test order creation
    console.log('\n7️⃣ Testing order creation...');
    const orderData = {
      restaurantId: restaurant._id,
      items: [{
        menuItemId: menuItem._id,
        name: menuItem.name,
        quantity: 1,
        price: menuItem.price
      }],
      deliveryType: 'takeout',
      deliveryAddress: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        phone: '1234567890'
      },
      specialInstructions: 'Test order',
      subtotal: menuItem.price,
      tax: menuItem.price * 0.1,
      total: menuItem.price * 1.1
    };
    
    console.log('Order data being sent:', JSON.stringify(orderData, null, 2));
    
    const orderResponse = await axios.post(`${BASE_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Order created successfully:', orderResponse.data);
    
    console.log('\n🎉 Cart flow test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during cart flow test:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

testCartFlow();
