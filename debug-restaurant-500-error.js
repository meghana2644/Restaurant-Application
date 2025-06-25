// Debug script to test restaurant creation and identify the 500 error
import mongoose from 'mongoose';
import Restaurant from './server/models/Restaurant.js';
import User from './server/models/User.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/restaurant-app');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const testRestaurantCreation = async () => {
  await connectDB();

  // Sample restaurant data (what our form would send)
  const restaurantData = {
    name: 'Test Pizza Palace',
    description: 'Authentic Italian pizza with fresh ingredients',
    imageUrl: 'https://example.com/pizza-image.jpg',
    bannerUrl: 'https://example.com/pizza-banner.jpg',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    priceLevel: 2,
    cuisine: ['Italian', 'Pizza'],
    distance: 0,
    deliveryTime: '30-45 min',
    freeDelivery: false,
    latitude: 40.7128,
    longitude: -74.0060,
    openingHours: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '22:00' },
      saturday: { open: '09:00', close: '22:00' },
      sunday: { open: '09:00', close: '22:00' }
    },
    ownerEmail: 'owner@example.com'
  };

  try {
    console.log('🔍 Testing restaurant creation with data:');
    console.log(JSON.stringify(restaurantData, null, 2));

    // First, find or create a restaurant owner
    let owner = await User.findOne({ email: restaurantData.ownerEmail, role: 'restaurant_owner' });
    
    if (!owner) {
      console.log('❌ Owner not found, creating one...');
      owner = new User({
        name: 'Test Owner',
        email: restaurantData.ownerEmail,
        password: 'hashedpassword123',
        role: 'restaurant_owner'
      });
      await owner.save();
      console.log('✅ Created test owner:', owner._id);
    } else {
      console.log('✅ Found existing owner:', owner._id);
    }

    // Remove ownerEmail from restaurant data and add owner ID
    const { ownerEmail, ...restaurantPayload } = restaurantData;
    restaurantPayload.owner = owner._id;

    console.log('🔍 Final restaurant payload:');
    console.log(JSON.stringify(restaurantPayload, null, 2));

    // Try to create restaurant
    const restaurant = new Restaurant(restaurantPayload);
    await restaurant.save();

    console.log('✅ Restaurant created successfully!');
    console.log('Restaurant ID:', restaurant._id);

  } catch (error) {
    console.error('❌ Restaurant creation error:');
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    
    if (error.name === 'ValidationError') {
      console.error('Validation errors:');
      Object.keys(error.errors).forEach(field => {
        console.error(`  - ${field}: ${error.errors[field].message}`);
      });
    }
    
    console.error('Full error:', error);
  }

  // Close connection
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
};

testRestaurantCreation().catch(console.error);
