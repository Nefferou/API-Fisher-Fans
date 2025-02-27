const Boat = require('../services/boatService');
const catchAsync = require('../../utils/catchAsync');

exports.createBoat = catchAsync(async (req, res) => {
    const newBoat = await Boat.createBoat(req.body);
    res.status(201).json(newBoat);
});

exports.updateBoat = catchAsync(async (req, res) => {
    const updatedBoat = await Boat.updateBoat(req.params.id, req.body);
    res.status(200).json(updatedBoat);
});

exports.patchBoat = catchAsync(async (req, res) => {
    const patchedBoat = await Boat.patchBoat(req.params.id, req.body);
    res.status(200).json(patchedBoat);
});

exports.deleteBoat = catchAsync(async (req, res) => {
    await Boat.deleteBoat(req.params.id);
    res.status(204).send("Bateau supprimé avec succès");
});

exports.getBoat = catchAsync (async (req, res) => {
    const boat = await Boat.getBoat(req.params.id);
    res.status(200).json(boat);
});

exports.getAllBoats = catchAsync(async (req, res) => {
    const { ownerId, minLatitude, maxLatitude, minLongitude, maxLongitude } = req.query;
    const filters = { ownerId, minLatitude, maxLatitude, minLongitude, maxLongitude };

    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    const boats = await Boat.getAllBoats(filters);
    res.status(200).json(boats);
});
