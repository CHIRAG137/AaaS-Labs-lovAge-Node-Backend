const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const friendRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['sent', 'accepted', 'declined'], default: 'sent' },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  age: Number,
  hobbies: String,
  about: String,
  address: String,
  preferredCommunication: [String],
  sentRequestsTo: [friendRequestSchema],
  requestsFrom: [friendRequestSchema],
}, { timestamps: true });

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
