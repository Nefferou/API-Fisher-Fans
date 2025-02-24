const BaseModel = require("./baseModel");
const GeneralCheckers = require('../../utils/generalCheckers');
const SpecificCheckers = require('../../utils/specificCheckers');

class FishingTrip extends BaseModel {
    static async createTrip (data) {
        const { information, type, price, cost_type, begin_date, end_date, begin_time, end_time, boat, organiser } = data;

        await GeneralCheckers.checkUserExistsById(organiser, 'Organisateur');
        await GeneralCheckers.checkBoatExists(boat);
        await SpecificCheckers.checkOwnership(organiser, boat);

        const result = await this.querySingle(
            `INSERT INTO trips (information, type, price, cost_type, begin_date, end_date, begin_time, end_time)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [information, type, price, cost_type, begin_date, end_date, begin_time, end_time]
        );

        await this.associateTripToBoat(result.id, boat);
        await this.associateTripToUser(result.id, organiser);

        return result;
    }

    static async updateTrip (id, data) {
        const { information, type, price, cost_type, begin_date, end_date, begin_time, end_time, boat, organiser } = data;

        await GeneralCheckers.checkTripExists(id);
        await GeneralCheckers.checkUserExistsById(organiser, 'Organisateur');
        await GeneralCheckers.checkBoatExists(boat);
        await SpecificCheckers.checkOwnership(organiser, boat);

        const result = await this.querySingle(
            `UPDATE trips SET information = $1, type = $2, price = $3, cost_type = $4, begin_date = $5, end_date = $6, begin_time = $7, end_time = $8
             WHERE id = $9 RETURNING *`,
            [information, type, price, cost_type, begin_date, end_date, begin_time, end_time, id]
        );

        await this.querySingle('DELETE FROM trip_boat WHERE trip_id = $1', [id]);
        await this.querySingle('DELETE FROM user_trips WHERE trip_id = $1', [id]);
        await this.associateTripToBoat(id, boat);
        await this.associateTripToUser(id, organiser);

        return result;
    }

    static async patchTrip (id, data) {
        await GeneralCheckers.checkTripExists(id);

        const currentTrip = await this.getTrip(id);

        const { information, type, price, cost_type, begin_date, end_date, begin_time, end_time, boat, organiser } = data;
        const result = await this.querySingle(
            `UPDATE trips
             SET information = COALESCE($1, information), 
                 type = COALESCE($2, type), 
                 price = COALESCE($3, price), 
                 cost_type = COALESCE($4, cost_type), 
                 begin_date = COALESCE($5, begin_date),
                 end_date = COALESCE($6, end_date),
                 begin_time = COALESCE($7, begin_time),
                 end_time = COALESCE($8, end_time)
             WHERE id = $9 RETURNING *`,
            [information, type, price, cost_type, begin_date, end_date, begin_time, end_time, id]
        );

        if (boat) {
            await GeneralCheckers.checkBoatExists(boat);
            await SpecificCheckers.checkOwnership(currentTrip.organiser, boat);

            await this.querySingle('DELETE FROM trip_boat WHERE trip_id = $1', [id]);
            await this.associateTripToBoat(id, boat);
            result.boat = boat;
        }
        if (organiser) {
            await GeneralCheckers.checkUserExistsById(organiser, 'Organisateur');
            await SpecificCheckers.checkOwnership(organiser, currentTrip.boat);

            await this.querySingle('DELETE FROM user_trips WHERE trip_id = $1', [id]);
            await this.associateTripToUser(id, organiser);
            result.organiser = organiser;
        }

        return result;
    }

    static async deleteTrip (id) {
        await GeneralCheckers.checkTripExists(id);

        await this.querySingle('DELETE FROM trip_boat WHERE trip_id = $1', [id]);
        await this.querySingle('DELETE FROM user_trips WHERE trip_id = $1', [id]);
        await this.querySingle('DELETE FROM trip_reservations WHERE trip_id = $1', [id]);

        return await this.querySingle('DELETE FROM trips WHERE id = $1', [id]);
    }

    static async getTrip (id) {
        await GeneralCheckers.checkTripExists(id);

        const result = await this.querySingle('SELECT * FROM trips WHERE id = $1', [id]);

        result.organiser = await this.fetchTripOrganiser(id);
        result.boat = await this.fetchTripBoat(id);
        result.passengers = await this.fetchTripPassengers(id);
        return result;
    }

    static async getAllTrips (filters) {
        let query = `
            SELECT DISTINCT t.*
            FROM trips t
            LEFT JOIN trip_boat tb ON t.id = tb.trip_id
            LEFT JOIN user_trips ut ON t.id = ut.trip_id
            WHERE 1=1
        `;
        const values = [];
        let parameterIndex = 1;

        if (filters.beginDate) {
            query += ` AND t.begin_date >= $${parameterIndex}`;
            values.push(filters.beginDate);
            parameterIndex++;
        }
        if (filters.endDate) {
            query += ` AND t.end_date <= $${parameterIndex}`;
            values.push(filters.endDate);
            parameterIndex++;
        }
        if (filters.organiserId) {
            await GeneralCheckers.checkUserExistsById(filters.organiserId, 'Organisateur');
            query += ` AND ut.user_id = $${parameterIndex}`;
            values.push(filters.organiserId);
            parameterIndex++;
        }
        if (filters.boatId) {
            await GeneralCheckers.checkBoatExists(filters.boatId);
            query += ` AND tb.boat_id = $${parameterIndex}`;
            values.push(filters.boatId);
            parameterIndex++;
        }

        const result = await this.query(query, values);

        // fetch the associated data
        for (const trip of result) {
            trip.organiser = await this.fetchTripOrganiser(trip.id);
            trip.boat = await this.fetchTripBoat(trip.id);
            trip.passengers = await this.fetchTripPassengers(trip.id);
        }

        return result;
    }

    static async fetchTripOrganiser (tripId) {
        const organizer = await this.querySingle('SELECT user_id FROM user_trips WHERE trip_id = $1', [tripId]);
        return organizer.user_id;
    }

    static async fetchTripBoat (tripId) {
        const boat = await this.querySingle('SELECT boat_id FROM trip_boat WHERE trip_id = $1', [tripId]);
        return boat.boat_id;
    }

    static async fetchTripPassengers (tripId){
        const passengers = await this.querySingle('SELECT SUM(nb_places) FROM reservations r JOIN trip_reservations tr ON r.id = tr.reservation_id WHERE tr.trip_id = $1', [tripId]);
        if (!passengers.sum) return 0;
        return parseInt(passengers.sum);
    }

    static async associateTripToBoat (tripId, boatId) {
        await this.querySingle('INSERT INTO trip_boat (trip_id, boat_id) VALUES ($1, $2)', [tripId, boatId]);
    }

    static async associateTripToUser (tripId, userId) {
        await this.querySingle('INSERT INTO user_trips (trip_id, user_id) VALUES ($1, $2)', [tripId, userId]);
    }
}

module.exports = FishingTrip;
