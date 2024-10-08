const express = require('express');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Middleware pour vérifier l'authentification
router.use(authenticate);

// Créer un nouvel utilisateur (déjà créé dans auth.js)
router.post('/', async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send('Utilisateur créé');
});

// Modifier un utilisateur
router.put('/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
});

// Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Récupérer les détails d'un utilisateur
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});

// Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

module.exports = router;
