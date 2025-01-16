const pool = require('../../dbConfig');
const AppError = require('../../utils/appError');

const FishingTrip = {
    createTrip: async (data) => {
        const { information, type, price, cost_type, date, time, passengers, boat, organiser } = data;

        // Check if the organizer exists
        const checkOrganizer = await pool.query('SELECT * FROM users WHERE id = $1', [organiser]);
        if (checkOrganizer.rowCount === 0) {
            throw new AppError('Organisateur non trouvé', 404);
        }
        // Check if the boat exists
        const checkBoat = await pool.query('SELECT * FROM boats WHERE id = $1', [boat]);
        if (checkBoat.rowCount === 0) {
            throw new AppError('Bateau non trouvé', 404);
        }
        // Check if the passengers exist
        for (const passenger of passengers) {
            const checkPassenger = await pool.query('SELECT * FROM users WHERE id = $1', [passenger]);
            if (checkPassenger.rowCount === 0) {
                throw new AppError('Passager(s) non trouvé', 404);
            }
        }

        // Check if the boat is owned by the organizer
        const checkOwnership = await pool.query('SELECT * FROM user_boats WHERE user_id = $1 AND boat_id = $2', [organiser, boat]);
        if (checkOwnership.rowCount === 0) {
            throw new AppError('L\'organisateur ne possède pas de bateau', 403);
        }

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
        // Check if the trip exists
        const checkTrip = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);
        if (checkTrip.rowCount === 0) {
            throw new AppError('Sortie de pêche non trouvée', 404);
        }

        const { information, type, price, cost_type, date, time, passengers, boat, organiser } = data;
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
        const checkTrip = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);
        if (checkTrip.rowCount === 0) {
            throw new AppError('Sortie de pêche non trouvée', 404);
        }

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
            await pool.query('DELETE FROM trip_boat WHERE trip_id = $1', [id]);
            await FishingTrip.associateTripToBoat(id, boat);
        }
        if (organiser) {
            await pool.query('DELETE FROM user_trips WHERE trip_id = $1', [id]);
            await FishingTrip.associateTripToUser(id, organiser);
        }
        if (passengers) {
            await pool.query('DELETE FROM trip_passengers WHERE trip_id = $1', [id]);
            for (const passenger of passengers) {
                await FishingTrip.associateTripToPassenger(id, passenger);
            }
        }

        return result.rows[0];
    },

    deleteTrip: async (id) => {
        // delete the associated data first
        await pool.query('DELETE FROM trip_boat WHERE trip_id = $1', [id]);
        await pool.query('DELETE FROM user_trips WHERE trip_id = $1', [id]);
        await pool.query('DELETE FROM trip_reservations WHERE trip_id = $1', [id]);
        await pool.query('DELETE FROM trip_passengers WHERE trip_id = $1', [id]);

        const result = await pool.query('DELETE FROM trips WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            throw new AppError('Sortie de pêche non trouvée', 404);
        }
        return result.rowCount;
    },

    getTrip: async (id) => {
        const result = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            throw new AppError('Sortie de pêche non trouvée', 404);
        }

        // fetch the associated data
        result.rows[0].organiser = await FishingTrip.fetchTripOrganiser(id);
        result.rows[0].boat = await FishingTrip.fetchTripBoat(id);
        result.rows[0].passengers = await FishingTrip.fetchTripPassengers(id);
        return result.rows[0];
    },

    getAllTrips: async (filters) => {
        // if organizerId provided, check if exists
        if (filters.organiserId) {
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [filters.organiserId]);
            if (result.rowCount === 0) {
                throw new AppError('Organisateur non trouvé', 404);
            }
        }

        // if boatId provided, check if exists
        if (filters.boatId) {
            const result = await pool.query('SELECT * FROM boats WHERE id = $1', [filters.boatId]);
            if (result.rowCount === 0) {
                throw new AppError('Bateau non trouvé', 404);
            }
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
