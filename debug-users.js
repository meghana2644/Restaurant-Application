// Debug script to check database users
import mongoose from 'mongoose';
import User from './server/models/User.js';
import { connectDB } from './server/db.js';

async function debugUsers() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Get all users
    const users = await User.find({}).select('name email role restaurantId');
    
    console.log('\n🔍 Users in database:');
    console.log('=====================');
    
    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('💡 Run: npm run seed');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   👤 Role: ${user.role}`);
        console.log(`   🏪 Restaurant ID: ${user.restaurantId || 'None'}`);
        console.log('   ---');
      });
    }
    
    // Test password for a specific user
    const testUser = await User.findOne({ email: 'pizza@restaurant.com' });
    if (testUser) {
      console.log('\n🧪 Testing pizza@restaurant.com password...');
      const isValid = await testUser.comparePassword('owner123');
      console.log(`✅ Password 'owner123' valid: ${isValid}`);
      
      // Check if password is properly hashed
      console.log(`🔐 Password hash: ${testUser.password.substring(0, 20)}...`);
    }
    
    // Test regular user
    const regularUser = await User.findOne({ role: 'user' });
    if (regularUser) {
      console.log(`\n🧪 Testing regular user: ${regularUser.email}`);
      console.log(`👤 Role: ${regularUser.role}`);
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    process.exit(1);
  }
}

debugUsers();
