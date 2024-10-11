const User = require("../models/userModel");

exports.createUser = async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send('Utilisateur créé');
}

exports.updateUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
}

exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
}

exports.getUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
}

exports.getAllUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
}