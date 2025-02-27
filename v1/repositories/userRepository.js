const BaseRepository = require("../repositories/baseRepository");

class UserRepository extends BaseRepository {
    static async insertUser(data) {
        const { firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number } = data;
        return await this.querySingle(
            `INSERT INTO users (firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
            [firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number]
        );
    }

    static async updateUserDetails(id, data) {
        const { firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number } = data;
        return await this.querySingle(
            `UPDATE users SET firstname = $1, lastname = $2, email = $3, password = $4, birthday = $5, tel = $6, address = $7, postal_code = $8, city = $9, profile_picture = $10, status = $11, society_name = $12, activity_type = $13, boat_license = $14, insurance_number = $15, siret_number = $16, rc_number = $17
             WHERE id = $18 RETURNING *`,
            [firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number, id]
        );
    }

    static async patchUserDetails(id, data) {
        const { firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number } = data;
        return await this.querySingle(
            `UPDATE users SET firstname = COALESCE($1, firstname), lastname = COALESCE($2, lastname), email = COALESCE($3, email), password = COALESCE($4, password), birthday = COALESCE($5, birthday), tel = COALESCE($6, tel), address = COALESCE($7, address), postal_code = COALESCE($8, postal_code), city = COALESCE($9, city), profile_picture = COALESCE($10, profile_picture), status = COALESCE($11, status), society_name = COALESCE($12, society_name), activity_type = COALESCE($13, activity_type), boat_license = COALESCE($14, boat_license), insurance_number = COALESCE($15, insurance_number), siret_number = COALESCE($16, siret_number), rc_number = COALESCE($17, rc_number)
             WHERE id = $18 RETURNING *`,
            [firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number, id]
        );
    }

    static async deleteUser(id) {
        const query = `
        UPDATE users
        SET
            firstname = '***',
            lastname = '***',
            email = CONCAT('deleted_', id, '@example.com'),
            password = '***',
            birthday = '9000-01-01',
            tel = '***',
            address = '***',
            postal_code = '***',
            city = '***',
            profile_picture = '***',
            society_name = '***',
            boat_license = '***',
            insurance_number = '***',
            siret_number = '***',
            rc_number = '***'
        WHERE
            id = $1
        `;
        await this.querySingle(query, [id]);
        await this.querySingle('DELETE FROM user_languages WHERE user_id = $1', [id]);
    }

    static async getUser(id) {
        return await this.querySingle('SELECT * FROM users WHERE id = $1', [id]);
    }

    static async getUserByEmail(email) {
        return await this.querySingle('SELECT * FROM users WHERE email = $1', [email]);
    }

    static async getAllUsers(filters) {
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

        return await this.query(query, values);
    }

    static async fetchSpokenLanguages(userId) {
        const languageIds = await this.query('SELECT language_id FROM user_languages WHERE user_id = $1', [userId]);
        const spokenLanguages = [];
        for (const languageId of languageIds) {
            const language = await this.querySingle('SELECT name FROM languages WHERE id = $1', [languageId.language_id]);
            spokenLanguages.push(language.name);
        }
        return spokenLanguages;
    }

    static async fetchBoatIds(userId) {
        const boatIds = await this.query('SELECT boat_id FROM user_boats WHERE user_id = $1', [userId]);
        return boatIds.map(boat => boat.boat_id);
    }

    static async associateSpokenLanguages(userId, spokenLanguages) {
        const existingLanguages = await this.query('SELECT * FROM user_languages WHERE user_id = $1', [userId]);
        const existingLanguagesIds = existingLanguages.map(language => language.language_id);

        const languageIds = [];
        for (const language of spokenLanguages) {
            const result = await this.querySingle('SELECT id FROM languages WHERE name = $1', [language]);
            languageIds.push(result.id);
        }

        const newLanguages = languageIds.filter(language => !existingLanguagesIds.includes(language));

        for (const languageId of newLanguages) {
            await this.querySingle('INSERT INTO user_languages (user_id, language_id) VALUES ($1, $2)', [userId, languageId]);
        }
    }
}

module.exports = UserRepository;