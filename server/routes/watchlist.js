const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 1. The Schema (Blueprint)
const watchlistSchema = new mongoose.Schema({
 apiId: String, 
  title: String,
  posterUrl: String,
  mediaType: String,
  watchStatus: String,
  userRating: Number,
  personalNotes: String
});

const WatchlistItem = mongoose.model('WatchlistItem', watchlistSchema);

// ==========================================
// 🚨 THE MISSING PIECE: THE GET ROUTE 🚨
// ==========================================
// GET: Fetch all items from the database
router.get('/', async (req, res) => {
  try {
    const items = await WatchlistItem.find(); // Fetches everything!
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
});
router.get('/api/:apiId', async (req, res) => {
  try {
    // Searches your database for the specific TMDB or Jikan ID
    const item = await WatchlistItem.findOne({ apiId: req.params.apiId });
    res.status(200).json(item); // Will return null if you haven't added it to your list yet
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Find the item by its ID and destroy it
    await WatchlistItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Anime deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item", error: error.message });
  }
});
router.put('/:id', async (req, res) => {
  try {
    // findByIdAndUpdate takes 3 things: the ID, the new data, and an option to return the updated version
    const updatedItem = await WatchlistItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } 
    );
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to update item", error: error.message });
  }
});
// ==========================================
// POST: Add a new anime to the database
// ==========================================
router.post('/', async (req, res) => {
  try {
    // 🚨 NEW: 1. Check if the item already exists using its unique apiId
    const existingItem = await WatchlistItem.findOne({ apiId: req.body.apiId });
    
    // 🚨 NEW: 2. If it exists, immediately stop and send a 400 Bad Request error
    if (existingItem) {
      return res.status(400).json({ message: "This item is already in your watchlist!" });
    }

    // 3. If it doesn't exist, proceed with saving it normally
    const newItem = new WatchlistItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);

  } catch (error) {
    res.status(500).json({ message: "Failed to save item", error: error.message });
  }
});

module.exports = router;