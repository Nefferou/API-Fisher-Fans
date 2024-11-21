const pool = require('../../dbConfig');

const User = {
    createUser: async (data) => {
        const { firstname, lastname, email, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number } = data;
        const result = await pool.query(
            `INSERT INTO users (firstname, lastname, email, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
            [firstname, lastname, email, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number]
        );
        return result.rows[0];
    },

    updateUser: async (id, data) => {
        const { firstname, lastname, email, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number } = data;
        const result = await pool.query(
            `UPDATE users SET firstname = $1, lastname = $2, email = $3, birthday = $4, tel = $5, address = $6, postal_code = $7, city = $8, profile_picture = $9, status = $10, society_name = $11, activity_type = $12, boat_license = $13, insurance_number = $14, siret_number = $15, rc_number = $16
             WHERE id = $17 RETURNING *`,
            [firstname, lastname, email, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number, id]
        );
        return result.rows[0];
    },

    deleteUser: async (id) => {
        const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        return result.rowCount;
    },

    getUser: async (id) => {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    },

    getAllUsers: async () => {
        const result = await pool.query('SELECT * FROM users');
        return result.rows;
    }
};

module.exports = User;
