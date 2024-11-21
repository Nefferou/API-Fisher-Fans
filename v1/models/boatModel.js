const pool = require('../../dbConfig');

const Boat = {
    createBoat: async (data) => {
        const { name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power } = data;
        const result = await pool.query(
            `INSERT INTO boats (name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power]
        );
        return result.rows[0];
    },

    updateBoat: async (id, data) => {
        const { name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power } = data;
        const result = await pool.query(
            `UPDATE boats SET name = $1, description = $2, boat_type = $3, picture = $4, licence_type = $5, bail = $6, max_capacity = $7, city = $8, longitude = $9, latitude = $10, motor_type = $11, motor_power = $12
             WHERE id = $13 RETURNING *`,
            [name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power, id]
        );
        return result.rows[0];
    },

    deleteBoat: async (id) => {
        const result = await pool.query('DELETE FROM boats WHERE id = $1', [id]);
        return result.rowCount;
    },

    getBoat: async (id) => {
        const result = await pool.query('SELECT * FROM boats WHERE id = $1', [id]);
        return result.rows[0];
    },

    getAllBoats: async () => {
        const result = await pool.query('SELECT * FROM boats');
        return result.rows;
    }
};

module.exports = Boat;
