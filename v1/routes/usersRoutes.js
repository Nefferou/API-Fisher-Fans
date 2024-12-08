const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

// Route to update a new user
router.put('/:id', userController.updateUser);

// Route to delete a user by ID
router.delete('/:id', userController.deleteUser);

// Route to get a user by ID
router.get('/:id', userController.getUser);

// Route to get all users
router.get('/', userController.getAllUsers);

module.exports = router;
