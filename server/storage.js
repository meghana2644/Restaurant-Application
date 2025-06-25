import { Restaurant, InsertRestaurant, MenuItem, InsertMenuItem, MenuCategory, InsertMenuCategory, Review, InsertReview, Order, InsertOrder } from "@shared/schema.js";

export class MemStorage {
  constructor() {
    this.restaurants = new Map();
    this.menuCategories = new Map();
    this.menuItems = new Map();
    this.reviews = new Map();
    this.orders = new Map();
    
    this.restaurantIdCounter = 1;
    this.categoryIdCounter = 1;
    this.menuItemIdCounter = 1;
    this.reviewIdCounter = 1;
    this.orderIdCounter = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }

  // Restaurant methods
  async getRestaurants() {
    return Array.from(this.restaurants.values());
  }

  async getRestaurant(id) {
    return this.restaurants.get(id);
  }

  async createRestaurant(restaurant) {
    const id = this.restaurantIdCounter++;
    const newRestaurant = { ...restaurant, id };
    this.restaurants.set(id, newRestaurant);
    return newRestaurant;
  }
  
  // Menu category methods
  async getMenuCategories(restaurantId) {
    return Array.from(this.menuCategories.values()).filter(
      (category) => category.restaurantId === restaurantId
    ).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getMenuCategory(id) {
    return this.menuCategories.get(id);
  }

  async createMenuCategory(category) {
    const id = this.categoryIdCounter++;
    const newCategory = { ...category, id };
    this.menuCategories.set(id, newCategory);
    return newCategory;
  }
  
  // Menu item methods
  async getMenuItems(restaurantId, categoryId) {
    return Array.from(this.menuItems.values()).filter(
      (item) => 
        item.restaurantId === restaurantId && 
        (categoryId === undefined || item.categoryId === categoryId)
    );
  }

  async getMenuItem(id) {
    return this.menuItems.get(id);
  }

  async createMenuItem(item) {
    const id = this.menuItemIdCounter++;
    const newItem = { ...item, id };
    this.menuItems.set(id, newItem);
    return newItem;
  }
  
  // Review methods
  async getReviews(restaurantId) {
    return Array.from(this.reviews.values()).filter(
      (review) => review.restaurantId === restaurantId
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createReview(review) {
    const id = this.reviewIdCounter++;
    const newReview = { ...review, id, date: new Date() };
    this.reviews.set(id, newReview);
    
    // Update restaurant rating
    const restaurant = this.restaurants.get(review.restaurantId);
    if (restaurant) {
      const reviews = await this.getReviews(review.restaurantId);
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const newRating = totalRating / reviews.length;
      
      this.restaurants.set(review.restaurantId, {
        ...restaurant,
        rating: parseFloat(newRating.toFixed(1)),
        reviewCount: reviews.length
      });
    }
    
    return newReview;
  }
  
  // Order methods
  async getOrders() {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
  }

  async getOrder(id) {
    return this.orders.get(id);
  }

  async createOrder(order) {
    const id = this.orderIdCounter++;
    const restaurant = await this.getRestaurant(order.restaurantId);
    
    if (!restaurant) {
      throw new Error(`Restaurant with ID ${order.restaurantId} not found`);
    }
    
    const newOrder = {
      ...order,
      id,
      orderDate: new Date(),
      restaurant,
      items: order.items
    };
    
    this.orders.set(id, newOrder);
    return newOrder;
  }

  // Initialize with sample data
  initSampleData() {
    // Sample restaurants
    const restaurants = [
      {
        name: "Italian Delight",
        description: "Authentic Italian cuisine with homemade pasta and wood-fired pizzas.",
        imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        bannerUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        address: "123 Main St, Foodville",
        priceLevel: 2,
        rating: 4.8,
        reviewCount: 352,
        cuisine: ["Italian", "Pasta", "Pizza"],
        distance: 1.2,
        deliveryTime: "25-35 min",
        freeDelivery: true,
        latitude: 40.7128,
        longitude: -74.006
      },
      {
        name: "Sushi Master",
        description: "Premium sushi and Japanese cuisine prepared by expert chefs.",
        imageUrl: "https://images.unsplash.com/photo-1562566331-c505b22284fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        bannerUrl: "https://images.unsplash.com/photo-1562566331-c505b22284fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        address: "456 Ocean Ave, Foodville",
        priceLevel: 3,
        rating: 4.6,
        reviewCount: 218,
        cuisine: ["Japanese", "Sushi", "Asian"],
        distance: 0.8,
        deliveryTime: "15-25 min",
        freeDelivery: true,
        latitude: 40.7135,
        longitude: -74.0046
      },
      {
        name: "Taco Fiesta",
        description: "Vibrant Mexican street food with fresh ingredients and bold flavors.",
        imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        bannerUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        address: "789 Spice Rd, Foodville",
        priceLevel: 1,
        rating: 4.5,
        reviewCount: 189,
        cuisine: ["Mexican", "Tacos", "Burritos"],
        distance: 1.5,
        deliveryTime: "20-30 min",
        freeDelivery: true,
        latitude: 40.7139,
        longitude: -74.0080
      }
    ];

    // Create restaurants
    restaurants.forEach(restaurant => {
      this.createRestaurant(restaurant);
    });

    // Sample menu categories for Italian Delight
    const italianCategories = [
      { restaurantId: 1, name: "Appetizers", displayOrder: 1 },
      { restaurantId: 1, name: "Pasta", displayOrder: 2 },
      { restaurantId: 1, name: "Pizza", displayOrder: 3 },
      { restaurantId: 1, name: "Main Courses", displayOrder: 4 },
      { restaurantId: 1, name: "Desserts", displayOrder: 5 },
      { restaurantId: 1, name: "Drinks", displayOrder: 6 }
    ];

    // Create categories
    italianCategories.forEach(category => {
      this.createMenuCategory(category);
    });

    // Sample menu items for Italian Delight - Pasta category
    const pastaItems = [
      {
        restaurantId: 1,
        categoryId: 2,
        name: "Spaghetti Carbonara",
        description: "Classic Italian pasta with eggs, cheese, pancetta, and black pepper",
        price: 16.99,
        imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        calories: 650,
        allergens: ["dairy", "eggs", "wheat"]
      },
      {
        restaurantId: 1,
        categoryId: 2,
        name: "Fettuccine Alfredo",
        description: "Creamy pasta with parmesan cheese and butter",
        price: 15.99,
        imageUrl: "https://images.unsplash.com/photo-1645112411341-6c1f3c1c3c1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        calories: 750,
        allergens: ["dairy", "wheat"]
      }
    ];

    // Create menu items
    pastaItems.forEach(item => {
      this.createMenuItem(item);
    });
  }
}

export const storage = new MemStorage(); 