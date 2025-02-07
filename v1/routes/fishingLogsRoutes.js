const express = require('express');
const router = express.Router();
const fishingLogController = require('../controllers/fishingLogsController');

// Route to create a fishing log
router.post('/', fishingLogController.createLog);

// Route to update a fishing log by ID
router.put('/:id', fishingLogController.updateLog);

// Route to patch a fishing log by ID
router.patch('/:id', fishingLogController.patchLog);

// Route to delete a fishing log by ID
router.delete('/:id', fishingLogController.deleteLog);

// Route to get a fishing log by ID
router.get('/:id', fishingLogController.getLog);

// Route to get all fishing logs
router.get('/', fishingLogController.getAllLogs);

module.exports = router;
