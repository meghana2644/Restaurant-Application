import express from "express";
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { connectDB } from './db.js';
import router from './routes.js';
import adminRoutes from './routes/adminRoutes.js';
import restaurantOwnerRoutes from './routes/restaurant-owner.js';
import { seedDatabase } from './seed.js';
import { setupVite, serveStatic, log } from "./vite.js";
import dotenv from 'dotenv';
import { authenticateUser } from './middleware/auth.js';

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL // Use environment variable for production URL
    : ['http://localhost:5000', 'http://127.0.0.1:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant-app',
    ttl: 24 * 60 * 60, // 1 day
    autoRemove: 'native', // Use MongoDB's TTL index
    touchAfter: 24 * 3600 // 24 hours
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Use routes
app.use('/api', router);
app.use('/admin', authenticateUser, adminRoutes);
app.use('/api/restaurant-owner', restaurantOwnerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle MongoDB connection errors
  if (err.name === 'MongoServerSelectionError') {
    return res.status(503).json({ 
      message: 'Database service unavailable. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Handle other errors
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ 
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// importantly only setup vite in development and after
// setting up all the other routes so the catch-all route
// doesn't interfere with the other routes
if (app.get("env") === "development") {
  await setupVite(app);
} else {
  serveStatic(app);
}

// Start server
const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected');

    // Seed the database
    //await seedDatabase();
    console.log('Database seeded successfully');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    // Don't exit immediately, give time to read the error
    setTimeout(() => process.exit(1), 1000);
  }
};

startServer(); 