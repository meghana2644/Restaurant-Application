import express from 'express';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin: Add new restaurant
router.post('/restaurants', isAdmin, async (req, res) => {
  try {
    // Validate input using zod
    const restaurantSchema = z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      imageUrl: z.string().url(),
      bannerUrl: z.string().url(),
      address: z.object({
        street: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        zipCode: z.string().min(1),
        country: z.string().min(1),
      }),
      priceLevel: z.number().int().min(1).max(5),
      cuisine: z.array(z.string()),
      distance: z.number(),
      deliveryTime: z.string(),
      freeDelivery: z.boolean(),
      latitude: z.number(),
      longitude: z.number(),
      rating: z.number().optional().default(0),
      reviewCount: z.number().optional().default(0),
      openingHours: z.object({
        monday: z.object({ open: z.string(), close: z.string() }),
        tuesday: z.object({ open: z.string(), close: z.string() }),
        wednesday: z.object({ open: z.string(), close: z.string() }),
        thursday: z.object({ open: z.string(), close: z.string() }),
        friday: z.object({ open: z.string(), close: z.string() }),
        saturday: z.object({ open: z.string(), close: z.string() }),
        sunday: z.object({ open: z.string(), close: z.string() }),
      }),
      ownerEmail: z.string().email().optional(),
      createNewOwner: z.boolean().optional(),
      ownerPassword: z.string().optional()
    });

    const data = restaurantSchema.parse(req.body);

    let owner;
    if (data.createNewOwner) {
      // Create new owner
      owner = new User({
        email: data.ownerEmail,
        password: data.ownerPassword,
        name: data.name + ' Owner',
        role: 'restaurant_owner'
      });
      await owner.save();
    } else {
      // Find existing owner
      owner = await User.findOne({ email: data.ownerEmail, role: 'restaurant_owner' });
      if (!owner) {
        return res.status(404).json({ message: 'Restaurant owner not found' });
      }
    }

    // Create the restaurant
    const restaurant = new Restaurant({
      ...data,
      owner: owner._id,
      reviewCount: data.reviewCount || 0,
      rating: data.rating || 0,
    });
    await restaurant.save();

    // Assign restaurantId to owner
    owner.restaurantId = restaurant._id;
    await owner.save();

    res.status(201).json({ message: 'Restaurant created and owner assigned', restaurant });
  } catch (error) {
    console.error('Restaurant creation error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
});

// Admin: Assign owner to existing restaurant
router.post('/restaurants/:id/owner', isAdmin, async (req, res) => {
  try {
    const { ownerEmail } = req.body;
    // Find the owner
    const owner = await User.findOne({ email: ownerEmail, role: 'restaurant_owner' });
    if (!owner) {
      return res.status(404).json({ message: 'Restaurant owner not found' });
    }
    // Update restaurant with owner
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { owner: owner._id },
      { new: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    // Assign restaurantId to owner
    owner.restaurantId = restaurant._id;
    await owner.save();
    res.json({ message: 'Restaurant owner assigned successfully', restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required',
        received: { email: !!email, password: !!password }
      });
    }

    // Find admin user
    const admin = await User.findOne({ email });
    console.log('User found:', {
      exists: !!admin,
      email: admin?.email,
      role: admin?.role,
      hasPassword: !!admin?.password
    });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (admin.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.',
        userRole: admin.role
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('Password verification:', {
      isMatch,
      passwordLength: password.length
    });

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get admin profile
router.get('/profile', isAdmin, async (req, res) => {
  try {
    console.log('Profile request received:', {
      userId: req.user?.userId,
      role: req.user?.role
    });

    const admin = await User.findById(req.user.userId).select('-password');
    console.log('Admin found:', {
      exists: !!admin,
      email: admin?.email,
      role: admin?.role
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Admin: Get dashboard statistics
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const [totalRestaurants, totalOrders, totalUsers, recentOrders] = await Promise.all([
      Restaurant.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.find()
        .populate('restaurantId', 'name')
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean()
    ]);

    res.json({
      totalRestaurants,
      totalOrders,
      totalUsers,
      recentOrders: recentOrders.map(order => ({
        _id: order._id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        restaurant: order.restaurantId?.name || 'Unknown Restaurant',
        user: order.userId?.name || 'Unknown User'
      }))
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Get all restaurants with owner information
router.get('/restaurants', isAdmin, async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Get users with optional role filter
router.get('/users', isAdmin, async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Create user
router.post('/users', isAdmin, async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate input
    if (!email || !password || !name || !role) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['email', 'password', 'name', 'role']
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists',
        field: 'email'
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      role
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ 
      message: 'Error creating user',
      error: error.message 
    });
  }
});

export default router;