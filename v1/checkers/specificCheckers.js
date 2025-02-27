const AppError = require('../../utils/appError');
const pool = require('../../dbConfig');

const SpecificCheckers = {
    async checkUserBoatLicense(userId, requiredLicense) {
        const result = await pool.query('SELECT boat_license FROM users WHERE id = $1', [userId]);
        if (result.rowCount === 0 || !result.rows[0].boat_license) {
            throw new AppError('Utilisateur sans permis de bateau', 403);
        }

        const userLicensePrefix = result.rows[0].boat_license.slice(0, 2).toLowerCase();
        if (userLicensePrefix !== requiredLicense.slice(0, 2).toLowerCase()) {
            throw new AppError('Pas de permis bateau valide', 403);
        }
    },

    async checkOwnership(organiserId, boatId) {
        const checkOwnership = await pool.query('SELECT * FROM user_boats WHERE user_id = $1 AND boat_id = $2', [organiserId, boatId]);
        if (checkOwnership.rowCount === 0) {
            throw new AppError('L\'organisateur ne possède pas ce bateau', 403);
        }
    },

    async checkBoatCapacity(tripId, nb_places, reservationId = null) {
        let query = `
        SELECT SUM(nb_places) AS total 
        FROM reservations r 
        JOIN trip_reservations tr ON r.id = tr.reservation_id 
        WHERE tr.trip_id = $1
    `;
        let params = [tripId];

        if (reservationId) {
            query += " AND r.id != $2";
            params.push(reservationId);
        }

        const existing_passengers = await pool.query(query, params);
        const total_passengers = (parseInt(existing_passengers.rows[0].total) || 0) + parseInt(nb_places);

        const boat_capacity = await pool.query(
            'SELECT max_capacity FROM boats b JOIN trip_boat tb ON b.id = tb.boat_id WHERE tb.trip_id = $1',
            [tripId]
        );

        if (total_passengers > boat_capacity.rows[0].max_capacity) {
            throw new AppError('Capacité du bateau dépassée', 403);
        }
    }
}

module.exports = SpecificCheckers;