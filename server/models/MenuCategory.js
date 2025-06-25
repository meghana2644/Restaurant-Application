import mongoose from 'mongoose';

const menuCategorySchema = new mongoose.Schema({
  restaurantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  displayOrder: { 
    type: Number, 
    required: true 
  }
}, { timestamps: true });

export const MenuCategoryModel = mongoose.model('MenuCategory', menuCategorySchema); 