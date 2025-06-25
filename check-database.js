const mongoose = require('mongoose');

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/restaurant_app');
    console.log('Connected to database');
    
    // Define User schema for checking
    const userSchema = new mongoose.Schema({
      email: String,
      name: String,
      role: String,
      restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }
    });
    
    const User = mongoose.model('User', userSchema);
    
    // Check for restaurant owners
    const owners = await User.find({ role: 'restaurant_owner' });
    console.log('Found restaurant owners:', owners.length);
    
    owners.forEach(owner => {
      console.log(`- ${owner.name} (${owner.email}) - Restaurant ID: ${owner.restaurantId || 'None'}`);
    });
    
    if (owners.length === 0) {
      console.log('\n❌ No restaurant owners found in database!');
      console.log('This is likely the cause of the 500 error.');
      console.log('The restaurant creation fails because it cannot find a restaurant owner with the email provided.');
    }
    
    // Check for admin users
    const admins = await User.find({ role: 'admin' });
    console.log('\nFound admin users:', admins.length);
    
    admins.forEach(admin => {
      console.log(`- ${admin.name} (${admin.email})`);
    });
    
  } catch (error) {
    console.error('Database check failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkDatabase();
