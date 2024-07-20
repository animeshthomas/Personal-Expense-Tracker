const expenseSchema = require('../schemas/expenseSchemas/expenseSchema');
const categorySchema = require('../schemas/expenseSchemas/catagorySchema');
const User = require('../schemas/authentication/userSchema');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.create = [
  // Validate and sanitize fields
  body('date').isDate().withMessage('Invalid date format'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('category').isMongoId().withMessage('Invalid category ID'),
  body('description').trim(),

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

      // Create a new expense
      const { date, amount, category, description } = req.body;
      const expense = new expenseSchema({
        userId: decoded.user.id,
        date,
        amount,
        category,
        description,
      });
      await expense.save();

      res.json({ msg: 'Expense created successfully', expense });
    } catch (err) {
      console.error(err.message);
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ errors: [{ msg: 'Token is not valid' }] });
      }
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  },
];

exports.read = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ errors: [{ msg: 'Unauthorized' }] });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ errors: [{ msg: 'Token is not valid' }] });
    }

    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    const expenses = await expenseSchema
      .find({ userId: decoded.user.id })
      .populate('category', 'name')
      .exec();
    return res.json(expenses);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ errors: [{ msg: 'Token is not valid' }] });
    }
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

exports.delete = async (req, res) => {
  try {
    const token = req.headers.token; // Extract token correctly
    console.log(token);
    if (!token) {
      return res.status(401).json({ errors: [{ msg: 'Unauthorized Token' }] });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ errors: [{ msg: 'Token is not valid' }] });
    }

    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }
    console.log(req.body.id);
    const expense = await expenseSchema.findById(req.body.id);
    if (!expense) {
      return res.status(404).json({ errors: [{ msg: 'Expense not found' }] });
    }

    if (expense.userId.toString() !== decoded.user.id) {
      return res.status(401).json({ errors: [{ msg: 'Unauthorized User' }] });
    }

    await expenseSchema.findByIdAndDelete(req.body.id);
    res.json({ msg: 'Expense deleted successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ errors: [{ msg: 'Token is not valid' }] });
    }
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

const startOfDay = date => new Date(date.setHours(0, 0, 0, 0));

const startOfWeek = date => {
  const start = new Date(date);
  const day = start.getDay() || 7;
  if (day !== 1) start.setHours(-24 * (day - 1));
  return start;
};

const startOfMonth = date => new Date(date.getFullYear(), date.getMonth(), 1);

const startOfYear = date => new Date(date.getFullYear(), 0, 1);

exports.getStats = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ errors: [{ msg: 'Unauthorized' }] });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ errors: [{ msg: 'Token is not valid' }] });
    }

    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    const today = new Date();
    const startDay = startOfDay(new Date(today));
    const startWeek = startOfWeek(new Date(today));
    const startMonth = startOfMonth(new Date(today));
    const startYear = startOfYear(new Date(today));
    const lastWeekStart = new Date(startWeek).setDate(startWeek.getDate() - 7);

    // Total spend for the last week
    const lastWeekSpend = await expenseSchema.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(decoded.user.id),
          date: { $gte: new Date(lastWeekStart), $lt: startWeek },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Daily spend
    const dailySpend = await expenseSchema.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(decoded.user.id), date: { $gte: startDay } },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Weekly spend
    const weeklySpend = await expenseSchema.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(decoded.user.id), date: { $gte: startWeek } },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%U', date: '$date' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Monthly spend
    const monthlySpend = await expenseSchema.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(decoded.user.id),
          date: { $gte: startMonth },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Category-wise spend
    const categorySpend = await expenseSchema.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(decoded.user.id) } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      { $unwind: '$categoryDetails' },
      { $group: { _id: '$categoryDetails.name', total: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      lastWeekSpend: lastWeekSpend[0]?.total || 0,
      dailySpend,
      weeklySpend,
      monthlySpend,
      categorySpend,
    });
  } catch (err) {
    console.error(err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ errors: [{ msg: 'Token is not valid' }] });
    }
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};
