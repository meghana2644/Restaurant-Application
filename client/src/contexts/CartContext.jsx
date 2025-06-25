import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurantId = localStorage.getItem('restaurantId');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    if (savedRestaurantId) {
      setRestaurantId(savedRestaurantId);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    if (restaurantId) {
      localStorage.setItem('restaurantId', restaurantId);
    } else {
      localStorage.removeItem('restaurantId');
    }
  }, [items, restaurantId]);
  const addItem = (item, newRestaurantId) => {
    console.log('addItem called with:', { item, newRestaurantId });
    
    if (!newRestaurantId) {
      console.error('No restaurant ID provided when adding item:', item);
      toast.error('Error adding item to cart');
      return;
    }

    if (restaurantId && newRestaurantId !== restaurantId) {
      const confirmed = window.confirm(
        'Adding items from a different restaurant will clear your current cart. Do you want to proceed?'
      );
      if (!confirmed) return;
      setItems([]);
    }

    setRestaurantId(newRestaurantId);
    setItems(currentItems => {
      console.log('Current items before adding:', currentItems);
      const existingItem = currentItems.find(i => i._id === item._id);
      if (existingItem) {
        const updatedItems = currentItems.map(i =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + 1, restaurantId: newRestaurantId }
            : i
        );
        console.log('Updated items (existing item):', updatedItems);
        return updatedItems;
      }
      const newItems = [...currentItems, { ...item, quantity: 1, restaurantId: newRestaurantId }];
      console.log('Updated items (new item):', newItems);
      return newItems;
    });
    toast.success('Item added to cart');
  };

  const removeItem = (itemId) => {
    setItems(currentItems => {
      const newItems = currentItems.filter(item => item._id !== itemId);
      if (newItems.length === 0) {
        setRestaurantId(null);
        localStorage.removeItem('restaurantId');
      }
      return newItems;
    });
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeItem(itemId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item._id === itemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('restaurantId');
    toast.success('Cart cleared');
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.1; // 10% tax
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const value = {
    items,
    restaurantId,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTax,
    getTotal,
    itemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 