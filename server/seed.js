import mongoose from 'mongoose';
import Restaurant from './models/Restaurant.js';
import MenuItem from './models/MenuItem.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const sampleRestaurants = [
  {
    name: "Pizza Palace",
    description: "Authentic Italian pizzeria serving wood-fired Neapolitan pizzas with fresh ingredients",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    bannerUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    address: "123 Brigade Road, Bangalore",
    priceLevel: 2,
    rating: 4.5,
    reviewCount: 128,
    cuisine: ["Italian", "Pizza"],
    distance: 2.5,
    deliveryTime: "30-45 min",
    freeDelivery: true,
    latitude: 12.9716,
    longitude: 77.5946
  },
  {
    name: "Sushi Master",
    description: "Premium Japanese restaurant offering fresh sushi, sashimi, and traditional dishes",
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    bannerUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    address: "456 MG Road, Bangalore",
    priceLevel: 3,
    rating: 4.8,
    reviewCount: 256,
    cuisine: ["Japanese", "Sushi"],
    distance: 3.0,
    deliveryTime: "40-55 min",
    freeDelivery: false,
    latitude: 12.9754,
    longitude: 77.5928
  },
  {
    name: "Burger Barn",
    description: "Gourmet burger joint serving handcrafted burgers with premium ingredients",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    bannerUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    address: "789 Koramangala, Bangalore",
    priceLevel: 2,
    rating: 4.3,
    reviewCount: 192,
    cuisine: ["American", "Burgers"],
    distance: 1.5,
    deliveryTime: "25-35 min",
    freeDelivery: true,
    latitude: 12.9352,
    longitude: 77.6245
  },
  {
    name: "Spice Garden",
    description: "Authentic North Indian restaurant serving rich curries and tandoori specialties",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
    bannerUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
    address: "101 Indiranagar, Bangalore",
    priceLevel: 2,
    rating: 4.7,
    reviewCount: 342,
    cuisine: ["Indian", "North Indian"],
    distance: 2.0,
    deliveryTime: "35-45 min",
    freeDelivery: true,
    latitude: 12.9784,
    longitude: 77.6408
  },
  {
    name: "Dosa Delight",
    description: "South Indian restaurant specializing in crispy dosas and authentic regional dishes",
    imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0",
    bannerUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0",
    address: "202 Jayanagar, Bangalore",
    priceLevel: 1,
    rating: 4.6,
    reviewCount: 289,
    cuisine: ["Indian", "South Indian"],
    distance: 1.8,
    deliveryTime: "30-40 min",
    freeDelivery: true,
    latitude: 12.9304,
    longitude: 77.5834
  },
  {
    name: "Tandoori Nights",
    description: "Mughlai restaurant serving rich curries and signature tandoori dishes",
    imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0",
    bannerUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0",
    address: "303 Whitefield, Bangalore",
    priceLevel: 3,
    rating: 4.9,
    reviewCount: 412,
    cuisine: ["Indian", "Mughlai"],
    distance: 2.5,
    deliveryTime: "40-50 min",
    freeDelivery: false,
    latitude: 12.9698,
    longitude: 77.7499
  },
  {
    name: "Street Bites",
    description: "Popular Indian street food restaurant serving authentic chaat and snacks",
    imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921",
    bannerUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921",
    address: "404 Malleshwaram, Bangalore",
    priceLevel: 1,
    rating: 4.4,
    reviewCount: 198,
    cuisine: ["Indian", "Street Food"],
    distance: 1.2,
    deliveryTime: "20-30 min",
    freeDelivery: true,
    latitude: 13.0067,
    longitude: 77.5611
  },
  {
    name: "Royal Thali",
    description: "Traditional Indian restaurant serving diverse regional thalis and specialties",
    imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db",
    bannerUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db",
    address: "505 HSR Layout, Bangalore",
    priceLevel: 2,
    rating: 4.8,
    reviewCount: 376,
    cuisine: ["Indian", "Regional"],
    distance: 2.8,
    deliveryTime: "35-45 min",
    freeDelivery: true,
    latitude: 12.9115,
    longitude: 77.6380
  },
  {
    name: "Dragon Palace",
    description: "Authentic Chinese restaurant serving traditional dishes with modern presentation",
    imageUrl: "https://images.unsplash.com/photo-1548809769-ff47235b0d3b",
    bannerUrl: "https://images.unsplash.com/photo-1548809769-ff47235b0d3b",
    address: "606 Marathahalli, Bangalore",
    priceLevel: 2,
    rating: 4.6,
    reviewCount: 245,
    cuisine: ["Chinese", "Asian"],
    distance: 2.3,
    deliveryTime: "30-40 min",
    freeDelivery: true,
    latitude: 12.9588,
    longitude: 77.7011
  },
  {
    name: "Taco Fiesta",
    description: "Vibrant Mexican restaurant serving authentic tacos and traditional dishes",
    imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d",
    bannerUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d",
    address: "707 Bellandur, Bangalore",
    priceLevel: 2,
    rating: 4.5,
    reviewCount: 189,
    cuisine: ["Mexican", "Latin"],
    distance: 1.9,
    deliveryTime: "25-35 min",
    freeDelivery: true,
    latitude: 12.9255,
    longitude: 77.6768
  },
  {
    name: "Thai Spice",
    description: "Traditional Thai restaurant serving authentic dishes with perfect balance of flavors",
    imageUrl: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853",
    bannerUrl: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853",
    address: "808 Electronic City, Bangalore",
    priceLevel: 2,
    rating: 4.7,
    reviewCount: 267,
    cuisine: ["Thai", "Asian"],
    distance: 2.1,
    deliveryTime: "35-45 min",
    freeDelivery: true,
    latitude: 12.8456,
    longitude: 77.6603
  }
];

