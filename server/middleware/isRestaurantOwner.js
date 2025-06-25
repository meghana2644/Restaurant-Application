export const isRestaurantOwner = (req, res, next) => {
  if (req.user && req.user.role === 'restaurant_owner') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Restaurant owner privileges required.' });
  }
}; 