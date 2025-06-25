import mongoose from 'mongoose';

// Restaurant schema
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  bannerUrl: { type: String },
  address: { type: String, required: true },
  priceLevel: { type: Number, required: true },
  rating: { type: Number, required: true },
  reviewCount: { type: Number, required: true },
  cuisine: [{ type: String, required: true }],
  distance: { type: Number, required: true },
  deliveryTime: { type: String, required: true },
  freeDelivery: { type: Boolean, default: false },
  latitude: { type: Number },
  longitude: { type: Number }
}, { timestamps: true });

// Menu category schema
const menuCategorySchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  displayOrder: { type: Number, required: true }
}, { timestamps: true });

// Review schema
const reviewSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  email: { type: String },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// Create models
export const MenuCategory = mongoose.model('MenuCategory', menuCategorySchema);
export const Review = mongoose.model('Review', reviewSchema);

// Export schemas for validation
export const schemas = {
  restaurant: restaurantSchema,
  menuCategory: menuCategorySchema,
  review: reviewSchema
}; 