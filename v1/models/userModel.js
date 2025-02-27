const UserRepository = require('../repositories/userRepository');
const GeneralCheckers = require('../../utils/generalCheckers');

class User {
    static async createUser (data) {
        await this.validateUserData(data);
        const result = await UserRepository.insertUser(data);
        await UserRepository.associateSpokenLanguages(result.id, data.spokenLanguages);
        return result;
    }

    static async updateUser (id, data)  {
        await GeneralCheckers.checkUserExistsById(id);
        await this.validateUserData(data);
        const result = await UserRepository.updateUserDetails(id, data);
        await UserRepository.associateSpokenLanguages(result.id, data.spokenLanguages);
        return result;
    }

    static async patchUser (id, data) {
        await GeneralCheckers.checkUserExistsById(id);
        if (data.spokenLanguages) await GeneralCheckers.checkUserLanguages(data.spokenLanguages);
        const result = await UserRepository.patchUserDetails(id, data);
        if (data.spokenLanguages) {
            await UserRepository.associateSpokenLanguages(result.id, data.spokenLanguages);
        }
        result.spokenLanguages = data.spokenLanguages;
        return result;
    }

    static async deleteUser (id) {
        await GeneralCheckers.checkUserExistsById(id);
        return await UserRepository.deleteUser(id);
    }

    static async getUser (id) {
        await GeneralCheckers.checkUserExistsById(id);
        const result = await UserRepository.getUser(id);
        result.spokenLanguages = await UserRepository.fetchSpokenLanguages(id);
        result.boatIds = await UserRepository.fetchBoatIds(id);
        return result;
    }

    static async getUserByEmail (email) {
        return await UserRepository.getUserByEmail(email);
    }

    static async getAllUsers (filters) {
        let query = 'SELECT * FROM users';
        const values = [];
        const conditions = [];

        Object.entries(filters).forEach(([key, value], index) => {
            conditions.push(`${key} = $${index + 1}`);
            values.push(value);
        });

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        const result = await UserRepository.getAllUsers(query, values);

        for (const user of result) {
            user.spokenLanguages = await UserRepository.fetchSpokenLanguages(user.id);
            user.boatIds = await UserRepository.fetchBoatIds(user.id);
        }

        return result;
    }

    static async validateUserData(data) {
        await GeneralCheckers.checkUserExistsByEmail(data.email);
        await GeneralCheckers.checkUserLanguages(data.spokenLanguages);
    }
}

module.exports = User;
