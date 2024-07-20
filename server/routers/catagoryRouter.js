const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/catagoryController');

router.post('/create', categoryController.create);
router.post('/read', categoryController.read);

module.exports = router;
