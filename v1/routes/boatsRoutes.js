const express = require('express');
const boatsController = require('../controllers/boatsController');

const router = express.Router();

// Récupérer tous les bateaux
router.get('/', boatsController.getBoats);

// Récupérer les détails d'un bateau
router.post('/', boatsController.createBoat);

module.exports = router ;
