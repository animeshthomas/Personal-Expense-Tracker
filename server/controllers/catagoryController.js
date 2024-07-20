const categorySchema = require('../schemas/expenseSchemas/catagorySchema');
const User = require('../schemas/authentication/userSchema');
const { body, validationResult } = require('express-validator');

exports.create = [
  // Validate and sanitize fields
  body('name').trim().notEmpty().withMessage('Category name is required'),

  async (req, res) => {
    // Extract validation errors from the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ errors: [{ msg: 'User not found' }] });
      }
      const category = new categorySchema({
        name,
        userId: req.user.id,
      });
      await category.save();
      res.json({ msg: 'Category created successfully', category });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  },
];

exports.read = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }
    const categories = await categorySchema.find({ userId: req.user.id });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};


