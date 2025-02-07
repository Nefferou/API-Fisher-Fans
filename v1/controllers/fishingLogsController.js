const FishingLog = require('../models/fishingLogModel');
const AppError = require("../../utils/appError");

exports.createLog = async (req, res) => {
    try {
        const newLog = await FishingLog.createLog(req.body);
        res.status(201).json(newLog);
    } catch (err) {
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la création du carnet de pêche');
    }
};

exports.updateLog = async (req, res) => {
    try {
        const updatedLog = await FishingLog.updateLog(req.params.id, req.body);
        res.status(200).json(updatedLog);
    } catch (err) {
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la mise à jour du carnet de pêche');
    }
};

exports.patchLog = async (req, res) => {
    try {
        const patchedLog = await FishingLog.patchLog(req.params.id, req.body);
        res.status(200).json(patchedLog);
    } catch (err) {
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors du patch du carnet de pêche');
    }
}

exports.deleteLog = async (req, res) => {
    try {
        const deletedLog = await FishingLog.deleteLog(req.params.id);
        res.status(204).json(deletedLog);
    } catch (err) {
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la suppression du carnet de pêche');
    }
};

exports.getLog = async (req, res) => {
    try {
        const log = await FishingLog.getLog(req.params.id);
        res.status(200).json(log);
    } catch (err) {
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la récupération du carnet de pêche');
    }
};

exports.getAllLogs = async (req, res) => {
    try {
        const { ownerId } = req.query;
        const filters = {ownerId};
        Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

        const logs = await FishingLog.getAllLogs(filters);
        res.status(200).json(logs);
    } catch (err) {
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la récupération des carnets de pêche');
    }
};
