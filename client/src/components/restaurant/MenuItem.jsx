import React, { useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

const MenuItemCard = ({ item, restaurantId }) => {
  const [showViewCart, setShowViewCart] = useState(false);
  const [, setLocation] = useLocation();
  const { addItem, updateQuantity, removeItem, items } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const cartItem = items.find(i => i._id === item._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      setLocation('/login');
      return;
    }

    console.log('MenuItem: Adding item to cart:', { item, restaurantId });
    setLoading(true);
    try {
      await addItem(item, restaurantId);
      console.log('MenuItem: Item successfully added to cart');
    } catch (error) {
      console.error('MenuItem: Failed to add item to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCart = () => {
    setLocation('/cart');
  };

  const handleUpdateQuantity = async (newQuantity) => {
    if (!user) {
      toast.error('Please login to update cart');
      setLocation('/login');
      return;
    }

    setLoading(true);
    try {
      if (newQuantity === 0) {
        await removeItem(item._id);
      } else {
        await updateQuantity(item._id, newQuantity);
      }
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="w-full md:w-48 h-48 md:h-auto relative overflow-hidden">
          <img 
            src={item.imageUrl}
            alt={item.name} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          {item.isPopular && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Popular
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex flex-col h-full">
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
              
              {/* Dietary Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {item.vegetarian && (
                  <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200">
                    Vegetarian
                  </span>
                )}
                {item.vegan && (
                  <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200">
                    Vegan
                  </span>
                )}
                {item.glutenFree && (
                  <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full border border-amber-200">
                    Gluten Free
                  </span>
                )}
              </div>
            </div>

            {/* Price and Action Buttons */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-primary">{formatPrice(item.price)}</span>
              </div>
              <div className="flex items-center gap-2">
                {quantity === 0 ? (
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleAddToCart}
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add to Order
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(quantity - 1)}
                      disabled={loading}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(quantity + 1)}
                      disabled={loading}
                    >
                      +
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard; 