const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },  // Unique room identifier
  users: [
    {
      username: { type: String, required: true }, // Only store username
    }
  ],
  code: { type: String, default: '', required: true },  // Shared code in the room
  createdAt: { type: Date, default: Date.now }, // Timestamp for room creation
  updatedAt: { type: Date, default: Date.now }, // Timestamp for last update
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
