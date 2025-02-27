const User = require('../models/userModel');
const bcrypt = require("bcryptjs");
const catchAsync = require('../../utils/catchAsync');

exports.createUser = catchAsync(async (req, res) => {
    const { firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number, spokenLanguages } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.createUser({ firstname, lastname, email, password: hashedPassword, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number, spokenLanguages });
    res.status(200).json(user);
});

exports.updateUser = catchAsync(async (req, res) => {
    const updatedUser = await User.updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
});

exports.patchUser = catchAsync(async (req, res) => {
    const patchedUser = await User.patchUser(req.params.id, req.body);
    res.status(200).json(patchedUser);
});

exports.deleteUser = catchAsync(async (req, res) => {
    await User.deleteUser(req.params.id);
    res.status(204).send('Utilisateur supprimé avec succès');
});

exports.getUser = catchAsync(async (req, res) => {
    const user = await User.getUser(req.params.id);
    res.status(200).json(user);
});

exports.getAllUsers = catchAsync(async (req, res) => {
    const { lastname, city, postal_code, status, activity_type } = req.query;
    const filters = { lastname, city, postal_code, status, activity_type };

    const filteredFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
    );

    const users = await User.getAllUsers(filteredFilters);
    res.json(users);
});
