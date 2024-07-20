const categorySchema = require('../schemas/expenseSchemas/catagorySchema');
const User = require('../schemas/authentication/userSchema');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.create = [
  // Validate and sanitize fields
  body('name').trim().notEmpty().withMessage('Category name is required'),

  async (req, res) => {
    try {
      const token = req.headers.token;
      if (!token) {
        return res.status(401).json({ errors: [{ msg: 'Unauthorized' }] });
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return res.status(401).json({ errors: [{ msg: 'Token is not valid' }] });
      }

      // Validate request body fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Find the authenticated user
      const user = await User.findById(decoded.user.id);
      if (!user) {
        return res.status(404).json({ errors: [{ msg: 'User not found' }] });
      }

      // Create a new category
      const { name } = req.body;
      const existingCategory = await categorySchema.findOne({
        name: { $regex: new RegExp('^' + name + '$', 'i') },
        userId: decoded.user.id,
      });

      if (existingCategory) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Category with the same name already exists' }] });
      }
      const category = new categorySchema({
        name,
        userId: decoded.user.id,
      });
      await category.save();

      res.json({ msg: 'Category created successfully', category });
    } catch (err) {
      console.error(err.message);
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ errors: [{ msg: 'Token is not valid' }] });
      }
      console.log(err.message);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  },
];

exports.read = async (req, res) => {
  const token = req.headers.token;

  try {
    if (!token) {
      return res.status(401).json({ errors: [{ msg: 'Unauthorized Token' }] });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ errors: [{ msg: 'Unauthorized' }] });
      }

      try {
        const user = await User.findById(decoded.user.id);
        if (!user) {
          return res.status(404).json({ errors: [{ msg: 'User not found' }] });
        }

        // Fetch categories with the userId and default categories without userId
        const categories = await categorySchema.find({
          $or: [{ userId: decoded.user.id }, { userId: { $exists: false } }],
        });

        if (categories.length === 0) {
          return res.status(404).json({ errors: [{ msg: 'No categories found' }] });
        }

        res.json(categories);
      } catch (err) {
        console.error(err);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

exports.delete = async (req, res) => {
  const token = req.headers.token;
  const { id } = req.body;

  try {
    if (!token) {
      return res.status(401).json({ errors: [{ msg: 'Unauthorized Token' }] });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ errors: [{ msg: 'Unauthorized' }] });
      }

      try {
        const user = await User.findById(decoded.user.id);
        if (!user) {
          return res.status(404).json({ errors: [{ msg: 'User not found' }] });
        }

        const category = await categorySchema.findById(id);
        if (!category) {
          return res.status(404).json({ errors: [{ msg: 'Category not found' }] });
        }

        if (category.userId.toString() !== decoded.user.id) {
          return res.status(401).json({ errors: [{ msg: 'Unauthorized' }] });
        }

        await categorySchema.findByIdAndDelete(id);
        res.json({ msg: 'Category deleted successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};
