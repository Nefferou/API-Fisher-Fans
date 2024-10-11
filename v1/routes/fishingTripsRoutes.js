const express = require('express');
const fishingTripsController = require('../controllers/fishingTripsController');

const router = express.Router();

// Récupérer tous les sorties de pêche
router.get('/', fishingTripsController.getFishingTrips);

module.exports = router ;
