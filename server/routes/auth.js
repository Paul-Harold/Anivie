const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); 

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_anivie_key_2026";

// ==========================================
// POST: Register & Send Email
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or Username already taken." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a secure, random token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      verificationToken
    });
    await newUser.save();

    // Send the verification email
    const verificationLink = `anivie-backend.vercel.app/api/auth/verify/${verificationToken}`;
    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Welcome to AniVie, ${username}!</h2>
        <p>Please verify your email address to unlock your account and start building your library.</p>
        <a href="${verificationLink}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify My Account</a>
      </div>
    `;
    
    await sendEmail(newUser.email, "Verify your AniVie Account", emailHtml);

    res.status(201).json({ message: "Registration successful! Please check your email to verify your account." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

// ==========================================
// GET: Verify the Token (When user clicks link)
// ==========================================
router.get('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).send("Invalid or expired verification link.");

    // Unlock the account!
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Teleport them back to the frontend login page
    res.redirect('http://localhost:5173/auth?verified=true');
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// ==========================================
// POST: Strict Login
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    // 🚨 THE STRICT LOCK: Block them if they haven't clicked the email link
    if (!user.isVerified) {
      return res.status(403).json({ message: "Access denied. Please check your email and verify your account first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { id: user._id, username: user.username }, 
      JWT_SECRET, 
      { expiresIn: '7d' } 
    );

    res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

module.exports = router;