const pool = require('../../dbConfig');
const GeneralCheckers = require('../../utils/generalCheckers');
const SpecificCheckers = require('../../utils/specificCheckers');

const FishingTrip = {
    createTrip: async (data) => {
        const { information, type, price, cost_type, begin_date, end_date, begin_time, end_time, boat, organiser } = data;

        // Check if the organizer, boat, if the organizer owns the boat
        await GeneralCheckers.checkUserExistsById(organiser, 'Organisateur');
        await GeneralCheckers.checkBoatExists(boat);
        await SpecificCheckers.checkOwnership(organiser, boat);

        const result = await pool.query(
            `INSERT INTO trips (information, type, price, cost_type, begin_date, end_date, begin_time, end_time)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [information, type, price, cost_type, begin_date, end_date, begin_time, end_time]
        );

        // make the associations
        await FishingTrip.associateTripToBoat(result.rows[0].id, boat);
        await FishingTrip.associateTripToUser(result.rows[0].id, organiser);

        return result.rows[0];
    },

    updateTrip: async (id, data) => {
        const { information, type, price, cost_type, begin_date, end_date, begin_time, end_time, boat, organiser } = data;

        // Check if the trip, organizer, boat, if the organizer owns the boat and if the boat has enough capacity
        await GeneralCheckers.checkTripExists(id);
        await GeneralCheckers.checkUserExistsById(organiser, 'Organisateur');
        await GeneralCheckers.checkBoatExists(boat);
        await SpecificCheckers.checkOwnership(organiser, boat);

        const result = await pool.query(
            `UPDATE trips SET information = $1, type = $2, price = $3, cost_type = $4, begin_date = $5, end_date = $6, begin_time = $7, end_time = $8
             WHERE id = $10 RETURNING *`,
            [information, type, price, cost_type, begin_date, end_date, begin_time, end_time]
        );

        // update the associations
        await pool.query('DELETE FROM trip_boat WHERE trip_id = $1', [id]);
        await pool.query('DELETE FROM user_trips WHERE trip_id = $1', [id]);
        await FishingTrip.associateTripToBoat(id, boat);
        await FishingTrip.associateTripToUser(id, organiser);

        return result.rows[0];
    },

    patchTrip: async (id, data) => {
        // Check if the trip exists
        await GeneralCheckers.checkTripExists(id);

        const currentTrip = await FishingTrip.getTrip(id);

        const { information, type, price, cost_type, begin_date, end_date, begin_time, end_time, boat, organiser } = data;
        const result = await pool.query(
            `UPDATE trips
             SET information = COALESCE($1, information), 
                 type = COALESCE($2, type), 
                 price = COALESCE($3, price), 
                 cost_type = COALESCE($4, cost_type), 
                 begin_date = COALESCE($5, begin_date),
                 end_date = COALESCE($6, end_date),
                 begin_time = COALESCE($7, begin_time),
                 end_time = COALESCE($8, end_time)
             WHERE id = $7 RETURNING *`,
            [information, type, price, cost_type, begin_date, end_date, begin_time, end_time, id]
        );

        // update the associations
        if (boat) {
            await GeneralCheckers.checkBoatExists(boat);
            await SpecificCheckers.checkOwnership(currentTrip.organiser, boat);
            await SpecificCheckers.checkBoatCapacity(boat, currentTrip.passengers);

            await pool.query('DELETE FROM trip_boat WHERE trip_id = $1', [id]);
            await FishingTrip.associateTripToBoat(id, boat);
            result.rows[0].boat = boat;
        }
        if (organiser) {
            await GeneralCheckers.checkUserExistsById(organiser, 'Organisateur');
            await SpecificCheckers.checkOwnership(organiser, currentTrip.boat);

            await pool.query('DELETE FROM user_trips WHERE trip_id = $1', [id]);
            await FishingTrip.associateTripToUser(id, organiser);
            result.rows[0].organiser = organiser;
        }

        return result.rows[0];
    },

    deleteTrip: async (id) => {
        // Check if the trip exists
        await GeneralCheckers.checkTripExists(id);

        // delete the associated data first
        await pool.query('DELETE FROM trip_boat WHERE trip_id = $1', [id]);
        await pool.query('DELETE FROM user_trips WHERE trip_id = $1', [id]);
        await pool.query('DELETE FROM trip_reservations WHERE trip_id = $1', [id]);

        const result = await pool.query('DELETE FROM trips WHERE id = $1', [id]);
        return result.rowCount;
    },

    getTrip: async (id) => {
        // Check if the trip exists
        await GeneralCheckers.checkTripExists(id);

        const result = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);

        // fetch the associated data
        result.rows[0].organiser = await FishingTrip.fetchTripOrganiser(id);
        result.rows[0].boat = await FishingTrip.fetchTripBoat(id);
        result.rows[0].passengers = await FishingTrip.fetchTripPassengers(id);
        return result.rows[0];
    },

    getAllTrips: async (filters) => {
        // base query
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

        // execute the query
        const result = await pool.query(query, values);

        // fetch the associated data
        for (const trip of result.rows) {
            trip.organiser = await FishingTrip.fetchTripOrganiser(trip.id);
            trip.boat = await FishingTrip.fetchTripBoat(trip.id);
            trip.passengers = await FishingTrip.fetchTripPassengers(trip.id);
        }

        return result.rows;
    },

    fetchTripOrganiser: async (tripId) => {
        const organizer = await pool.query('SELECT user_id FROM user_trips WHERE trip_id = $1', [tripId]);
        return organizer.rows[0].user_id;
    },

    fetchTripBoat: async (tripId) => {
        const boat = await pool.query('SELECT boat_id FROM trip_boat WHERE trip_id = $1', [tripId]);
        return boat.rows[0].boat_id;
    },

    fetchTripPassengers: async (tripId) => {
        const passengers = await pool.query('SELECT SUM(nb_places) FROM reservations r JOIN trip_reservations tr ON r.id = tr.reservation_id WHERE tr.trip_id = $1', [tripId]);
        if (!passengers.rows[0].sum) return 0;
        return parseInt(passengers.rows[0].sum);
    },

    associateTripToBoat: async (tripId, boatId) => {
        await pool.query('INSERT INTO trip_boat (trip_id, boat_id) VALUES ($1, $2)', [tripId, boatId]);
    },

    associateTripToUser: async (tripId, userId) => {
        await pool.query('INSERT INTO user_trips (trip_id, user_id) VALUES ($1, $2)', [tripId, userId]);
    },

};

module.exports = FishingTrip;
