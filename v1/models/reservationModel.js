const pool = require('../../dbConfig');

const Reservation = {
    createReservation: async (data) => {
        const { price, nb_places, trip, organiser } = data;
        const result = await pool.query(
            `INSERT INTO reservations (price, nb_places, trip, organiser)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [price, nb_places, trip, organiser]
        );
        return result.rows[0];
    },

    updateReservation: async (id, data) => {
        const { price, nb_places, trip, organiser } = data;
        const result = await pool.query(
            `UPDATE reservations SET price = $1, nb_places = $2, trip = $3, organiser = $4
             WHERE id = $5 RETURNING *`,
            [price, nb_places, trip, organiser, id]
        );
        return result.rows[0];
    },

    deleteReservation: async (id) => {
        const result = await pool.query('DELETE FROM reservations WHERE id = $1', [id]);
        return result.rowCount;
    },

    getReservation: async (id) => {
        const result = await pool.query('SELECT * FROM reservations WHERE id = $1', [id]);
        return result.rows[0];
    },

    getAllReservations: async () => {
        const result = await pool.query('SELECT * FROM reservations');
        return result.rows;
    }
};

module.exports = Reservation;
