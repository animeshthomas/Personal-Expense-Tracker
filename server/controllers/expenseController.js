const expenseSchema = require('../schemas/expenseSchemas/expenseSchema');
const categorySchema = require('../schemas/expenseSchemas/catagorySchema');
const User = require('../schemas/authentication/userSchema');
const { body, validationResult } = require('express-validator');

exports.create = [
  // Validate and sanitize fields
  body('date').isDate().withMessage('Invalid date format'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('category').isMongoId().withMessage('Invalid category ID'),
  body('description').trim(),

  async (req, res) => {
    // Extract validation errors from the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, amount, category, description } = req.body;

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ errors: [{ msg: 'User not found' }] });
      }
      expense = new expenseSchema({
        userId: req.user.id,
        date,
        amount,
        category,
        description,
      });
      await expense.save();
      res.json({ msg: 'Expense created successfully', expense });
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
    const expenses = await expenseSchema.find({ userId: req.user.id });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};
