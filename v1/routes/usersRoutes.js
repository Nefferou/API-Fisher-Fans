const express = require('express');
const userController = require('../controllers/usersController');
const { authenticate } = require('../../middleware');

const router = express.Router();

// Middleware pour vérifier l'authentification
router.use(authenticate);

// Créer un nouvel utilisateur (déjà créé dans authRoutes.js)
router.post('/', userController.createUser);

// Modifier un utilisateur
router.put('/:id', userController.updateUser);

// Supprimer un utilisateur
router.delete('/:id', userController.deleteUser);

// Récupérer les détails d'un utilisateur
router.get('/:id', userController.getUser);

// Récupérer tous les utilisateurs
router.get('/', userController.getAllUsers);

module.exports = router;
