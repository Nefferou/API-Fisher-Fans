const FishingLog = require('../models/fishingLogModel');

exports.getFishingLogs = async (req, res) => {
    const fishingLogs = await FishingLog.find();
    res.json(fishingLogs);
}