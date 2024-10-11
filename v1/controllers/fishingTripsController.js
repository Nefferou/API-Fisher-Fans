const FishingTrip = require('../models/fishingTripModel');

exports.getFishingTrips = async (req, res) => {
    const fishingTrips = await FishingTrip.find();
    res.json(fishingTrips);
}