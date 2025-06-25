import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Restaurant from '../models/Restaurant.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Create a new order
router.post("/", authenticateUser, async (req, res, next) => {
  try {
    console.log('Received order data:', req.body);
    
    // Validate required fields
    const requiredFields = ['restaurantId', 'items', 'orderType', 'subtotal', 'tax', 'total'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: missingFields
      });
    }

    // Validate restaurant exists
    if (!mongoose.Types.ObjectId.isValid(req.body.restaurantId)) {
      return res.status(400).json({ error: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Validate items array
    if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({
        error: 'Items array is required and must not be empty'
      });
    }    // Validate each item
    for (const item of req.body.items) {
      const requiredItemFields = ['menuItemId', 'name', 'quantity', 'price'];
      const missingItemFields = requiredItemFields.filter(field => 
        item[field] === undefined || item[field] === null || 
        (typeof item[field] === 'string' && item[field].trim() === '')
      );
      
      if (missingItemFields.length > 0) {
        return res.status(400).json({
          error: `Missing required fields in item: ${missingItemFields.join(', ')}`
        });
      }

      // Validate item quantity
      if (typeof item.quantity !== 'number' || item.quantity < 1) {
        return res.status(400).json({
          error: `Invalid quantity for item: ${item.name}`
        });
      }

      // Validate item price
      if (typeof item.price !== 'number' || item.price <= 0) {
        return res.status(400).json({
          error: `Invalid price for item: ${item.name}`
        });
      }

      // Validate menuItemId format
      if (!mongoose.Types.ObjectId.isValid(item.menuItemId)) {
        return res.status(400).json({
          error: `Invalid menu item ID format for: ${item.name}`
        });
      }
    }

    // Validate order type
    if (!['takeout', 'dinein'].includes(req.body.orderType)) {
      return res.status(400).json({
        error: 'Invalid order type. Must be either "takeout" or "dinein"'
      });
    }    // Validate delivery address for takeout
    if (req.body.orderType === 'takeout') {
      if (!req.body.deliveryAddress) {
        return res.status(400).json({
          error: 'Delivery address is required for takeout orders'
        });
      }

      const requiredAddressFields = ['street', 'city', 'state', 'zipCode', 'phone'];
      const missingAddressFields = requiredAddressFields.filter(field => 
        !req.body.deliveryAddress[field] || 
        (typeof req.body.deliveryAddress[field] === 'string' && req.body.deliveryAddress[field].trim() === '')
      );
      
      if (missingAddressFields.length > 0) {
        return res.status(400).json({
          error: `Missing required address fields: ${missingAddressFields.join(', ')}`
        });
      }
    }

    // Validate numeric values
    const numericFields = ['subtotal', 'tax', 'total'];
    for (const field of numericFields) {
      if (isNaN(req.body[field]) || req.body[field] <= 0) {
        return res.status(400).json({
          error: `${field} must be a positive number`
        });
      }
    }

    // Validate total matches subtotal + tax
    const calculatedTotal = Number((req.body.subtotal + req.body.tax).toFixed(2));
    if (calculatedTotal !== Number(req.body.total)) {
      return res.status(400).json({
        error: 'Total amount does not match subtotal + tax'
      });
    }

    // Create the order
    const order = new Order({
      userId: req.user._id,
      restaurantId: req.body.restaurantId,
      items: req.body.items,
      orderType: req.body.orderType,
      deliveryAddress: req.body.deliveryAddress,
      specialInstructions: req.body.specialInstructions,
      subtotal: req.body.subtotal,
      tax: req.body.tax,
      total: req.body.total
    });

    await order.save();
    console.log('Order saved successfully:', order);

    // Populate the order with necessary references
    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'name email')
      .populate('restaurantId', 'name')
      .populate('items.menuItemId', 'name price');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    next(error);
  }
});

// Get user's orders
router.get("/", authenticateUser, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Get a single order
router.get("/:orderId", authenticateUser, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('userId', 'name email')
      .populate('restaurantId', 'name')
      .populate('items.menuItemId', 'name price');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

// Update order status (restaurant owner only)
router.patch("/:orderId/status", authenticateUser, async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is the restaurant owner
    const restaurant = await Restaurant.findById(order.restaurantId);
    if (!restaurant || restaurant.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this order' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    next(error);
  }
});

export default router; 