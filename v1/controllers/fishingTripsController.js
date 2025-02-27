const FishingTrip = require('../services/fishingTripService');
const catchAsync = require('../../utils/catchAsync');

exports.createTrip = catchAsync(async (req, res) => {
    const newTrip = await FishingTrip.createTrip(req.body);
    res.status(201).json(newTrip);
});

exports.updateTrip = catchAsync(async (req, res) => {
    const updatedTrip = await FishingTrip.updateTrip(req.params.id, req.body);
    res.status(200).json(updatedTrip);
});

exports.patchTrip = catchAsync(async (req, res) => {
    const patchedTrip = await FishingTrip.patchTrip(req.params.id, req.body);
    res.status(200).json(patchedTrip);
});

exports.deleteTrip = catchAsync(async (req, res) => {
    await FishingTrip.deleteTrip(req.params.id);
    res.status(204).send("Sortie de pêche supprimée avec succès");
});

exports.getTrip = catchAsync(async (req, res) => {
    const trip = await FishingTrip.getTrip(req.params.id);
    res.status(200).json(trip);
});

exports.getAllTrips = catchAsync(async (req, res) => {
    const {beginDate, endDate, organiserId, boatId} = req.query;
    const filters = {beginDate, endDate, organiserId, boatId};

    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    const trips = await FishingTrip.getAllTrips(filters);
    res.status(200).json(trips);
});
