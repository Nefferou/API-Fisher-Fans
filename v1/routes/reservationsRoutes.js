const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationsController');

// Route pour créer une réservation
router.post('/', reservationController.createReservation);

// Route pour mettre à jour une réservation par ID
router.put('/:id', reservationController.updateReservation);

// Route pour supprimer une réservation par ID
router.delete('/:id', reservationController.deleteReservation);

// Route pour obtenir une réservation par ID
router.get('/:id', reservationController.getReservation);

// Route pour obtenir toutes les réservations
router.get('/', reservationController.getAllReservations);

module.exports = router;
