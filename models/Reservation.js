const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    fishingTrip: { type: mongoose.Schema.Types.ObjectId, ref: 'FishingTrip', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Reservation', reservationSchema);
