const AppError = require('./appError');
const pool = require('../dbConfig');

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

    async checkBoatCapacity(boatId, passengers) {
        const boat = await pool.query('SELECT max_capacity FROM boats WHERE id = $1', [boatId]);
        if (boat.rows[0].max_capacity < passengers.length) {
            throw new AppError('Capacité du bateau insuffisante', 403);
        }
    }
}

module.exports = SpecificCheckers;