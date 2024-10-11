const express = require('express');
const reservationsController = require('../controllers/reservationsController');

const router = express.Router();

// Récupérer toutes les réservations
router.get('/', reservationsController.getReservations);