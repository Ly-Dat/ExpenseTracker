const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Income = require('../models/Income');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace with your JWT secret
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// POST endpoint to add income
router.post('/', auth, async (req, res) => {
  const { category, value, isRefund, account, checked, date, time, from, notes } = req.body;

  try {
    // Verify user exists
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ msg: 'User not found' });

    // Create new income document
    const newIncome = new Income({
      user: req.user.id, // Link to user
      category,
      value,
      isRefund,
      account,
      checked,
      date,
      time,
      from,
      notes,
      createdAt: new Date(),
    });
    await newIncome.save();
    res.status(201).json({ msg: 'Income added successfully', income: newIncome });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;