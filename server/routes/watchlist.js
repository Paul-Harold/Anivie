const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// ==========================================
// 1. DEFINE THE SCHEMA (The Blueprint)
// ==========================================
// This tells MongoDB exactly what data to expect
const watchlistSchema = new mongoose.Schema({
  apiId: Number,
  title: String,
  posterUrl: String,
  mediaType: String,
  watchStatus: String,
  userRating: Number
});

// Create the Model (This automatically creates the 'watchlistitems' collection in the DB)
const WatchlistItem = mongoose.model('WatchlistItem', watchlistSchema);

// ==========================================
// 2. CREATE THE ROUTES
// ==========================================

// POST Route: Add a new anime to the database
// Note: The path is just '/' because server.js already maps this file to '/api/watchlist'
router.post('/', async (req, res) => {
  try {
    // Take the JSON data from Thunder Client (req.body)
    const newItem = new WatchlistItem(req.body);

    // Save it permanently to MongoDB
    const savedItem = await newItem.save();

    // Send back a success status and the saved data (with the new _id)
    res.status(201).json(savedItem);
    
  } catch (error) {
    console.error("❌ Error saving item:", error.message);
    res.status(500).json({ message: "Failed to save item", error: error.message });
  }
});

// ==========================================
// 3. EXPORT THE ROUTER
// ==========================================
// This allows server.js to import these routes
module.exports = router;