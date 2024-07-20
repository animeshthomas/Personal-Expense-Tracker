const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/catagoryController');

router.post('/create', categoryController.create);
router.get('/read', categoryController.read);

module.exports = router;


