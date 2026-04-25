const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true,
    minlength: 3
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6 
  },
  // 🚨 The Verification Locks
  isVerified: {
    type: Boolean,
    default: false // Everyone starts locked out!
  },
  verificationToken: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);