import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant-app';
    console.log('Attempting to connect to MongoDB at:', mongoURI);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('Database:', conn.connection.name);
    
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });
    
    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    console.error('Please ensure MongoDB is running and accessible');
    console.error('You can start MongoDB by running: mongod');
    throw error;
  }
};
