# Manual Cart Testing Plan

## Prerequisites
- Frontend server running at http://localhost:5173
- Browser developer tools open (F12) to monitor console logs
- Testing tools available at file:///c:/Users/pc/OneDrive/Desktop/RestaurantApplication%20fin/complete-cart-test.html

## Test Steps

### 1. Cart State Testing
1. Open browser console (F12)
2. Navigate to http://localhost:5173
3. Check localStorage for existing cart data:
   ```javascript
   console.log('Cart localStorage:', localStorage.getItem('cart'));
   console.log('Restaurant ID localStorage:', localStorage.getItem('restaurantId'));
   ```

### 2. Navigation Flow Testing
1. Navigate to a restaurant page (e.g., /restaurant/[id])
2. Verify menu items are displayed
3. Check console for debug logs when page loads

### 3. Add Item to Cart Testing
1. Click "Add to Cart" on a menu item
2. Monitor console for debug logs:
   - `MenuItem: Adding item to cart:` logs
   - `addItem called with:` logs
   - `Current items before adding:` logs
   - `Updated items:` logs
3. Check localStorage again to see if item was persisted
4. Verify toast notification appears

### 4. Cart Display Testing
1. Navigate to /cart page
2. Check console for:
   - `Cart items from CartContext:` logs
3. Verify items are displayed on cart page
4. Test quantity update buttons
5. Test remove item functionality

### 5. Multi-Restaurant Testing
1. Add items from one restaurant
2. Navigate to different restaurant
3. Try adding item from second restaurant
4. Verify confirmation dialog appears
5. Test both "confirm" and "cancel" scenarios

### 6. LocalStorage Persistence Testing
1. Add items to cart
2. Refresh page
3. Verify cart persists
4. Navigate to cart page
5. Verify items still show

### 7. Checkout Flow Testing (Frontend Only)
1. Add items to cart
2. Navigate to checkout
3. Fill out required fields
4. Monitor console for order data formatting
5. Check if order data looks correct for backend submission

## Debug Commands for Browser Console

```javascript
// Check cart state
console.log('Cart localStorage:', JSON.parse(localStorage.getItem('cart') || '[]'));
console.log('Restaurant ID:', localStorage.getItem('restaurantId'));

// Clear cart for testing
localStorage.removeItem('cart');
localStorage.removeItem('restaurantId');
console.log('Cart cleared');

// Simulate adding item (replace with actual item data)
const testItem = {
  _id: 'test123',
  name: 'Test Item',
  price: 10.99,
  description: 'Test description'
};
// This would need to be called from within the app context
```

## Expected Debug Log Patterns

### Successful Item Addition:
```
MenuItem: Adding item to cart: {item: {...}, restaurantId: "..."}
addItem called with: {item: {...}, newRestaurantId: "..."}
Current items before adding: [...]
Updated items (new item): [...]
```

### Cart Page Load:
```
Cart items from CartContext: [...]
```

### Checkout Page:
```
Order data formatted: {items: [...], deliveryType: "...", ...}
```

## Common Issues to Watch For
1. **Missing restaurantId**: Check if restaurantId is properly passed from restaurant page
2. **Items not persisting**: Verify localStorage is being updated
3. **Cart not displaying**: Check if CartContext is providing items correctly
4. **Quantity updates**: Verify updateQuantity function works
5. **Cross-restaurant cart clearing**: Test restaurant switching logic

## Success Criteria
- [x] Items successfully added to cart with debug logs
- [x] Cart persists across page refreshes
- [x] Cart page displays items correctly
- [x] Quantity updates work
- [x] Restaurant switching prompts confirmation
- [x] LocalStorage contains correct cart data
- [x] Console shows expected debug patterns
