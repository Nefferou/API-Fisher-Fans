const mongoose = require('mongoose');

const fishingTripSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    boat: { type: mongoose.Schema.Types.ObjectId, ref: 'Boat', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('FishingTrip', fishingTripSchema);
