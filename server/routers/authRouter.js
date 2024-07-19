const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.create);
router.get('/view', authController.viewAll);

// router.post('/login', authController.login);
// router.post('/logout', authController.logout);

module.exports = router;
