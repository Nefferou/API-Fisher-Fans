const express = require('express');
const router = express.Router();
const boatController = require('../controllers/boatsController');

// Route to create a boat
router.post('/', boatController.createBoat);

// Route to update a boat by ID
router.put('/:id', boatController.updateBoat);

// Route to patch a boat by ID
router.patch('/:id', boatController.patchBoat);

// Route to delete a boat by ID
router.delete('/:id', boatController.deleteBoat);

// Route to get a boat by ID
router.get('/:id', boatController.getBoat);

// Route to get all boats
router.get('/', boatController.getAllBoats);

module.exports = router;
