const FishingTrip = require('../models/fishingTripModel');

exports.getFishingTrips = async (req, res) => {
    const fishingTrips = await FishingTrip.find();
    res.json(fishingTrips);
}

exports.getFishingTrip = async (req, res) => {
    const fishingTrip = await FishingTrip.findById(req.params.id);
    res.json(fishingTrip);
}

exports.createFishingTrip = async (req, res) => {
    const newFishingTrip = new FishingTrip(req.body);
    await newFishingTrip.save();
    res.status(201).send('Sortie de pêche créée');
}

exports.updateFishingTrip = async (req, res) => {
    const fishingTrip = await FishingTrip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(fishingTrip);
}

exports.deleteFishingTrip = async (req, res) => {
    await FishingTrip.findByIdAndDelete(req.params.id);
    res.status(204).send();
}