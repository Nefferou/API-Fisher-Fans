const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationsController');

// Route to create a new reservation
router.post('/', reservationController.createReservation);

// Route to update a reservation by ID
router.put('/:id', reservationController.updateReservation);

// Route to delete a reservation by ID
router.delete('/:id', reservationController.deleteReservation);

// Route to get a reservation by ID
router.get('/:id', reservationController.getReservation);

// Route to get all reservations
router.get('/', reservationController.getAllReservations);

module.exports = router;
