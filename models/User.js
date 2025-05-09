const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  age: Number,
  hobbies: String,
  about: String,
  preferredCommunication: [String],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
