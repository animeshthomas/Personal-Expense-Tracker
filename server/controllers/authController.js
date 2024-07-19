const { body, validationResult } = require('express-validator');
const User = require('../schemas/authentication/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

exports.create = [
  // Validate and sanitize fields
  body('fullname')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Full name can only contain alphabets and spaces'),
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  async (req, res) => {
    // Extract validation errors from the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        fullname,
        email,
        password,
      });
      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      // Return success response
      res.json({ msg: 'User created successfully', payload });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
];
