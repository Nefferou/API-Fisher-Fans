const express = require('express');
const fishingTripsController = require('../controllers/fishingTripsController');

const router = express.Router();

// Récupérer tous les sorties de pêche
router.get('/', fishingTripsController.getFishingTrips);

// Récupérer une sortie de pêche par son id
router.get('/:id', fishingTripsController.getFishingTrip);

// Créer une sortie de pêche
router.post('/', fishingTripsController.createFishingTrip);

// Mettre à jour une sortie de pêche
router.put('/:id', fishingTripsController.updateFishingTrip);

// Supprimer une sortie de pêche
router.delete('/:id', fishingTripsController.deleteFishingTrip);

module.exports = router ;
