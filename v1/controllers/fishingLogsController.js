const FishingLog = require('../models/fishingLogModel');

exports.getFishingLogs = async (req, res) => {
    const fishingLogs = await FishingLog.find();
    res.json(fishingLogs);
}

exports.getFishingLog = async (req, res) => {
    const fishingLog = await FishingLog.findById(req.params.id);
    res.json(fishingLog);
}

exports.createFishingLog = async (req, res) => {
    const newFishingLog = new FishingLog(req.body);
    await newFishingLog.save();
    res.status(201).send('Journal de pêche créé');
}