const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Register
router.post('/register', authController.register);

// Connection
router.post('/login', authController.login);

module.exports = router;
