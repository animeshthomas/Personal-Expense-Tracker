const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/create', expenseController.create);
router.post('/read', expenseController.read);

module.exports = router;
