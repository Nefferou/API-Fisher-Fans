const ReservationRepository = require('../repositories/reservationRepository');
const GeneralCheckers = require('../checkers/generalCheckers');
const SpecificCheckers = require("../checkers/specificCheckers");
const {reservationRequiredFields} = require('../checkers/requiredFieldsList');

class Reservation {
    static async createReservation (data) {
        await GeneralCheckers.checkRequiredFields(data, reservationRequiredFields);
        await this.validateReservationData(data);
        const result = await ReservationRepository.insertReservation(data);
        await ReservationRepository.associateReservationToUser(result.id, data.user);
        await ReservationRepository.associateReservationToTrip(result.id, data.trip);
        return result;
    }

    static async updateReservation (id, data) {
        await GeneralCheckers.checkRequiredFields(data, reservationRequiredFields);
        await GeneralCheckers.checkReservationExists(id);
        await this.validateReservationData(data, id);
        const result = await ReservationRepository.updateReservationDetails(id, data);
        await ReservationRepository.deleteReservationAssociations(id);
        await ReservationRepository.associateReservationToUser(id, data.user);
        await ReservationRepository.associateReservationToTrip(id, data.trip);
        return result;
    }

    static async patchReservation (id, data){
        await GeneralCheckers.checkReservationExists(id);
        const currentReservation = await this.getReservation(id);
        if (data.nb_places) {
            await SpecificCheckers.checkBoatCapacity(currentReservation.trip, data.nb_places, id);
        }
        return await ReservationRepository.patchReservationDetails(id, data);
    }

    static async deleteReservation (id) {
        await GeneralCheckers.checkReservationExists(id);
        return await ReservationRepository.deleteReservation(id);
    }

    static async getReservation (id) {
        await GeneralCheckers.checkReservationExists(id);
        const result = await ReservationRepository.getReservation(id);
        const userTrip = await ReservationRepository.fetchUserIdTripId(id);
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
            const reservations = await ReservationRepository.getAllReservations('SELECT * FROM trip_reservations WHERE trip_id = $1', [filters.tripId]);
            const reservationIds = reservations.map(reservation => reservation.reservation_id);
            conditions.push(`id IN (${reservationIds.join(', ')})`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const result = await ReservationRepository.getAllReservations(query, values);

        for (const reservation of result) {
            const ids = await ReservationRepository.fetchUserIdTripId(reservation.id);
            reservation.user = ids.user_id;
            reservation.trip = ids.trip_id;
        }

        return result;
    }

    static async validateReservationData(data, id = null) {
        const { trip, user, nb_places } = data;
        await GeneralCheckers.checkTripExists(trip);
        await GeneralCheckers.checkUserExistsById(user);
        await SpecificCheckers.checkBoatCapacity(trip, nb_places, id);
    }
}

module.exports = Reservation;
