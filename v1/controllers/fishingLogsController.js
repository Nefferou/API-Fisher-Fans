const FishingLog = require('../models/fishingLogModel');

exports.createLog = async (req, res) => {
    try {
        const newLog = await FishingLog.createLog(req.body);
        res.status(201).json(newLog);
    } catch (err) {
        res.status(500).send('Erreur lors de la création du carnet de pêche');
    }
};

exports.updateLog = async (req, res) => {
    try {
        const updatedLog = await FishingLog.updateLog(req.params.id, req.body);
        res.json(updatedLog);
    } catch (err) {
        res.status(500).send('Erreur lors de la mise à jour du carnet de pêche');
    }
};

exports.deleteLog = async (req, res) => {
    try {
        const deletedLog = await FishingLog.deleteLog(req.params.id);
        if (deletedLog) {
            res.status(204).send();
        } else {
            res.status(404).send('Carnet de pêche non trouvé');
        }
    } catch (err) {
        res.status(500).send('Erreur lors de la suppression du carnet de pêche');
    }
};

exports.getLog = async (req, res) => {
    try {
        const log = await FishingLog.getLog(req.params.id);
        if (!log) {
            res.status(404).send('Carnet de pêche non trouvé');
        } else {
            res.json(log);
        }
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération du carnet de pêche');
    }
};

exports.getAllLogs = async (req, res) => {
    try {
        const logs = await FishingLog.getAllLogs();
        res.json(logs);
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des carnets de pêche');
    }
};
