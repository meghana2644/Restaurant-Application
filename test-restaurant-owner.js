// Test Restaurant Owner API endpoints
const testRestaurantOwner = async () => {
  const API_BASE = 'http://localhost:5000/api';
  
  console.log('🧪 Testing Restaurant Owner Functionality...\n');
  
  try {
    // Step 1: Login as restaurant owner
    console.log('1️⃣ Testing restaurant owner login...');
    const loginResponse = await fetch(`${API_BASE}/restaurant-owner/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'pizza@restaurant.com',
        password: 'owner123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login Response:', {
      success: loginResponse.ok,
      hasToken: !!loginData.token,
      userRole: loginData.user?.role,
      restaurantId: loginData.user?.restaurantId
    });
    
    if (!loginResponse.ok) {
      console.error('❌ Login failed:', loginData);
      return;
    }
    
    const token = loginData.token;
    const authHeaders = { 'Authorization': `Bearer ${token}` };
    
    // Step 2: Test auth/me endpoint
    console.log('\n2️⃣ Testing token validation...');
    const meResponse = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders });
    const meData = await meResponse.json();
    console.log('✅ Auth/Me Response:', {
      success: meResponse.ok,
      role: meData.role,
      hasRestaurantId: !!meData.restaurantId
    });
    
    // Step 3: Test dashboard endpoint
    console.log('\n3️⃣ Testing dashboard endpoint...');
    const dashboardResponse = await fetch(`${API_BASE}/restaurant-owner/dashboard`, { headers: authHeaders });
    const dashboardData = await dashboardResponse.json();
    console.log('✅ Dashboard Response:', {
      success: dashboardResponse.ok,
      hasRestaurant: !!dashboardData.restaurant,
      totalOrders: dashboardData.totalOrders,
      totalRevenue: dashboardData.totalRevenue
    });
    
    // Step 4: Test menu items endpoint
    console.log('\n4️⃣ Testing menu items endpoint...');
    const menuResponse = await fetch(`${API_BASE}/restaurant-owner/menu-items`, { headers: authHeaders });
    const menuData = await menuResponse.json();
    console.log('✅ Menu Items Response:', {
      success: menuResponse.ok,
      itemCount: Array.isArray(menuData) ? menuData.length : 0,
      items: Array.isArray(menuData) ? menuData.slice(0, 3).map(item => item.name) : 'Not an array'
    });
    
    // Step 5: Test orders endpoint
    console.log('\n5️⃣ Testing orders endpoint...');
    const ordersResponse = await fetch(`${API_BASE}/restaurant-owner/orders`, { headers: authHeaders });
    const ordersData = await ordersResponse.json();
    console.log('✅ Orders Response:', {
      success: ordersResponse.ok,
      orderCount: Array.isArray(ordersData) ? ordersData.length : 0,
      orders: Array.isArray(ordersData) ? ordersData.slice(0, 3).map(order => ({
        id: order._id,
        status: order.status,
        total: order.totalAmount
      })) : 'Not an array'
    });
    
    // Step 6: Test adding a menu item
    console.log('\n6️⃣ Testing add menu item...');
    const addItemResponse = await fetch(`${API_BASE}/restaurant-owner/menu-items`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeaders 
      },
      body: JSON.stringify({
        name: 'Test Pizza Special',
        description: 'A test pizza item',
        price: 15.99,
        category: 'pizza',
        isVegetarian: false
      })
    });
    
    const addItemData = await addItemResponse.json();
    console.log('✅ Add Menu Item Response:', {
      success: addItemResponse.ok,
      itemName: addItemData.name,
      itemPrice: addItemData.price,
      restaurantId: addItemData.restaurantId
    });
    
    console.log('\n🎉 Restaurant Owner API Test Complete!');
    
  } catch (error) {
    console.error('💥 Test Error:', error.message);
  }
};

// Run the test
testRestaurantOwner();
