const AppError = require('../../utils/appError');
const pool = require('../../dbConfig');

const GeneralCheckers = {
    async checkRequiredFields(data, requiredFields) {
        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            throw new AppError(`Champs manquants: ${missingFields.join(', ')}`, 400);
        }
    },

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

    async checkUserLanguages(languagesName) {
        const languages = await pool.query('SELECT * FROM languages WHERE name = ANY($1)', [languagesName]);
        if (languages.rowCount !== languagesName.length) {
            throw new AppError('Langue(s) non trouvée(s)', 404);
        }
    },

    async checkBoatExists(boatId) {
        const boat = await pool.query('SELECT * FROM boats WHERE id = $1', [boatId]);
        if (boat.rowCount === 0) {
            throw new AppError('Bateau non trouvé', 404);
        }
    },

    async checkEquipmentExists(equipmentName) {
        const equipment = await pool.query('SELECT * FROM equipments WHERE name = $1', [equipmentName]);
        if (equipment.rowCount === 0) {
            throw new AppError('Équipement non trouvé', 404);
        }
    },

    async checkTripExists(tripId) {
        const trip = await pool.query('SELECT * FROM trips WHERE id = $1', [tripId]);
        if (trip.rowCount === 0) {
            throw new AppError('Sortie de pêche non trouvée', 404);
        }
    },

    async checkReservationExists(reservationId) {
        const reservation = await pool.query('SELECT * FROM reservations WHERE id = $1', [reservationId]);
        if (reservation.rowCount === 0) {
            throw new AppError('Réservation non trouvée', 404);
        }
    },

    async checkLogExists(logId) {
        const log = await pool.query('SELECT * FROM fishing_logs WHERE id = $1', [logId]);
        if (log.rowCount === 0) {
            throw new AppError('Carnet de pêche non trouvé', 404);
        }
    }
}

module.exports = GeneralCheckers;
