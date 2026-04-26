// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// FIX: setServers must be called on the dns module

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://anivie.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// ==========================================
// 🚨 MONGODB CONNECTION 🚨
// ==========================================
mongoose.connect(process.env.MONGO_URI, { 
    serverSelectionTimeoutMS: 5000 
  })
  .then(() => console.log("✅ Successfully connected to MongoDB!"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    // Optional: Exit process if DB connection is critical
    // process.exit(1); 
  });

// Routes
const watchlistRoutes = require('./routes/watchlist');
app.use('/api/watchlist', watchlistRoutes);

const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);
// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ message: "Server is alive and kicking!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;