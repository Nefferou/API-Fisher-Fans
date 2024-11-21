const express = require('express');
const router = express.Router();
const fishingLogController = require('../controllers/fishingLogsController');

// Route pour créer un carnet de pêche
router.post('/', fishingLogController.createLog);

// Route pour mettre à jour un carnet de pêche par ID
router.put('/:id', fishingLogController.updateLog);

// Route pour supprimer un carnet de pêche par ID
router.delete('/:id', fishingLogController.deleteLog);

// Route pour obtenir un carnet de pêche par ID
router.get('/:id', fishingLogController.getLog);

// Route pour obtenir tous les carnets de pêche
router.get('/', fishingLogController.getAllLogs);

module.exports = router;
