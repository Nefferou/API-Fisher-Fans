const express = require('express');
const fishingLogsController = require('../controllers/fishingLogsController');

const router = express.Router();

// Récupérer tous les logs de pêche
router.get('/', fishingLogsController.getFishingLogs);