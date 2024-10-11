const express = require('express');
const fishingLogsController = require('../controllers/fishingLogsController');

const router = express.Router();

// Récupérer tous les logs de pêche
router.get('/', fishingLogsController.getFishingLogs);

// Récupérer un log de pêche par son id
router.get('/:id', fishingLogsController.getFishingLog);

// Créer un log de pêche
router.post('/', fishingLogsController.createFishingLog);

module.exports = router ;
