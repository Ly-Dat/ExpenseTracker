const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetCode: {
    type: String,
    default: null, // Allow null when no reset code is set
  },
  resetCodeExpires: {
    type: Date,
    default: null, // Allow null when no expiration is set
  },
});

module.exports = mongoose.model('User', UserSchema);