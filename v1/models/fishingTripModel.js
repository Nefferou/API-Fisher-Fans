const pool = require('../../dbConfig');

const FishingTrip = {
    createTrip: async (data) => {
        const { information, type, price, cost_type, date, time, passengers, boat, organiser } = data;
        const result = await pool.query(
            `INSERT INTO trips (information, type, price, cost_type, date, time, passengers, boat, organiser)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [information, type, price, cost_type, date, time, passengers, boat, organiser]
        );
        return result.rows[0];
    },

    updateTrip: async (id, data) => {
        const { information, type, price, cost_type, date, time, passengers, boat, organiser } = data;
        const result = await pool.query(
            `UPDATE trips SET information = $1, type = $2, price = $3, cost_type = $4, date = $5, time = $6, passengers = $7, boat = $8, organiser = $9
             WHERE id = $10 RETURNING *`,
            [information, type, price, cost_type, date, time, passengers, boat, organiser, id]
        );
        return result.rows[0];
    },

    deleteTrip: async (id) => {
        const result = await pool.query('DELETE FROM trips WHERE id = $1', [id]);
        return result.rowCount;
    },

    getTrip: async (id) => {
        const result = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);
        return result.rows[0];
    },

    getAllTrips: async () => {
        const result = await pool.query('SELECT * FROM trips');
        return result.rows;
    }
};

module.exports = FishingTrip;
