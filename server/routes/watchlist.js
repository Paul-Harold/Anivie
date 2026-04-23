const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 1. The Schema (Blueprint)
const watchlistSchema = new mongoose.Schema({
  apiId: Number,
  title: String,
  posterUrl: String,
  mediaType: String,
  watchStatus: String,
  userRating: Number
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

router.delete('/:id', async (req, res) => {
  try {
    // Find the item by its ID and destroy it
    await WatchlistItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Anime deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item", error: error.message });
  }
});

// ==========================================
// POST: Add a new anime to the database
// ==========================================
router.post('/', async (req, res) => {
  try {
    const newItem = new WatchlistItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to save item", error: error.message });
  }
});

module.exports = router;