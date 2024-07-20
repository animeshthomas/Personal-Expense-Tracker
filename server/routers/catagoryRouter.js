const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/catagoryController');

router.post('/create', categoryController.create);
router.delete('/delete', categoryController.delete);
router.post('/read', categoryController.read);

module.exports = router;
