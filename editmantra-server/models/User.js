const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['user'],  // Only users can have the 'user' role
    default: 'user'  // Default to 'user'
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
