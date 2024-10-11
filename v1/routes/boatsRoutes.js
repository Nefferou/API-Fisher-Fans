const express = require('express');
const boatsController = require('../controllers/boatsController');

const router = express.Router();

// Récupérer tous les bateaux
router.get('/', boatsController.getBoats);

// Récupérer les détails d'un bateau
router.post('/', boatsController.createBoat);

// Créer un bateau
router.get('/:id', boatsController.getBoat);

// Mettre à jour un bateau
router.put('/:id', boatsController.updateBoat);

// Supprimer un bateau
router.delete('/:id', boatsController.deleteBoat);

module.exports = router ;
