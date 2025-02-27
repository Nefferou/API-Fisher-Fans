const BaseRepository = require("../repositories/baseRepository");

class FishingTripRepository extends BaseRepository {
    static async insertTrip(data) {
        const { information, type, price, cost_type, begin_date, end_date, begin_time, end_time } = data;
        return await this.querySingle(
            `INSERT INTO trips (information, type, price, cost_type, begin_date, end_date, begin_time, end_time)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [information, type, price, cost_type, begin_date, end_date, begin_time, end_time]
        );
    }

    static async updateTripDetails(id, data) {
        const { information, type, price, cost_type, begin_date, end_date, begin_time, end_time } = data;
        return await this.querySingle(
            `UPDATE trips SET information = $1, type = $2, price = $3, cost_type = $4, begin_date = $5, end_date = $6, begin_time = $7, end_time = $8
             WHERE id = $9 RETURNING *`,
            [information, type, price, cost_type, begin_date, end_date, begin_time, end_time, id]
        );
    }

    static async patchTripDetails(id, data) {
        const { information, type, price, cost_type, begin_date, end_date, begin_time, end_time } = data;
        return await this.querySingle(
            `UPDATE trips
             SET information = COALESCE($1, information), type = COALESCE($2, type), price = COALESCE($3, price),
                 cost_type = COALESCE($4, cost_type), begin_date = COALESCE($5, begin_date), end_date = COALESCE($6, end_date),
                 begin_time = COALESCE($7, begin_time), end_time = COALESCE($8, end_time)
             WHERE id = $9 RETURNING *`,
            [information, type, price, cost_type, begin_date, end_date, begin_time, end_time, id]
        );
    }

    static async deleteTrip(id) {
        await this.querySingle('DELETE FROM trip_boat WHERE trip_id = $1', [id]);
        await this.querySingle('DELETE FROM user_trips WHERE trip_id = $1', [id]);
        await this.querySingle('DELETE FROM trip_reservations WHERE trip_id = $1', [id]);
        return await this.querySingle('DELETE FROM trips WHERE id = $1', [id]);
    }

    static async getTrip(id) {
        return await this.querySingle('SELECT * FROM trips WHERE id = $1', [id]);
    }

    static async getAllTrips(filters) {
        let query = `
        SELECT DISTINCT t.*
        FROM trips t
        LEFT JOIN trip_boat tb ON t.id = tb.trip_id
        LEFT JOIN user_trips ut ON t.id = ut.trip_id
        WHERE 1=1
    `;
        const values = [];
        let parameterIndex = 1;

        const addCondition = (condition, value) => {
            query += ` AND ${condition} $${parameterIndex}`;
            values.push(value);
            parameterIndex++;
        };

        if (filters.beginDate) addCondition('t.begin_date >=', filters.beginDate);
        if (filters.endDate) addCondition('t.end_date <=', filters.endDate);
        if (filters.organiserId) addCondition('ut.user_id =', filters.organiserId);
        if (filters.boatId) addCondition('tb.boat_id =', filters.boatId);

        return await this.query(query, values);
    }

    static async fetchTripOrganiser(tripId) {
        const organizer = await this.querySingle('SELECT user_id FROM user_trips WHERE trip_id = $1', [tripId]);
        return organizer.user_id;
    }

    static async fetchTripBoat(tripId) {
        const boat = await this.querySingle('SELECT boat_id FROM trip_boat WHERE trip_id = $1', [tripId]);
        return boat.boat_id;
    }

    static async fetchTripPassengers(tripId) {
        const passengers = await this.querySingle('SELECT SUM(nb_places) FROM reservations r JOIN trip_reservations tr ON r.id = tr.reservation_id WHERE tr.trip_id = $1', [tripId]);
        if (!passengers.sum) return 0;
        return parseInt(passengers.sum);
    }

    static async associateTripToBoat(tripId, boatId) {
        await this.querySingle('INSERT INTO trip_boat (trip_id, boat_id) VALUES ($1, $2)', [tripId, boatId]);
    }

    static async associateTripToUser(tripId, userId) {
        await this.querySingle('INSERT INTO user_trips (trip_id, user_id) VALUES ($1, $2)', [tripId, userId]);
    }

    static async deleteTripAssociations(tripId) {
        await this.querySingle('DELETE FROM trip_boat WHERE trip_id = $1', [tripId]);
        await this.querySingle('DELETE FROM user_trips WHERE trip_id = $1', [tripId]);
    }
}

module.exports = FishingTripRepository;