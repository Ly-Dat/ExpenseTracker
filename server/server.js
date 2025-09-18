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

// MongoDB connection
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err.message));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
