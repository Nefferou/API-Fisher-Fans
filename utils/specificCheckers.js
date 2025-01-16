const AppError = require('./appError');
const pool = require('../dbConfig');

const SpecificCheckers = {
    async checkUserBoatLicense(userId) {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (!user.rows[0].boat_license) {
            throw new AppError('Pas de permis bateau valide', 403);
        }
    },

    async checkOwnership(organiserId, boatId) {
        const checkOwnership = await pool.query('SELECT * FROM user_boats WHERE user_id = $1 AND boat_id = $2', [organiserId, boatId]);
        if (checkOwnership.rowCount === 0) {
            throw new AppError('L\'organisateur ne possède pas ce bateau', 403);
        }
    },

    async checkBoatCapacity(boatId, passengers) {
        const boat = await pool.query('SELECT max_capacity FROM boats WHERE id = $1', [boatId]);
        if (boat.rows[0].max_capacity < passengers.length) {
            throw new AppError('Capacité du bateau insuffisante', 403);
        }
    }
}

module.exports = SpecificCheckers;