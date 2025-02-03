const pool = require('../../dbConfig');
const GeneralCheckers = require('../../utils/generalCheckers');

const User = {
    createUser: async (data) => {
        const { firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number, spokenLanguages } = data;

        // Check if the user already exists and if the spoken languages are valid
        await GeneralCheckers.checkUserExistsByEmail(email);
        await GeneralCheckers.checkUserLanguages(spokenLanguages);

        const result = await pool.query(
            `INSERT INTO users (firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
            [firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number]
        );
        await User.associateSpokenLanguages(result.rows[0].id, spokenLanguages);
        return result.rows[0];
    },

    updateUser: async (id, data) => {
        const { firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number, spokenLanguages } = data;

        // Check if the user exists and if the spoken languages are valid
        await GeneralCheckers.checkUserExistsById(id);
        await GeneralCheckers.checkUserLanguages(spokenLanguages);

        const result = await pool.query(
            `UPDATE users SET firstname = $1, lastname = $2, email = $3, password = $4, birthday = $5, tel = $6, address = $7, postal_code = $8, city = $9, profile_picture = $10, status = $11, society_name = $12, activity_type = $13, boat_license = $14, insurance_number = $15, siret_number = $16, rc_number = $17
             WHERE id = $18 RETURNING *`,
            [firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number, id]
        );
        await User.associateSpokenLanguages(result.rows[0].id, spokenLanguages);
        return result.rows[0];
    },

    patchUser: async (id, data) => {
        // Check if the user exists
        await GeneralCheckers.checkUserExistsById(id);

        const { firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number, spokenLanguages } = data;
        if (spokenLanguages) await GeneralCheckers.checkUserLanguages(spokenLanguages);

        const result = await pool.query(
            `UPDATE users SET firstname = COALESCE($1, firstname), lastname = COALESCE($2, lastname), email = COALESCE($3, email), password = COALESCE($4, password), birthday = COALESCE($5, birthday), tel = COALESCE($6, tel), address = COALESCE($7, address), postal_code = COALESCE($8, postal_code), city = COALESCE($9, city), profile_picture = COALESCE($10, profile_picture), status = COALESCE($11, status), society_name = COALESCE($12, society_name), activity_type = COALESCE($13, activity_type), boat_license = COALESCE($14, boat_license), insurance_number = COALESCE($15, insurance_number), siret_number = COALESCE($16, siret_number), rc_number = COALESCE($17, rc_number)
            WHERE id = $18 RETURNING *`,
            [firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number, id]
        );
        if (spokenLanguages) {
            await User.associateSpokenLanguages(result.rows[0].id, spokenLanguages);
        }
        result.rows[0].spokenLanguages = spokenLanguages;
        return result.rows[0];
    },

    deleteUser: async (id) => {
        // Check if the user exists
        await GeneralCheckers.checkUserExistsById(id);

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

        const result = await pool.query(query, [id]);
        await pool.query('DELETE FROM user_languages WHERE user_id = $1', [id]);
        return result.rowCount;
    },

    getUser: async (id) => {
        // Check if the user exists
        await GeneralCheckers.checkUserExistsById(id);

        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        // Fetch the spoken languages and boat ids
        result.rows[0].spokenLanguages = await User.fetchSpokenLanguages(id);
        result.rows[0].boatIds = await User.fetchBoatIds(id);

        return result.rows[0];
    },

    getUserByEmail: async (email) => {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    },

    getAllUsers: async (filters) => {
        // Base query
        let query = 'SELECT * FROM users';
        const values = [];
        const conditions = [];

        // add WHERE conditions based on filters
        Object.entries(filters).forEach(([key, value], index) => {
            conditions.push(`${key} = $${index + 1}`);
            values.push(value);
        });

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        // Execute the query
        const result = await pool.query(query, values);

        // Fetch the spoken languages and boat ids for each user
        for (const user of result.rows) {
            user.spokenLanguages = await User.fetchSpokenLanguages(user.id);
            user.boatIds = await User.fetchBoatIds(user.id);
        }

        return result.rows;
    },

    fetchSpokenLanguages: async (userId) => {
        const languageIds = await pool.query('SELECT language_id FROM user_languages WHERE user_id = $1', [userId]);
        const spokenLanguages = [];
        for (const languageId of languageIds.rows) {
            const language = await pool.query('SELECT name FROM languages WHERE id = $1', [languageId.language_id]);
            spokenLanguages.push(language.rows[0].name);
        }
        return spokenLanguages;
    },

    fetchBoatIds: async (userId) => {
        const boatIds = await pool.query('SELECT boat_id FROM user_boats WHERE user_id = $1', [userId]);
        return boatIds.rows.map(boat => boat.boat_id);
    },

    associateSpokenLanguages: async (userId, spokenLanguages) => {
        // Check existing languages to avoid duplicates in the user_languages table
        const existingLanguages = await pool.query('SELECT * FROM user_languages WHERE user_id = $1', [userId]);
        const existingLanguagesIds = existingLanguages.rows.map(language => language.language_id);

        // Fetch the language ids
        const languageIds = [];
        for (const language of spokenLanguages) {
            const result = await pool.query('SELECT id FROM languages WHERE name = $1', [language]);
            languageIds.push(result.rows[0].id);
        }

        // Filter out existing languages from the languages array
        const newLanguages = languageIds.filter(language => !existingLanguagesIds.includes(language));

        // Associate the languages with the user
        for (const languageId of newLanguages) {
            await pool.query('INSERT INTO user_languages (user_id, language_id) VALUES ($1, $2)', [userId, languageId]);
        }
    }
};

module.exports = User;