const pizzaMenuItems = {
  starters: [
    {
      name: "Garlic Bread",
      description: "Fresh baked bread with garlic butter and herbs",
      price: 149,
      imageUrl: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false
    },
    {
      name: "Bruschetta",
      description: "Toasted bread with fresh tomatoes, garlic, and basil",
      price: 199,
      imageUrl: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: false
    }
  ],
  mainCourse: [
    {
      name: "Margherita Pizza",
      description: "Classic tomato sauce, mozzarella, and fresh basil",
      price: 299,
      imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false
    },
    {
      name: "Pepperoni Pizza",
      description: "Tomato sauce, mozzarella, and spicy pepperoni",
      price: 399,
      imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
      isPopular: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false
    }
  ],
  desserts: [
    {
      name: "Tiramisu",
      description: "Classic Italian dessert with coffee and mascarpone",
      price: 199,
      imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false
    },
    {
      name: "Gelato",
      description: "Italian ice cream with various flavors",
      price: 149,
      imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    }
  ]
};

const sushiMenuItems = {
  starters: [
    {
      name: "Miso Soup",
      description: "Traditional Japanese soup with tofu and seaweed",
      price: 99,
      imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    },
    {
      name: "Edamame",
      description: "Steamed soybeans with sea salt",
      price: 149,
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  ],
  mainCourse: [
    {
      name: "California Roll",
      description: "Crab meat, avocado, cucumber wrapped in rice and seaweed",
      price: 299,
      imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
      isPopular: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true
    },
    {
      name: "Spicy Tuna Roll",
      description: "Fresh tuna with spicy sauce",
      price: 399,
      imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
      isPopular: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true
    }
  ],
  desserts: [
    {
      name: "Mochi Ice Cream",
      description: "Japanese rice cake with ice cream filling",
      price: 199,
      imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    },
    {
      name: "Green Tea Ice Cream",
      description: "Traditional Japanese green tea flavored ice cream",
      price: 149,
      imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    }
  ]
};

const burgerMenuItems = {
  starters: [
    {
      name: "Onion Rings",
      description: "Crispy battered onion rings with dipping sauce",
      price: 149,
      imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false
    },
    {
      name: "Cheese Fries",
      description: "Crispy fries topped with melted cheese",
      price: 199,
      imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false
    }
  ],
  mainCourse: [
    {
      name: "Classic Cheeseburger",
      description: "Beef patty with cheese, lettuce, and special sauce",
      price: 249,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      isPopular: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false
    },
    {
      name: "Veggie Burger",
      description: "Plant-based patty with fresh vegetables",
      price: 199,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: false
    }
  ],
  desserts: [
    {
      name: "Chocolate Milkshake",
      description: "Creamy chocolate milkshake with whipped cream",
      price: 149,
      imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    },
    {
      name: "Apple Pie",
      description: "Classic apple pie with cinnamon",
      price: 99,
      imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false
    }
  ]
};

const indianMenuItems = {
  starters: [
    {
      name: "Paneer Tikka",
      description: "Cottage cheese marinated in spices and grilled in tandoor",
      price: 199,
      imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    },
    {
      name: "Chicken 65",
      description: "Spicy deep-fried chicken with Indian spices",
      price: 249,
      imageUrl: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91",
      isPopular: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true
    }
  ],
  mainCourse: [
    {
      name: "Butter Chicken",
      description: "Tender chicken in rich tomato and butter gravy",
      price: 299,
      imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db",
      isPopular: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true
    },
    {
      name: "Paneer Butter Masala",
      description: "Cottage cheese in creamy tomato gravy",
      price: 249,
      imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    }
  ],
  desserts: [
    {
      name: "Gulab Jamun",
      description: "Sweet milk dumplings in sugar syrup",
      price: 99,
      imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    },
    {
      name: "Rasmalai",
      description: "Soft cheese patties in sweetened milk",
      price: 99,
      imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    }
  ]
};

const southIndianMenuItems = {
  starters: [
    {
      name: "Masala Vada",
      description: "Spicy lentil fritters with chutney",
      price: 99,
      imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    },
    {
      name: "Gobi 65",
      description: "Spicy deep-fried cauliflower florets",
      price: 149,
      imageUrl: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  ],
  mainCourse: [
    {
      name: "Masala Dosa",
      description: "Crispy rice crepe with spiced potato filling",
      price: 149,
      imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    },
    {
      name: "Idli Sambar",
      description: "Steamed rice cakes with lentil stew",
      price: 99,
      imageUrl: "https://images.unsplash.com/photo-1630383249800-eb8102c109f2",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  ],
  desserts: [
    {
      name: "Mysore Pak",
      description: "Rich gram flour sweet",
      price: 79,
      imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    },
    {
      name: "Payasam",
      description: "Sweet rice pudding with nuts",
      price: 99,
      imageUrl: "https://images.unsplash.com/photo-1590154858906-4d1a3be10465",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  ]
};

const chineseMenuItems = {
  starters: [
    {
      name: "Spring Rolls",
      description: "Crispy vegetable rolls with sweet chili sauce",
      price: 149,
      imageUrl: "https://images.unsplash.com/photo-1548809769-ff47235b0d3b",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: false
    },
    {
      name: "Chicken Dim Sum",
      description: "Steamed chicken dumplings with soy sauce",
      price: 199,
      imageUrl: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c",
      isPopular: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false
    }
  ],
  mainCourse: [
    {
      name: "Kung Pao Chicken",
      description: "Spicy stir-fried chicken with peanuts",
      price: 299,
      imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e",
      isPopular: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true
    },
    {
      name: "Vegetable Fried Rice",
      description: "Stir-fried rice with mixed vegetables",
      price: 249,
      imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  ],
  desserts: [
    {
      name: "Mango Pudding",
      description: "Creamy mango dessert with fresh fruit",
      price: 119,
      imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    },
    {
      name: "Fortune Cookies",
      description: "Crispy cookies with fortune messages",
      price: 79,
      imageUrl: "https://images.unsplash.com/photo-1582173724686-0a3dba4356b6",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: false
    }
  ]
};

const mexicanMenuItems = {
  starters: [
    {
      name: "Nachos",
      description: "Crispy tortilla chips with cheese and salsa",
      price: 199,
      imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    },
    {
      name: "Chicken Quesadilla",
      description: "Grilled tortilla with chicken and cheese",
      price: 249,
      imageUrl: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f",
      isPopular: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false
    }
  ],
  mainCourse: [
    {
      name: "Chicken Tacos",
      description: "Soft tortillas with spiced chicken and toppings",
      price: 299,
      imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b",
      isPopular: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true
    },
    {
      name: "Vegetable Burrito",
      description: "Large tortilla wrap with rice, beans, and vegetables",
      price: 249,
      imageUrl: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: false
    }
  ],
  desserts: [
    {
      name: "Churros",
      description: "Fried dough pastry with chocolate sauce",
      price: 149,
      imageUrl: "https://images.unsplash.com/photo-1624371414361-e670edf4698d",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false
    },
    {
      name: "Tres Leches Cake",
      description: "Sponge cake soaked in three kinds of milk",
      price: 199,
      imageUrl: "https://images.unsplash.com/photo-1602663491496-8b5f6634c874",
      isPopular: true,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false
    }
  ]
};

const thaiMenuItems = {
  starters: [
    {
      name: "Tom Yum Soup",
      description: "Spicy and sour soup with mushrooms",
      price: 149,
      imageUrl: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    },
    {
      name: "Thai Spring Rolls",
      description: "Fresh rolls with vegetables and peanut sauce",
      price: 199,
      imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  ],
  mainCourse: [
    {
      name: "Pad Thai",
      description: "Stir-fried rice noodles with vegetables and peanuts",
      price: 249,
      imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    },
    {
      name: "Green Curry",
      description: "Coconut milk curry with vegetables and tofu",
      price: 299,
      imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  ],
  desserts: [
    {
      name: "Mango Sticky Rice",
      description: "Sweet sticky rice with fresh mango",
      price: 149,
      imageUrl: "https://images.unsplash.com/photo-1621293954908-907159247fc8",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    },
    {
      name: "Coconut Ice Cream",
      description: "Homemade coconut ice cream with toppings",
      price: 119,
      imageUrl: "https://images.unsplash.com/photo-1560008581-09826d1de69e",
      isPopular: true,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  ]
};

// Add admin and restaurant owner accounts
const adminUser = {
  name: "Admin User",
  email: "admin@restaurant.com",
  password: "admin123", // We'll let the pre-save hook handle hashing
  role: "admin",
  phone: "1234567890"
};

const restaurantOwners = [
  {
    name: "Pizza Palace Owner",
    email: "pizza@restaurant.com",
    password: "owner123",
    role: "restaurant_owner",
    phone: "2345678901"
  },
  {
    name: "Sushi Master Owner",
    email: "sushi@restaurant.com",
    password: "owner123",
    role: "restaurant_owner",
    phone: "3456789012"
  },
  {
    name: "Burger Barn Owner",
    email: "burger@restaurant.com",
    password: "owner123",
    role: "restaurant_owner",
    phone: "4567890123"
  },
  {
    name: "Spice Garden Owner",
    email: "spice@restaurant.com",
    password: "owner123",
    role: "restaurant_owner",
    phone: "5678901234"
  },
  {
    name: "Dosa Delight Owner",
    email: "dosa@restaurant.com",
    password: "owner123",
    role: "restaurant_owner",
    phone: "6789012345"
  },
  {
    name: "Tandoori Nights Owner",
    email: "tandoori@restaurant.com",
    password: "owner123",
    role: "restaurant_owner",
    phone: "7890123456"
  },
  {
    name: "Street Bites Owner",
    email: "street@restaurant.com",
    password: "owner123",
    role: "restaurant_owner",
    phone: "8901234567"
  },
  {
    name: "Royal Thali Owner",
    email: "royal@restaurant.com",
    password: "owner123",
    role: "restaurant_owner",
    phone: "9012345678"
  },
  {
    name: "Dragon Palace Owner",
    email: "dragon@restaurant.com",
    password: "owner123",
    role: "restaurant_owner",
    phone: "0123456789"
  },
  {
    name: "Taco Fiesta Owner",
    email: "taco@restaurant.com",
    password: "owner123",
    role: "restaurant_owner",
    phone: "1234567890"
  },
  {
    name: "Thai Spice Owner",
    email: "thai@restaurant.com",
    password: "owner123",
    role: "restaurant_owner",
    phone: "2345678901"
  }
];

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('Existing data cleared');

    // Create admin user
    const admin = await User.create(adminUser);
    console.log('Admin user created:', {
      email: admin.email,
      role: admin.role,
      hasPassword: !!admin.password,
      passwordLength: admin.password?.length
    });

    // Verify admin user was created correctly
    const verifyAdmin = await User.findOne({ email: adminUser.email });
    console.log('Verification - Admin user in database:', {
      exists: !!verifyAdmin,
      email: verifyAdmin?.email,
      role: verifyAdmin?.role,
      hasPassword: !!verifyAdmin?.password
    });

    // Create restaurant owners
    const owners = await User.create(restaurantOwners);
    console.log('Restaurant owners created:', owners.map(o => ({
      email: o.email,
      role: o.role,
      hasPassword: !!o.password
    })));

    // Create restaurants with owners assigned (each restaurant gets its own owner)
    const restaurantsWithOwners = sampleRestaurants.map((restaurant, index) => ({
      ...restaurant,
      owner: owners[index]._id  // Each restaurant gets its corresponding owner
    }));

    const restaurants = await Restaurant.create(restaurantsWithOwners);
    console.log('Restaurants created:', restaurants.length);

    // Update owners with their restaurant IDs (each owner gets one restaurant)
    for (let i = 0; i < restaurants.length; i++) {
      const owner = owners[i];  // Each restaurant corresponds to one owner
      owner.restaurantId = restaurants[i]._id;
      await owner.save();
    }

    // Create menu items for each restaurant
    for (const restaurant of restaurants) {
      const menuItems = [];
      
      // Select menu items based on restaurant
      let restaurantMenuItems;
      if (restaurant.name === "Pizza Palace") {
        restaurantMenuItems = pizzaMenuItems;
      } else if (restaurant.name === "Sushi Master") {
        restaurantMenuItems = sushiMenuItems;
      } else if (restaurant.name === "Burger Barn") {
        restaurantMenuItems = burgerMenuItems;
      } else if (restaurant.name === "Spice Garden" || restaurant.name === "Tandoori Nights" || 
                 restaurant.name === "Street Bites" || restaurant.name === "Royal Thali") {
        restaurantMenuItems = indianMenuItems;
      } else if (restaurant.name === "Dosa Delight") {
        restaurantMenuItems = southIndianMenuItems;
      } else if (restaurant.name === "Dragon Palace") {
        restaurantMenuItems = chineseMenuItems;
      } else if (restaurant.name === "Taco Fiesta") {
        restaurantMenuItems = mexicanMenuItems;
      } else if (restaurant.name === "Thai Spice") {
        restaurantMenuItems = thaiMenuItems;
      }

      if (restaurantMenuItems) {
        // Add starters
        for (const item of restaurantMenuItems.starters) {
          menuItems.push({
            ...item,
            restaurantId: restaurant._id
          });
        }

        // Add main course
        for (const item of restaurantMenuItems.mainCourse) {
          menuItems.push({
            ...item,
            restaurantId: restaurant._id
          });
        }

        // Add desserts
        for (const item of restaurantMenuItems.desserts) {
          menuItems.push({
            ...item,
            restaurantId: restaurant._id
          });
        }

        // Create menu items
        const createdMenuItems = await MenuItem.create(menuItems);

        // Update restaurant with menu items
        restaurant.menuItems = createdMenuItems.map(item => item._id);
        await restaurant.save();
      }
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
} 