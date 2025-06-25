// Simple verification script to check restaurant owners
import mongoose from 'mongoose';
import Restaurant from './server/models/Restaurant.js';
import User from './server/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_app';

async function verifyOwners() {
  try {
    console.log('🔍 Connecting to MongoDB to verify restaurant owners...');
    await mongoose.connect(MONGODB_URI);

    // Get all restaurants with their owners
    const restaurants = await Restaurant.find().populate('owner', 'name email role');
    
    console.log('\n📊 Restaurant Owner Verification:');
    console.log('='.repeat(50));
    
    restaurants.forEach((restaurant, index) => {
      console.log(`${index + 1}. ${restaurant.name}`);
      if (restaurant.owner) {
        console.log(`   Owner: ${restaurant.owner.name}`);
        console.log(`   Email: ${restaurant.owner.email}`);
        console.log(`   Role: ${restaurant.owner.role}`);
      } else {
        console.log(`   ❌ No owner assigned`);
      }
      console.log('');
    });

    // Count restaurant owners
    const ownerCount = await User.countDocuments({ role: 'restaurant_owner' });
    console.log(`\n📈 Total Restaurant Owners: ${ownerCount}`);
    console.log(`📈 Total Restaurants: ${restaurants.length}`);
    
    if (ownerCount === restaurants.length) {
      console.log('✅ Perfect! Each restaurant has its own owner.');
    } else {
      console.log('⚠️  Mismatch: Number of owners and restaurants don\'t match.');
    }

  } catch (error) {
    console.error('❌ Error verifying owners:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

verifyOwners();
