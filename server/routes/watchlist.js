const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verify = require('../middleware/auth'); // 🚨 Import our Bouncer!

const watchlistSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Tied to the logged-in user
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
// GET: Fetch ONLY the logged-in user's list
// ==========================================
router.get('/', verify, async (req, res) => {
  try {
    // 🚨 Only find items where the userId matches the person logged in!
    const list = await WatchlistItem.find({ userId: req.user.id });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// GET: Fetch a SINGLE item (for Details Page)
// ==========================================
router.get('/api/:apiId', verify, async (req, res) => {
  try {
    // 🚨 Check if THIS user has THIS specific show
    const item = await WatchlistItem.findOne({ apiId: req.params.apiId, userId: req.user.id });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error: error.message });
  }
});

// ==========================================
// POST: Add new item to Watchlist
// ==========================================
router.post('/', verify, async (req, res) => {
  try {
    // Check if THIS user already added THIS show
    const existingItem = await WatchlistItem.findOne({ apiId: req.body.apiId, userId: req.user.id });
    if (existingItem) {
      return res.status(400).json({ message: "Item already exists in your watchlist" });
    }

    const newItem = new WatchlistItem({
      userId: req.user.id, // 🚨 Stamp the item with the user's ID before saving!
      apiId: req.body.apiId,
      title: req.body.title,
      posterUrl: req.body.posterUrl,
      mediaType: req.body.mediaType,
      watchStatus: req.body.watchStatus,
      userRating: req.body.userRating
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// PUT: Update an item (Status, Rating, Notes)
// ==========================================
router.put('/:id', verify, async (req, res) => {
  try {
    // 🚨 Ensure they only update THEIR OWN items
    const updatedItem = await WatchlistItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, 
      req.body,
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ message: "Item not found" });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==========================================
// DELETE: Remove an item
// ==========================================
router.delete('/:id', verify, async (req, res) => {
  try {
    // 🚨 Ensure they only delete THEIR OWN items
    const deletedItem = await WatchlistItem.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedItem) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;