const express = require('express');
const router = express.Router();
const fishingTripController = require('../controllers/fishingTripsController');

// Route to create a fishing trip
router.post('/', fishingTripController.createTrip);

// Route to update a fishing trip by ID
router.put('/:id', fishingTripController.updateTrip);

// Route to patch a fishing trip by ID
router.patch('/:id', fishingTripController.patchTrip);

// Route to delete a fishing trip by ID
router.delete('/:id', fishingTripController.deleteTrip);

// Route to get a fishing trip by ID
router.get('/:id', fishingTripController.getTrip);

// Route to get all fishing trips
router.get('/', fishingTripController.getAllTrips);

module.exports = router;
