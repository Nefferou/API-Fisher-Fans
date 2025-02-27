const BaseRepository = require("../repositories/baseRepository");

class ReservationRepository extends BaseRepository {
    static async insertReservation(data) {
        const { price, nb_places } = data;
        return await this.querySingle(
            `INSERT INTO reservations (price, nb_places)
             VALUES ($1, $2) RETURNING *`,
            [price, nb_places]
        );
    }

    static async updateReservationDetails(id, data) {
        const { price, nb_places } = data;
        return await this.querySingle(
            `UPDATE reservations SET price = $1, nb_places = $2
             WHERE id = $3 RETURNING *`,
            [price, nb_places, id]
        );
    }

    static async patchReservationDetails(id, data) {
        const { price, nb_places } = data;
        return await this.querySingle(
            `UPDATE reservations
             SET price = COALESCE($1, price), nb_places = COALESCE($2, nb_places)
             WHERE id = $3 RETURNING *`,
            [price, nb_places, id]
        );
    }

    static async deleteReservation(id) {
        await this.querySingle('DELETE FROM user_reservations WHERE reservation_id = $1', [id]);
        await this.querySingle('DELETE FROM trip_reservations WHERE reservation_id = $1', [id]);
        return await this.querySingle('DELETE FROM reservations WHERE id = $1', [id]);
    }

    static async deleteReservationAssociations(id) {
        await this.querySingle('DELETE FROM user_reservations WHERE reservation_id = $1', [id]);
        await this.querySingle('DELETE FROM trip_reservations WHERE reservation_id = $1', [id]);
    }

    static async getReservation(id) {
        return await this.querySingle('SELECT * FROM reservations WHERE id = $1', [id]);
    }

    static async getAllReservations(query, values) {
        return await this.query(query, values);
    }

    static async fetchUserIdTripId(reservationId) {
        const user_id = await this.querySingle('SELECT * FROM user_reservations WHERE reservation_id = $1', [reservationId]);
        const trip_id = await this.querySingle('SELECT * FROM trip_reservations WHERE reservation_id = $1', [reservationId]);
        return { user_id: user_id.user_id, trip_id: trip_id.trip_id };
    }

    static async associateReservationToUser(reservationId, userId) {
        await this.querySingle('INSERT INTO user_reservations (user_id, reservation_id) VALUES ($1, $2)', [userId, reservationId]);
    }

    static async associateReservationToTrip(reservationId, tripId) {
        await this.querySingle('INSERT INTO trip_reservations (trip_id, reservation_id) VALUES ($1, $2)', [tripId, reservationId]);
    }
}

module.exports = ReservationRepository;