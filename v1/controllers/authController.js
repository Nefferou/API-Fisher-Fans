const catchAsync = require('../../utils/catchAsync');
const Auth = require('../services/authService');

exports.register = catchAsync(async (req, res) => {
    const { firstname, lastname, email, password, birthday } = req.body;
    const user = await Auth.register({ firstname, lastname, email, password, birthday, tel: "", address: "", postal_code: "", city: "", profile_picture: "", status: "", society_name: "", activity_type: "", boat_license: "", insurance_number: "", siret_number: "", rc_number: "", spokenLanguages: [] });
    res.status(201).json(user);
});

exports.login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const { token, user } = await Auth.login(email, password);
    res.status(200).json({ token, user });
});