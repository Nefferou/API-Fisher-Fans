const pool = require('../../dbConfig');
const AppError = require('../../utils/appError');

const FishingTrip = {
    createTrip: async (data) => {
        const { information, type, price, cost_type, date, time, passengers, boat, organiser } = data;
        const result = await pool.query(
            `INSERT INTO trips (information, type, price, cost_type, date, time, passengers, boat, organiser)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [information, type, price, cost_type, date, time, passengers, boat, organiser]
        );
        return result.rows[0];
    },

    updateTrip: async (id, data) => {
        const { information, type, price, cost_type, date, time, passengers, boat, organiser } = data;
        const result = await pool.query(
            `UPDATE trips SET information = $1, type = $2, price = $3, cost_type = $4, date = $5, time = $6, passengers = $7, boat = $8, organiser = $9
             WHERE id = $10 RETURNING *`,
            [information, type, price, cost_type, date, time, passengers, boat, organiser, id]
        );
        return result.rows[0];
    },

    deleteTrip: async (id) => {
        const result = await pool.query('DELETE FROM trips WHERE id = $1', [id]);
        return result.rowCount;
    },

    getTrip: async (id) => {
        const result = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);
        return result.rows[0];
    },

    getAllTrips: async (filters) => {
        // if organizerId provided, check if exists
        if (filters.organizerId) {
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [filters.organizerId]);
            if (result.rowCount === 0) {
                throw new AppError('Organisateur ou Bateau non trouvé', 404);
            }
        }

        // if boatId provided, check if exists
        if (filters.boatId) {
            const result = await pool.query('SELECT * FROM boats WHERE id = $1', [filters.boatId]);
            if (result.rowCount === 0) {
                throw new AppError('Organisateur ou Bateau non trouvé', 404);
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
        if (filters.organizerId) {
            query += ` AND ut.user_id = $${parameterIndex}`;
            values.push(filters.organizerId);
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
            trip.organizer = await FishingTrip.fetchTripOrganizer(trip.id);
            trip.boat = await FishingTrip.fetchTripBoat(trip.id);
            trip.passengers = await FishingTrip.fetchTripPassengers(trip.id);
        }

        return result.rows;
    },

    fetchTripOrganizer: async (tripId) => {
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
    }
};

module.exports = FishingTrip;
