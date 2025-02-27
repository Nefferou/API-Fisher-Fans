const User = require('../services/userService');
const catchAsync = require('../../utils/catchAsync');
const {hashPassword} = require('../../utils/bcryptEssentials');

exports.createUser = catchAsync(async (req, res) => {
    const userData = { ...req.body, password: await hashPassword(req.body.password) };
    const user = await User.createUser(userData);
    res.status(201).json(user);
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
