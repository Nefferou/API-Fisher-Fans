const AppError = require('./appError');
const pool = require('../dbConfig');

const GeneralCheckers = {
    async checkUserExistsByEmail(email) {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rowCount > 0) {
            throw new AppError('Utilisateur déjà existant', 400);
        }
    },

    async checkUserExistsById(userId, role = 'Utilisateur') {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (user.rowCount === 0) {
            throw new AppError(`${role} non trouvé`, 404);
        }
    },

    async checkBoatExists(boatId) {
        const boat = await pool.query('SELECT * FROM boats WHERE id = $1', [boatId]);
        if (boat.rowCount === 0) {
            throw new AppError('Bateau non trouvé', 404);
        }
    },

    async checkTripExists(tripId) {
        const trip = await pool.query('SELECT * FROM trips WHERE id = $1', [tripId]);
        if (trip.rowCount === 0) {
            throw new AppError('Sortie de pêche non trouvée', 404);
        }
    }
}

module.exports = GeneralCheckers;
