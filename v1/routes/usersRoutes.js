const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:id', userController.getUser);
router.get('/', userController.getAllUsers);

module.exports = router;
