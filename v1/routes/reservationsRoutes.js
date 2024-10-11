const express = require('express');
const reservationsController = require('../controllers/reservationsController');

const router = express.Router();

// Récupérer toutes les réservations
router.get('/', reservationsController.getReservations);

// Récupérer une réservation par son id
router.get('/:id', reservationsController.getReservation);

// Créer une réservation
router.post('/', reservationsController.createReservation);

// Mettre à jour une réservation
router.put('/:id', reservationsController.updateReservation);

// Supprimer une réservation
router.delete('/:id', reservationsController.deleteReservation);

module.exports = router ;
