import express from "express";
import { createServer } from "http";
import { z } from "zod";
import { MenuCategory, Review } from "../shared/schema.js";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Restaurant from './models/Restaurant.js';
import MenuItem from './models/MenuItem.js';
import Order from './models/Order.js';
import Cart from './models/Cart.js';
import orderRoutes from './routes/orders.js';

const router = express.Router();

// Configure session middleware with MongoDB store
router.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_app',
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  name: 'sessionId'
}));

// Initialize passport
router.use(passport.initialize());
router.use(passport.session());

// Configure passport local strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Error handling middleware
const handleErrors = (err, req, res, next) => {
  console.error(err);
  
  if (err instanceof ZodError) {
    const validationError = fromZodError(err);
    return res.status(400).json({ error: validationError.message });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  if (err.name === 'ValidationError') {
    const errors = {};
    Object.keys(err.errors).forEach(key => {
      errors[key] = err.errors[key].message;
    });
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors
    });
  }
  
  res.status(500).json({ error: err.message || "Internal server error" });
};

// Add this authentication middleware for JWT
const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user by id
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Restaurant Routes
 */

// Get all restaurants
router.get("/restaurants", async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    next(error);
  }
});

// Get a single restaurant
router.get("/restaurants/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid restaurant ID format" });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    
    res.json(restaurant);
  } catch (error) {
    next(error);
  }
});

// Create a restaurant
router.post("/restaurants", async (req, res, next) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    next(error);
  }
});

// Update a restaurant
router.put("/restaurants/:id", async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    
    res.json(restaurant);
  } catch (error) {
    next(error);
  }
});

// Delete a restaurant
router.delete("/restaurants/:id", async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    
    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    next(error);
  }
});

/**
 * Menu Category Routes
 */

// Get categories for a restaurant
router.get("/restaurants/:restaurantId/categories", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.restaurantId)) {
      return res.status(400).json({ error: "Invalid restaurant ID format" });
    }

    const categories = await MenuCategory.find({ restaurantId: req.params.restaurantId });
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Create a menu category
router.post("/restaurants/:restaurantId/categories", async (req, res, next) => {
  try {
    const category = new MenuCategory({
      ...req.body,
      restaurantId: req.params.restaurantId
    });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

/**
 * Menu Item Routes
 */

// Get menu items for a restaurant
router.get("/restaurants/:id/menu-items", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, vegetarian, vegan, glutenFree } = req.query;

    console.log('Fetching menu items for restaurant:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid restaurant ID format:', id);
      return res.status(400).json({ error: 'Invalid restaurant ID format' });
    }

    // First check if the restaurant exists
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      console.log('Restaurant not found:', id);
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const query = { restaurantId: id };

    // Add dietary filters if provided
    if (vegetarian === 'true') query.isVegetarian = true;
    if (vegan === 'true') query.isVegan = true;
    if (glutenFree === 'true') query.isGlutenFree = true;

    console.log('Query:', query);

    const menuItems = await MenuItem.find(query);
    console.log('Found menu items:', menuItems.length);

    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    next(error);
  }
});

// Create a menu item
router.post("/categories/:categoryId/items", async (req, res, next) => {
  try {
    const item = new MenuItem({
      ...req.body,
      categoryId: req.params.categoryId
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

/**
 * Review Routes
 */

// Get reviews for a restaurant
router.get("/restaurants/:restaurantId/reviews", async (req, res, next) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.restaurantId });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

// Create a review
router.post("/restaurants/:restaurantId/reviews", authenticateUser, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Please log in to submit a review' });
    }

    const review = new Review({
      ...req.body,
      restaurantId: req.params.restaurantId,
      name: req.user.name,
      email: req.user.email
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Invalid review data',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    next(error);
  }
});

// Delete a review
router.delete("/restaurants/:restaurantId/reviews/:reviewId", async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user is authorized to delete the review
    if (review.name !== req.user?.name && review.email !== req.user?.email) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.reviewId);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * Order Routes
 */

// Use order routes
router.use('/orders', orderRoutes);

/**
 * Authentication Routes
 */

// Register new user
router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['email', 'password', 'name']
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
      name
    });

    await user.save();

    // Generate JWT token for the newly registered user
    const token = jwt.sign(
      { userId: user._id, role: user.role || 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || 'user'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user',
      error: error.message 
    });
  }
});

// Login user
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user by email (any role)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token for the user
    const token = jwt.sign(
      { userId: user._id, role: user.role || 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || 'user'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Logout user
router.post('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Get current user
router.get('/auth/me', authenticateUser, (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role || 'user'
  });
});

// Get restaurant by ID with menu items
router.get('/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('menuItems')
      .lean();

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Log for debugging
    console.log('Fetched restaurant:', {
      id: restaurant._id,
      name: restaurant.name,
      menuItemsCount: restaurant.menuItems?.length
    });

    res.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ message: 'Failed to fetch restaurant' });
  }
});

