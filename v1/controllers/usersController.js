const User = require('../models/userModel');

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.updateUser(req.params.id, req.body);
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la mise à jour de l\'utilisateur');
    }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.deleteUser(req.params.id);
        if (deletedUser) {
            res.status(204).send();
        } else {
            res.status(404).send('Utilisateur non trouvé');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la suppression de l\'utilisateur');
    }
};

// Obtenir un utilisateur par ID
exports.getUser = async (req, res) => {
    try {
        const user = await User.getUser(req.params.id);
        if (!user) {
            res.status(404).send('Utilisateur non trouvé');
        } else {
            res.json(user);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération de l\'utilisateur');
    }
};

// Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des utilisateurs');
    }
};
