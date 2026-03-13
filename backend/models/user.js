const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  songs: [
    {
      spotifyId: String,
      title: String,
      artist: String,
      album: String,
      duration: Number,
      image: String,
      dateAdded: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);