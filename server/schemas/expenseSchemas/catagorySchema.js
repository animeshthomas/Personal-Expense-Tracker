const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpenseUser',
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
