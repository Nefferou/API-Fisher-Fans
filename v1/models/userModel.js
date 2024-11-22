const pool = require('../../dbConfig');

const User = {
    createUser: async (data) => {
        const { firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number } = data;
        const result = await pool.query(
            `INSERT INTO users (firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
            [firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number]
        );
        return result.rows[0];
    },

    updateUser: async (id, data) => {
        const { firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number } = data;
        const result = await pool.query(
            `UPDATE users SET firstname = $1, lastname = $2, email = $3, password = $4, birthday = $5, tel = $6, address = $7, postal_code = $8, city = $9, profile_picture = $10, status = $11, society_name = $12, activity_type = $13, boat_license = $14, insurance_number = $15, siret_number = $16, rc_number = $17
             WHERE id = $18 RETURNING *`,
            [firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number, id]
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

    getUserByEmail: async (email) => {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    },

    getAllUsers: async () => {
        const result = await pool.query('SELECT * FROM users');
        return result.rows;
    }
};

module.exports = User;
