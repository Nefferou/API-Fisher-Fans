const pool = require('../../dbConfig');
const GeneralCheckers = require('../../utils/generalCheckers');
const SpecificCheckers = require("../../utils/specificCheckers");

const Reservation = {
    createReservation: async (data) => {
        const { price, nb_places, trip, user } = data;

        await GeneralCheckers.checkTripExists(trip);
        await GeneralCheckers.checkUserExistsById(user);
        await SpecificCheckers.checkBoatCapacity(trip, nb_places);

        const result = await pool.query(
            `INSERT INTO reservations (price, nb_places)
             VALUES ($1, $2) RETURNING *`,
            [price, nb_places]
        );

        await Reservation.associateReservationToUser(result.rows[0].id, user);
        await Reservation.associateReservationToTrip(result.rows[0].id, trip);

        return result.rows[0];
    },

    updateReservation: async (id, data) => {
        const { price, nb_places, trip, user } = data;

        await GeneralCheckers.checkTripExists(trip);
        await GeneralCheckers.checkUserExistsById(user);
        await SpecificCheckers.checkBoatCapacity(trip, nb_places, id);

        const result = await pool.query(
            `UPDATE reservations SET price = $1, nb_places = $2
             WHERE id = $3 RETURNING *`,
            [price, nb_places, id]
        );

        await pool.query('DELETE FROM user_reservations WHERE reservation_id = $1', [id]);
        await pool.query('DELETE FROM trip_reservations WHERE reservation_id = $1', [id]);
        await Reservation.associateReservationToUser(id, user);
        await Reservation.associateReservationToTrip(id, trip);

        return result.rows[0];
    },

    patchReservation: async (id, data) => {
        await GeneralCheckers.checkReservationExists(id);
        const currentReservation = await Reservation.getReservation(id);

        const { price, nb_places } = data;

        if (nb_places) {
            await SpecificCheckers.checkBoatCapacity(currentReservation.trip, nb_places, id);
        }

        const result = await pool.query(
            `UPDATE reservations
             SET price = COALESCE($1, price), nb_places = COALESCE($2, nb_places)
             WHERE id = $3 RETURNING *`,
            [price, nb_places, id]
        );

        return result.rows[0];
    },

    deleteReservation: async (id) => {
        await GeneralCheckers.checkReservationExists(id);
        await pool.query('DELETE FROM user_reservations WHERE reservation_id = $1', [id]);
        await pool.query('DELETE FROM trip_reservations WHERE reservation_id = $1', [id]);
        const result = await pool.query('DELETE FROM reservations WHERE id = $1', [id]);
        return result.rowCount;
    },

    getReservation: async (id) => {
        await GeneralCheckers.checkReservationExists(id);

        const result = await pool.query('SELECT * FROM reservations WHERE id = $1', [id]);

        const userTrip = await Reservation.fetchUserIdTripId(id);
        result.rows[0].tripOrganiser = userTrip.user_id;
        result.rows[0].trip = userTrip.trip_id;

        return result.rows[0];
    },

    getAllReservations: async (filters) => {
        // base query
        let query = 'SELECT * FROM reservations';
        const values = [];
        const conditions = [];

        if (filters.tripId) {
            await GeneralCheckers.checkTripExists(filters.tripId);
            const reservations = await pool.query('SELECT * FROM trip_reservations WHERE trip_id = $1', [filters.tripId]);
            const reservationIds = reservations.rows.map(reservation => reservation.reservation_id);
            conditions.push(`id IN (${reservationIds.join(', ')})`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const result = await pool.query(query, values);

        for (const reservation of result.rows) {
            const ids = await Reservation.fetchUserIdTripId(reservation.id);
            reservation.user = ids.user_id;
            reservation.trip = ids.trip_id;
        }

        return result.rows;
    },

    fetchUserIdTripId: async (reservationId) => {
        const user_id = await pool.query('SELECT * FROM user_reservations WHERE reservation_id = $1', [reservationId]);
        const trip_id = await pool.query('SELECT * FROM trip_reservations WHERE reservation_id = $1', [reservationId]);
        return { user_id: user_id.rows[0].user_id, trip_id: trip_id.rows[0].trip_id };
    },

    associateReservationToUser: async (reservationId, userId) => {
        await pool.query('INSERT INTO user_reservations (user_id, reservation_id) VALUES ($1, $2)', [userId, reservationId]);
    },

    associateReservationToTrip: async (reservationId, tripId) => {
        await pool.query('INSERT INTO trip_reservations (trip_id, reservation_id) VALUES ($1, $2)', [tripId, reservationId]);
    }
};

module.exports = Reservation;
