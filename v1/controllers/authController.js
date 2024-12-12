const bcrypt = require("bcryptjs");
const User= require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { firstname, lastname, email, password, birthday } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.createUser({ firstname, lastname, email, password: hashedPassword, birthday, tel: "", address: "", postal_code: "", city: "", profile_picture: "", status: "", society_name: "", activity_type: "", boat_license: "", insurance_number: "", siret_number: "", rc_number: "", spokenLanguages: [] });
    res.json(user);
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Email ou mot de passe incorrect');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
    res.json({ token, user: { id: user.id, email: user.email, firstname: user.firstname } });
}