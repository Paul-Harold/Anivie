// server/models/WatchlistItem.js
const mongoose = require('mongoose');

const watchlistItemSchema = new mongoose.Schema({
  apiId: { 
    type: Number, 
    required: true // We absolutely need this to fetch details later
  },
  title: { 
    type: String, 
    required: true 
  },
  posterUrl: { 
    type: String 
  },
  mediaType: { 
    type: String, 
    enum: ['anime', 'movie', 'tv'], // It MUST be one of these three exact words
    required: true 
  },
  watchStatus: { 
    type: String, 
    enum: ['plan_to_watch', 'watching', 'completed'], 
    default: 'plan_to_watch' // If they don't specify, assume they plan to watch it
  },
  userRating: { 
    type: Number, 
    min: 0, 
    max: 10, 
    default: 0 
  }
}, { 
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt' timestamps!
});

// Compile the schema into a model and export it
module.exports = mongoose.model('WatchlistItem', watchlistItemSchema);