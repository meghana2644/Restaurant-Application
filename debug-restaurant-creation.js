const axios = require('axios');

async function testRestaurantCreation() {
  try {
    console.log('Testing restaurant creation...');
    
    // First, login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/admin/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Admin login successful, token:', token.substring(0, 20) + '...');
    
    // Test restaurant data that should work
    const restaurantData = {
      name: "Test Pizza Palace",
      description: "Authentic Italian pizza with fresh ingredients",
      imageUrl: "https://example.com/pizza-image.jpg",
      bannerUrl: "https://example.com/pizza-banner.jpg",
      address: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      priceLevel: 2,
      cuisine: ["Italian", "Pizza"],
      distance: 1.5,
      deliveryTime: "30-45 min",
      freeDelivery: false,
      latitude: 40.7128,
      longitude: -74.0060,
      openingHours: {
        monday: { open: "09:00", close: "22:00" },
        tuesday: { open: "09:00", close: "22:00" },
        wednesday: { open: "09:00", close: "22:00" },
        thursday: { open: "09:00", close: "22:00" },
        friday: { open: "09:00", close: "22:00" },
        saturday: { open: "09:00", close: "22:00" },
        sunday: { open: "09:00", close: "22:00" }
      },
      ownerEmail: "owner@restaurant.com",
      reviewCount: 0,
      rating: 0
    };
    
    console.log('Sending restaurant data:', JSON.stringify(restaurantData, null, 2));
    
    const response = await axios.post('http://localhost:5000/api/admin/restaurants', 
      restaurantData,
      { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    console.log('✅ Restaurant creation successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Restaurant creation failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
    console.error('Error details:', error.response?.data?.error);
    console.error('Stack:', error.response?.data?.stack);
    
    if (error.response?.data?.errors) {
      console.error('Validation errors:', error.response.data.errors);
    }
  }
}

testRestaurantCreation();
