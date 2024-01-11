const mongoose = require('mongoose');

/* The code is defining a Mongoose schema for a contact object. The schema specifies the structure and
validation rules for the contact object. */
const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: false },
    address: { type: String, required: false },
    is_deleted: { type: Boolean, required: true, default: false },
    deleted_at: { type: String, default: null },
    created_date: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model('members', memberSchema);
