const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

// Route to create a new user
router.post('/', userController.createUser);

// Route to update a new user
router.put('/:id', userController.updateUser);

// Route to update a user
router.patch('/:id', userController.patchUser);

// Route to delete a user by ID
router.delete('/:id', userController.deleteUser);

// Route to get a user by ID
router.get('/:id', userController.getUser);

// Route to get all users
router.get('/', userController.getAllUsers);

module.exports = router;
