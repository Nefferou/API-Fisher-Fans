const express = require('express');
const router = express.Router();
const boatController = require('../controllers/boatsController');

// Route pour créer un bateau
router.post('/', boatController.createBoat);

// Route pour mettre à jour un bateau par ID
router.put('/:id', boatController.updateBoat);

// Route pour supprimer un bateau par ID
router.delete('/:id', boatController.deleteBoat);

// Route pour obtenir un bateau par ID
router.get('/:id', boatController.getBoat);

// Route pour obtenir tous les bateaux
router.get('/', boatController.getAllBoats);

module.exports = router;
