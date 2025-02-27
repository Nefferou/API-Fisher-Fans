const User= require("../services/userService");
const catchAsync = require('../../utils/catchAsync');
const jwt = require("jsonwebtoken");
const {comparePassword} = require("../../utils/bcryptEssentials");

exports.register = catchAsync(async (req, res) => {
    const { firstname, lastname, email, password, birthday } = req.body;
    const user = await User.createUser({ firstname, lastname, email, password, birthday, tel: "", address: "", postal_code: "", city: "", profile_picture: "", status: "", society_name: "", activity_type: "", boat_license: "", insurance_number: "", siret_number: "", rc_number: "", spokenLanguages: [] });
    res.status(201).json(user);
});

exports.login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.getUserByEmail(email);
    if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).send('Email ou mot de passe incorrect');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
    res.status(200).json({ token, user: { id: user.id, email: user.email, firstname: user.firstname } });
});