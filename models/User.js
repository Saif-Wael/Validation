const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  gender: { type: String, required: true, enum: ['male', 'female'] }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;