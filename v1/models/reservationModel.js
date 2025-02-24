const BaseModel = require("./baseModel");
const GeneralCheckers = require('../../utils/generalCheckers');
const SpecificCheckers = require("../../utils/specificCheckers");

class Reservation extends BaseModel {
    static async createReservation (data) {
        const { price, nb_places, trip, user } = data;

        await GeneralCheckers.checkTripExists(trip);
        await GeneralCheckers.checkUserExistsById(user);
        await SpecificCheckers.checkBoatCapacity(trip, nb_places);

        const result = await this.querySingle(
            `INSERT INTO reservations (price, nb_places)
             VALUES ($1, $2) RETURNING *`,
            [price, nb_places]
        );

        await this.associateReservationToUser(result.id, user);
        await this.associateReservationToTrip(result.id, trip);

        return result;
    }

    static async updateReservation (id, data) {
        const { price, nb_places, trip, user } = data;

        await GeneralCheckers.checkTripExists(trip);
        await GeneralCheckers.checkUserExistsById(user);
        await SpecificCheckers.checkBoatCapacity(trip, nb_places, id);

        const result = await this.querySingle(
            `UPDATE reservations SET price = $1, nb_places = $2
             WHERE id = $3 RETURNING *`,
            [price, nb_places, id]
        );

        await this.querySingle('DELETE FROM user_reservations WHERE reservation_id = $1', [id]);
        await this.querySingle('DELETE FROM trip_reservations WHERE reservation_id = $1', [id]);
        await this.associateReservationToUser(id, user);
        await this.associateReservationToTrip(id, trip);

        return result;
    }

    static async patchReservation (id, data){
        await GeneralCheckers.checkReservationExists(id);
        const currentReservation = await this.getReservation(id);

        const { price, nb_places } = data;

        if (nb_places) {
            await SpecificCheckers.checkBoatCapacity(currentReservation.trip, nb_places, id);
        }

        return await this.querySingle(
            `UPDATE reservations
             SET price = COALESCE($1, price), nb_places = COALESCE($2, nb_places)
             WHERE id = $3 RETURNING *`,
            [price, nb_places, id]
        );
    }

    static async deleteReservation (id) {
        await GeneralCheckers.checkReservationExists(id);
        await this.querySingle('DELETE FROM user_reservations WHERE reservation_id = $1', [id]);
        await this.querySingle('DELETE FROM trip_reservations WHERE reservation_id = $1', [id]);
        return await this.querySingle('DELETE FROM reservations WHERE id = $1', [id]);
    }

    static async getReservation (id) {
        await GeneralCheckers.checkReservationExists(id);

        const result = await this.querySingle('SELECT * FROM reservations WHERE id = $1', [id]);

        const userTrip = await this.fetchUserIdTripId(id);
        result.tripOrganiser = userTrip.user_id;
        result.trip = userTrip.trip_id;

        return result;
    }

    static async getAllReservations (filters) {
        let query = 'SELECT * FROM reservations';
        const values = [];
        const conditions = [];

        if (filters.tripId) {
            await GeneralCheckers.checkTripExists(filters.tripId);
            const reservations = await this.query('SELECT * FROM trip_reservations WHERE trip_id = $1', [filters.tripId]);
            const reservationIds = reservations.map(reservation => reservation.reservation_id);
            conditions.push(`id IN (${reservationIds.join(', ')})`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const result = await this.query(query, values);

        for (const reservation of result) {
            const ids = await this.fetchUserIdTripId(reservation.id);
            reservation.user = ids.user_id;
            reservation.trip = ids.trip_id;
        }

        return result;
    }

    static async fetchUserIdTripId (reservationId) {
        const user_id = await this.querySingle('SELECT * FROM user_reservations WHERE reservation_id = $1', [reservationId]);
        const trip_id = await this.querySingle('SELECT * FROM trip_reservations WHERE reservation_id = $1', [reservationId]);
        return { user_id: user_id.user_id, trip_id: trip_id.trip_id };
    }

    static async associateReservationToUser (reservationId, userId) {
        await this.querySingle('INSERT INTO user_reservations (user_id, reservation_id) VALUES ($1, $2)', [userId, reservationId]);
    }

    static async associateReservationToTrip (reservationId, tripId) {
        await this.querySingle('INSERT INTO trip_reservations (trip_id, reservation_id) VALUES ($1, $2)', [tripId, reservationId]);
    }
}

module.exports = Reservation;
