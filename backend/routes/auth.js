const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Check if username is taken
router.get('/check-username/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  res.json({ taken: !!user });
});

// Signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Username already taken' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();
    res.json({ message: 'Account created!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Wrong password' });

    req.session.userId = user._id;
    req.session.isAdmin = user.isAdmin;
    res.json({ message: 'Logged in!', isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

// Get current logged in user
router.get('/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.json({ userId: req.session.userId, isAdmin: req.session.isAdmin });
});

module.exports = router;