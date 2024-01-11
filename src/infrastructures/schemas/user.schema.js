const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    mobile: { type: String, required: false },
    last_login_date: { type: String, required: false },
    password: { type: String, required: false },
    created_date: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model('users', userSchema);
