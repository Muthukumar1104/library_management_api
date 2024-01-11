const mongoose = require('mongoose');

/* The code is defining a Mongoose schema for a contact object. The schema specifies the structure and
validation rules for the contact object. */
const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: false },
    quantity: { type: String, required: true, index: true, default: 0 },
    rentfee: { type: String, required: false },
    is_deleted: { type: Boolean, required: true, default: false },
    deleted_at: { type: String, default: null },
    created_date: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model('books', bookSchema);
