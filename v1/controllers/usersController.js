const User = require('../models/userModel');
const bcrypt = require("bcryptjs");
const AppError = require("../../utils/AppError");

exports.createUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number, spokenLanguages } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.createUser({ firstname, lastname, email, password: hashedPassword, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number, spokenLanguages });
        res.status(200).json(user);
    }
    catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la création de l\'utilisateur');
    }
}

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.updateUser(req.params.id, req.body);
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la mise à jour de l\'utilisateur');
    }
};

exports.patchUser = async (req, res) => {
    try {
        const patchedUser = await User.patchUser(req.params.id, req.body);
        res.status(200).json(patchedUser);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la mise à jour de l\'utilisateur');
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await User.deleteUser(req.params.id);
        res.status(204).send('Utilisateur supprimé avec succès');
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la suppression de l\'utilisateur');
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.getUser(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la récupération de l\'utilisateur');
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
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la récupération des utilisateurs');
    }
};
