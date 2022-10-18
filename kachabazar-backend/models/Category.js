const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  parent: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    required: true,
  },
  children: [],
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