// Debug endpoint to check restaurant data
router.get('/debug/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate('menuItems')
      .lean();
    
    res.json({
      count: restaurants.length,
      restaurants: restaurants.map(r => ({
        id: r._id,
        name: r.name,
        menuItemsCount: r.menuItems?.length,
        menuItems: r.menuItems
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/users/profile', authenticateUser, async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ 
        message: 'Name is required',
        field: 'name'
      });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({ 
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Format the response
    const response = {
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone || null
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: 'Error updating profile',
      error: error.message || 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * Cart Routes
 */

// Get user's cart
router.get('/cart', authenticateUser, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.menuItemId', 'name price imageUrl')
      .populate('items.restaurantId', 'name');

    if (!cart) {
      // Create an empty cart if none exists
      cart = new Cart({
        userId: req.user._id,
        items: []
      });
      await cart.save();
    }

    res.json({ items: cart.items || [] });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ 
      message: 'Error fetching cart',
      error: error.message 
    });
  }
});

// Add item to cart
router.post('/cart', authenticateUser, async (req, res) => {
  try {
    const { menuItemId, quantity = 1 } = req.body;

    if (!menuItemId) {
      return res.status(400).json({ 
        message: 'Menu item ID is required' 
      });
    }

    // Get menu item details
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ 
        message: 'Menu item not found' 
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: []
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.menuItemId.toString() === menuItemId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        restaurantId: menuItem.restaurantId
      });
    }

    await cart.save();

    // Populate the cart before returning
    await cart.populate('items.menuItemId', 'name price imageUrl');
    await cart.populate('items.restaurantId', 'name');

    res.json({ 
      message: 'Item added to cart successfully',
      items: cart.items 
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ 
      message: 'Error adding to cart',
      error: error.message 
    });
  }
});

// Update cart item quantity
router.put('/cart/:itemId', authenticateUser, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        message: 'Valid quantity is required' 
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ 
        message: 'Cart not found' 
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ 
        message: 'Item not found in cart' 
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Populate the cart before returning
    await cart.populate('items.menuItemId', 'name price imageUrl');
    await cart.populate('items.restaurantId', 'name');

    res.json({ 
      message: 'Cart updated successfully',
      items: cart.items 
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ 
      message: 'Error updating cart',
      error: error.message 
    });
  }
});

// Remove item from cart
router.delete('/cart/:itemId', authenticateUser, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ 
        message: 'Cart not found' 
      });
    }

    cart.items = cart.items.filter(
      item => item._id.toString() !== itemId
    );

    await cart.save();

    // Populate the cart before returning
    await cart.populate('items.menuItemId', 'name price imageUrl');
    await cart.populate('items.restaurantId', 'name');

    res.json({ 
      message: 'Item removed from cart successfully',
      items: cart.items 
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ 
      message: 'Error removing from cart',
      error: error.message 
    });
  }
});

// Clear entire cart
router.delete('/cart', authenticateUser, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [] },
      { new: true }
    );

    res.json({ 
      message: 'Cart cleared successfully',
      items: [] 
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ 
      message: 'Error clearing cart',
      error: error.message 
    });
  }
});

// Create user (admin only)
router.post('/admin/users', authenticateUser, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create users' });
    }

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

// Admin routes
router.post('/admin/restaurants', authenticateUser, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create restaurants' });
    }

    const { name, description, imageUrl, bannerUrl, address, priceLevel, cuisine, distance, deliveryTime, freeDelivery, latitude, longitude, openingHours, ownerEmail } = req.body;

    // Validate input
    if (!name || !description || !imageUrl || !bannerUrl || !address || !priceLevel || !cuisine || !distance || !deliveryTime || !latitude || !longitude || !openingHours || !ownerEmail) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['name', 'description', 'imageUrl', 'bannerUrl', 'address', 'priceLevel', 'cuisine', 'distance', 'deliveryTime', 'latitude', 'longitude', 'openingHours', 'ownerEmail']
      });
    }

    // Find the owner
    const owner = await User.findOne({ email: ownerEmail, role: 'restaurant_owner' });
    if (!owner) {
      return res.status(404).json({ 
        message: 'Restaurant owner not found',
        field: 'ownerEmail'
      });
    }

    // Create new restaurant
    const restaurant = new Restaurant({
      name,
      description,
      imageUrl,
      bannerUrl,
      address,
      priceLevel,
      cuisine,
      distance,
      deliveryTime,
      freeDelivery,
      latitude,
      longitude,
      openingHours,
      reviewCount: 0,
      owner: owner._id
    });

    await restaurant.save();

    // Update owner's restaurantId
    owner.restaurantId = restaurant._id;
    await owner.save();

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        owner: {
          id: owner._id,
          email: owner.email,
          name: owner.name
        }
      }
    });
  } catch (error) {
    console.error('Restaurant creation error:', error);
    res.status(500).json({ 
      message: 'Error creating restaurant',
      error: error.message 
    });
  }
});

// Apply error handling middleware to the router
router.use(handleErrors);

export default router; 