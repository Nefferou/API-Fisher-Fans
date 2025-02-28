const jwt = require('jsonwebtoken');
const User = require('../services/userService');
const { comparePassword, hashPassword} = require('../../utils/bcryptEssentials');
const AppError = require('../../utils/appError');

class Auth {
    static async register(userData) {
        userData.password = await hashPassword(userData.password);
        return await User.createUser(userData);
    }

    static async login(email, password) {
        const user = await User.getUserByEmail(email);
        if (!user || !(await comparePassword(password, user.password))) {
            throw new AppError('Email ou mot de passe incorrect', 401);
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        return { token, user: { id: user.id, email: user.email, firstname: user.firstname } };
    }
}

module.exports = Auth;