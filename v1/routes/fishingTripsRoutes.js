const express = require('express');
const router = express.Router();
const fishingTripController = require('../controllers/fishingTripsController');

// Route pour créer une sortie de pêche
router.post('/', fishingTripController.createTrip);

// Route pour mettre à jour une sortie de pêche par ID
router.put('/:id', fishingTripController.updateTrip);

// Route pour supprimer une sortie de pêche par ID
router.delete('/:id', fishingTripController.deleteTrip);

// Route pour obtenir une sortie de pêche par ID
router.get('/:id', fishingTripController.getTrip);

// Route pour obtenir toutes les sorties de pêche
router.get('/', fishingTripController.getAllTrips);

module.exports = router;
