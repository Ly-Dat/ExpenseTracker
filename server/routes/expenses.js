const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Expense = require('../models/Expense');
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


// Lấy danh sách giao dịch
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Thêm giao dịch
router.post('/', auth, async (req, res) => {
  console.log(1);
  const { category, value, isRefund, account, checked, date, time, from, notes } = req.body;

  try {
    // Verify user exists
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ msg: 'User not found' });

    // Create new expense document
    const newExpense = new Expense({
      user: req.user.id,
      category,
      value,
      isRefund: isRefund ?? false, // Default to false if not provided
      account,
      checked: checked ?? true, // Default to true if not provided
      date,
      time,
      from: from ?? '', // Default to empty string if not provided
      notes: notes ?? '', // Default to empty string if not provided
      createdAt: new Date(),
    });

    await newExpense.save();
    res.status(201).json({ msg: 'Expense added successfully', expense: newExpense });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;