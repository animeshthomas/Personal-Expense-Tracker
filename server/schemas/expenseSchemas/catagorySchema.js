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
    required: false, // This is false because we want to allow categories to be shared among users
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
