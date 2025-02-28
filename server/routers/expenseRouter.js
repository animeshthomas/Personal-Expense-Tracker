const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/create', expenseController.create);
router.post('/read', expenseController.read);
router.delete('/delete', expenseController.delete);
router.post('/stats', expenseController.getStats);

module.exports = router;
