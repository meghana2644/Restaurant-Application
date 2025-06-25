import express from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is restaurant owner (combines auth + role check)
const isRestaurantOwner = async (req, res, next) => {
  // First apply authentication
  await authenticateUser(req, res, (err) => {
    if (err) return next(err);
    
    // Then check role
    if (!req.user || req.user.role !== 'restaurant_owner') {
      return res.status(403).json({ message: 'Access denied. Restaurant owner privileges required.' });
    }

    // Check if owner has a restaurant assigned
    if (!req.user.restaurantId) {
      return res.status(403).json({ message: 'No restaurant assigned to this account.' });
    }

    next();
  });
};

// Restaurant owner login (no authentication required)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find restaurant owner
    const owner = await User.findOne({ email, role: 'restaurant_owner' });
    if (!owner) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }    // Verify password
    const isMatch = await owner.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: owner._id,
        email: owner.email,
        role: owner.role,
        restaurantId: owner.restaurantId
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );    res.json({
      token,
      user: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        role: owner.role,
        restaurantId: owner.restaurantId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get restaurant owner profile
router.get('/profile', isRestaurantOwner, async (req, res) => {
  try {
    const owner = await User.findById(req.user._id)
      .select('-password')
      .populate('restaurantId', 'name address');
    
    res.json(owner);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get restaurant details
router.get('/restaurant', isRestaurantOwner, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.user.restaurantId)
      .populate('menu');
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add menu item
router.post('/menu-items', isRestaurantOwner, async (req, res) => {
  try {
    const menuItemSchema = z.object({
      name: z.string().min(1),
      description: z.string(),
      price: z.number().positive(),
      category: z.string(),
      isVegetarian: z.boolean().optional(),
      isVegan: z.boolean().optional(),
      isGlutenFree: z.boolean().optional(),
      imageUrl: z.string().url().optional()
    });

    const validatedData = menuItemSchema.parse(req.body);
    
    const menuItem = new MenuItem({
      ...validatedData,
      restaurantId: req.user.restaurantId
    });

    await menuItem.save();

    // Add menu item to restaurant's menu
    await Restaurant.findByIdAndUpdate(
      req.user.restaurantId,
      { $push: { menu: menuItem._id } }
    );

    res.status(201).json(menuItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update menu item
router.put('/menu-items/:id', isRestaurantOwner, async (req, res) => {
  try {
    const menuItem = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, restaurantId: req.user.restaurantId },
      req.body,
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete menu item
router.delete('/menu-items/:id', isRestaurantOwner, async (req, res) => {
  try {
    const menuItem = await MenuItem.findOneAndDelete({
      _id: req.params.id,
      restaurantId: req.user.restaurantId
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Remove menu item from restaurant's menu
    await Restaurant.findByIdAndUpdate(
      req.user.restaurantId,
      { $pull: { menu: menuItem._id } }
    );

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all menu items
router.get('/menu-items', isRestaurantOwner, async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurantId: req.user.restaurantId })
      .sort({ category: 1, name: 1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update restaurant details
router.put('/restaurant', isRestaurantOwner, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.user.restaurantId,
      req.body,
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get orders for restaurant
router.get('/orders', isRestaurantOwner, async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const filter = { restaurantId: req.user.restaurantId };
    
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('userId', 'name email phone')
      .populate('items.menuItemId', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get dashboard statistics
router.get('/dashboard', isRestaurantOwner, async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;
    
    const [restaurant, totalOrders, totalRevenue, recentOrders] = await Promise.all([
      Restaurant.findById(restaurantId),
      Order.countDocuments({ restaurantId }),
      Order.aggregate([
        { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId), status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.find({ restaurantId })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.json({
      restaurant,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status (approve/reject/update)
router.put('/orders/:orderId/status', isRestaurantOwner, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['accepted', 'rejected', 'preparing', 'ready', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status', 
        validStatuses 
      });
    }

    const order = await Order.findOne({ 
      _id: orderId, 
      restaurantId: req.user.restaurantId 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate('userId', 'name email phone')
      .populate('items.menuItemId', 'name');

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;