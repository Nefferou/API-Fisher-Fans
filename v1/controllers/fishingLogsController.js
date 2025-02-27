const FishingLog = require('../services/fishingLogService');
const catchAsync = require('../../utils/catchAsync');

exports.createLog = catchAsync(async (req, res) => {
    const newLog = await FishingLog.createLog(req.body);
    res.status(201).json(newLog);
});

exports.updateLog = catchAsync(async (req, res) => {
    const updatedLog = await FishingLog.updateLog(req.params.id, req.body);
    res.status(200).json(updatedLog);
});

exports.patchLog = catchAsync(async (req, res) => {
    const patchedLog = await FishingLog.patchLog(req.params.id, req.body);
    res.status(200).json(patchedLog);
});

exports.deleteLog = catchAsync(async (req, res) => {
    const deletedLog = await FishingLog.deleteLog(req.params.id);
    res.status(204).json(deletedLog);
});

exports.getLog = catchAsync(async (req, res) => {
    const log = await FishingLog.getLog(req.params.id);
    res.status(200).json(log);
});

exports.getAllLogs = catchAsync(async (req, res) => {
    const { ownerId } = req.query;
    const filters = {ownerId};
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    const logs = await FishingLog.getAllLogs(filters);
    res.status(200).json(logs);
});
