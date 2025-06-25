// Script to reseed the database with individual owners for each restaurant
import mongoose from 'mongoose';
import { seedDatabase } from './server/seed.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_app';

async function reseedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🌱 Starting database reseed with individual restaurant owners...');
    await seedDatabase();
    
    console.log('🎉 Database successfully reseeded with individual owners for each restaurant!');
    console.log('\n📋 Created owners for:');
    console.log('1. Pizza Palace Owner (pizza@restaurant.com)');
    console.log('2. Sushi Master Owner (sushi@restaurant.com)');
    console.log('3. Burger Barn Owner (burger@restaurant.com)');
    console.log('4. Spice Garden Owner (spice@restaurant.com)');
    console.log('5. Dosa Delight Owner (dosa@restaurant.com)');
    console.log('6. Tandoori Nights Owner (tandoori@restaurant.com)');
    console.log('7. Street Bites Owner (street@restaurant.com)');
    console.log('8. Royal Thali Owner (royal@restaurant.com)');
    console.log('9. Dragon Palace Owner (dragon@restaurant.com)');
    console.log('10. Taco Fiesta Owner (taco@restaurant.com)');
    console.log('11. Thai Spice Owner (thai@restaurant.com)');
    console.log('\n🔑 All owners have password: "owner123"');
    
  } catch (error) {
    console.error('❌ Error reseeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📦 Database connection closed');
    process.exit(0);
  }
}

reseedDatabase();
