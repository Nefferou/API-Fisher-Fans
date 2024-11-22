const User = require('../models/userModel');

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.updateUser(req.params.id, req.body);
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la mise à jour de l\'utilisateur');
    }
};

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

exports.getAllUsers = async (req, res) => {
    try {
        // get query params
        const { lastname, city, postal_code, status, activity_type } = req.query;
        const filters = { lastname, city, postal_code, status, activity_type };

        // remove undefined filters
        const filteredFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined)
        );

        const users = await User.getAllUsers(filteredFilters);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des utilisateurs');
    }
};
