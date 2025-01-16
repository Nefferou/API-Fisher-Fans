const pool = require('../../dbConfig');
const GeneralCheckers = require('../../utils/generalCheckers');
const SpecificCheckers = require('../../utils/specificCheckers');

const FishingTrip = {
    createTrip: async (data) => {
        const { information, type, price, cost_type, date, time, passengers, boat, organiser } = data;

        // Check if the organizer, boat, passengers exist, if the organizer owns the boat and if the boat has enough capacity
        await GeneralCheckers.checkUserExistsById(organiser, 'Organisateur');
        await GeneralCheckers.checkBoatExists(boat);
        for (const passenger of passengers) {
            await GeneralCheckers.checkUserExistsById(passenger, 'Passager(s)');
        }
        await SpecificCheckers.checkOwnership(organiser, boat);
        await SpecificCheckers.checkBoatCapacity(boat, passengers);

        const result = await pool.query(
            `INSERT INTO trips (information, type, price, cost_type, date, time)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [information, type, price, cost_type, date, time]
        );

        // make the associations
        await FishingTrip.associateTripToBoat(result.rows[0].id, boat);
        await FishingTrip.associateTripToUser(result.rows[0].id, organiser);
        for (const passenger of passengers) {
            await FishingTrip.associateTripToPassenger(result.rows[0].id, passenger);
        }

        return result.rows[0];
    },

    updateTrip: async (id, data) => {
        const { information, type, price, cost_type, date, time, passengers, boat, organiser } = data;

        // Check if the trip, organizer, boat, passengers exist, if the organizer owns the boat and if the boat has enough capacity
        await GeneralCheckers.checkTripExists(id);
        await GeneralCheckers.checkUserExistsById(organiser, 'Organisateur');
        await GeneralCheckers.checkBoatExists(boat);
        for (const passenger of passengers) {
            await GeneralCheckers.checkUserExistsById(passenger, 'Passager(s)');
        }
        await SpecificCheckers.checkOwnership(organiser, boat);
        await SpecificCheckers.checkBoatCapacity(boat, passengers);

        const result = await pool.query(
            `UPDATE trips SET information = $1, type = $2, price = $3, cost_type = $4, date = $5, time = $6
             WHERE id = $10 RETURNING *`,
            [information, type, price, cost_type, date, time]
        );

        // update the associations
        await pool.query('DELETE FROM trip_boat WHERE trip_id = $1', [id]);
        await pool.query('DELETE FROM user_trips WHERE trip_id = $1', [id]);
        await pool.query('DELETE FROM trip_passengers WHERE trip_id = $1', [id]);
        await FishingTrip.associateTripToBoat(id, boat);
        await FishingTrip.associateTripToUser(id, organiser);
        for (const passenger of passengers) {
            await FishingTrip.associateTripToPassenger(id, passenger);
        }

        return result.rows[0];
    },

    patchTrip: async (id, data) => {
        // Check if the trip exists
        await GeneralCheckers.checkTripExists(id);

        const currentTrip = await FishingTrip.getTrip(id);

        const { information, type, price, cost_type, date, time, passengers, boat, organiser } = data;
        const result = await pool.query(
            `UPDATE trips
             SET information = COALESCE($1, information), 
                 type = COALESCE($2, type), 
                 price = COALESCE($3, price), 
                 cost_type = COALESCE($4, cost_type), 
                 date = COALESCE($5, date), 
                 time = COALESCE($6, time)
             WHERE id = $7 RETURNING *`,
            [information, type, price, cost_type, date, time, id]
        );

        // update the associations
        if (boat) {
            await GeneralCheckers.checkBoatExists(boat);
            await SpecificCheckers.checkOwnership(currentTrip.organiser, boat);
            await SpecificCheckers.checkBoatCapacity(boat, currentTrip.passengers);

            await pool.query('DELETE FROM trip_boat WHERE trip_id = $1', [id]);
            await FishingTrip.associateTripToBoat(id, boat);
        }
        if (organiser) {
            await GeneralCheckers.checkUserExistsById(organiser, 'Organisateur');
            await SpecificCheckers.checkOwnership(organiser, currentTrip.boat);

            await pool.query('DELETE FROM user_trips WHERE trip_id = $1', [id]);
            await FishingTrip.associateTripToUser(id, organiser);
        }
        if (passengers) {
            for (const passenger of passengers) {
                await GeneralCheckers.checkUserExistsById(passenger, 'Passager(s)');
            }
            await SpecificCheckers.checkBoatCapacity(currentTrip.boat, passengers);

            await pool.query('DELETE FROM trip_passengers WHERE trip_id = $1', [id]);
            for (const passenger of passengers) {
                await FishingTrip.associateTripToPassenger(id, passenger);
            }
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
        await pool.query('DELETE FROM trip_passengers WHERE trip_id = $1', [id]);

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
        // if organizerId provided, check if exists
        if (filters.organiserId) {
            await GeneralCheckers.checkUserExistsById(filters.organiserId, 'Organisateur');
        }

        // if boatId provided, check if exists
        if (filters.boatId) {
            await GeneralCheckers.checkBoatExists(filters.boatId);
        }

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

        if (filters.date) {
            query += ` AND DATE(t.date) = DATE($${parameterIndex})`;
            values.push(filters.date);
            parameterIndex++;
        }
        if (filters.organiserId) {
            query += ` AND ut.user_id = $${parameterIndex}`;
            values.push(filters.organiserId);
            parameterIndex++;
        }
        if (filters.boatId) {
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
        const passengers = await pool.query('SELECT user_id FROM user_trips WHERE trip_id = $1', [tripId]);
        return passengers.rows.map(p => p.user_id);
    },

    associateTripToBoat: async (tripId, boatId) => {
        await pool.query('INSERT INTO trip_boat (trip_id, boat_id) VALUES ($1, $2)', [tripId, boatId]);
    },

    associateTripToUser: async (tripId, userId) => {
        await pool.query('INSERT INTO user_trips (trip_id, user_id) VALUES ($1, $2)', [tripId, userId]);
    },

    associateTripToPassenger: async (tripId, userId) => {
        await pool.query('INSERT INTO trip_passengers (trip_id, user_id) VALUES ($1, $2)', [tripId, userId]);
    },

};

module.exports = FishingTrip;
