const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const incomeRoutes = require('./routes/income');
require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/income', incomeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// MongoDB connection
const uri = process.env.MONGO_URI;

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('Connected to MongoDB successfully!');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
  }
};

connectDB();

// Bắt buộc để Vercel nhận diện là serverless
module.exports = app;